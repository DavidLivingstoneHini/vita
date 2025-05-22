import os
import uuid

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from django.conf import settings
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenViewBase
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta, datetime
from rest_framework_simplejwt.settings import api_settings
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage

from .models import User
from .serializers import (
    LoginSerializer,
    UserSerializer,
    RegisterSerializer,
    PasswordChangeSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    UserPermissionsSerializer
)


class SignUpView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data, context={'request': request})

        try:
            if serializer.is_valid(raise_exception=True):
                user = serializer.save()
                refresh = RefreshToken.for_user(user)

                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': UserSerializer(user).data,
                    "message": "Registration successful"
                }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            expiration_time = datetime.utcnow() + api_settings.ACCESS_TOKEN_LIFETIME
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'expires_in': expiration_time.isoformat() + 'Z',
                "user": UserSerializer(user).data,
                "message": "Login successful"
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': 'Hello, authenticated user!'}, status=status.HTTP_200_OK)


class RefreshTokenView(TokenViewBase):
    serializer_class = TokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response(
                {"detail": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "If this email exists, you will receive a password reset link"},
                status=status.HTTP_200_OK
            )

        user.reset_password_token = uuid.uuid4()
        user.reset_password_token_expires = timezone.now() + timedelta(hours=1)
        user.save()

        reset_link = f"{settings.FRONTEND_URL}/reset-password/{user.reset_password_token}/"

        subject = 'Password Reset Request'
        html_message = render_to_string('password_reset_email.html', {
            'user': user,
            'reset_link': reset_link,
        })
        plain_message = strip_tags(html_message)

        send_mail(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            html_message=html_message,
            fail_silently=False,
        )

        return Response(
            {"detail": "Password reset link has been sent to your email"},
            status=status.HTTP_200_OK
        )


class PasswordResetConfirmView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Password has been reset successfully'},
                            status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfilePictureView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request):
        user = request.user
        if 'profile_picture' not in request.FILES:
            return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)

        file = request.FILES['profile_picture']
        if file.size > 2 * 1024 * 1024:
            return Response(
                {'error': 'Image size exceeds 2MB limit'},
                status=status.HTTP_400_BAD_REQUEST
            )

        valid_types = ['image/jpeg', 'image/png', 'image/gif']
        if file.content_type not in valid_types:
            return Response(
                {'error': 'Invalid image type. Only JPEG, PNG, and GIF are allowed'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            file_name = default_storage.save(f'profile_pictures/{user.id}_{file.name}', file)
            file_url = request.build_absolute_uri(default_storage.url(file_name))

            user.profile_picture = file_url
            user.save()

            return Response({'profile_picture': file_url}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request):
        user = request.user
        if not user.profile_picture:
            return Response(
                {'error': 'No profile picture to remove'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            file_path = user.profile_picture.split('/media/')[-1]
            default_storage.delete(file_path)

            user.profile_picture = None
            user.save()

            return Response(
                {'message': 'Profile picture removed successfully'},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PrivacySettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'showEmail': True,
            'showPhone': False,
            'searchVisibility': True,
            'dataSharing': False,
        }, status=status.HTTP_200_OK)

    def put(self, request):
        return Response({'message': 'Privacy settings updated'}, status=status.HTTP_200_OK)


class SecuritySettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'twoFactorAuth': False,
            'loginAlerts': True,
            'passwordUpdateRequired': False,
        }, status=status.HTTP_200_OK)

    def put(self, request):
        return Response({'message': 'Security setting updated'}, status=status.HTTP_200_OK)


class AccountDeactivationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user.is_active = False
        user.save()
        return Response({'message': 'Account deactivated'}, status=status.HTTP_200_OK)


class TimezoneView(APIView):
    permission_classes = [IsAuthenticated]

    TIMEZONES = [
        {'label': 'Eastern Time (ET)', 'value': 'et', 'offset': '-05:00'},
        {'label': 'Central Time (CT)', 'value': 'ct', 'offset': '-06:00'},
        {'label': 'Mountain Time (MT)', 'value': 'mt', 'offset': '-07:00'},
        {'label': 'Pacific Time (PT)', 'value': 'pt', 'offset': '-08:00'},
        {'label': 'Alaska Time (AKT)', 'value': 'akt', 'offset': '-09:00'},
        {'label': 'Hawaii-Aleutian Time (HAT)', 'value': 'hat', 'offset': '-10:00'},
        {'label': 'Atlantic Time (AT)', 'value': 'at', 'offset': '-04:00'},
        {'label': 'Newfoundland Time (NT)', 'value': 'nt', 'offset': '-03:30'},
        {'label': 'Greenwich Mean Time (GMT)', 'value': 'gmt', 'offset': '+00:00'},
        {'label': 'Central European Time (CET)', 'value': 'cet', 'offset': '+01:00'},
        {'label': 'Eastern European Time (EET)', 'value': 'eet', 'offset': '+02:00'},
        {'label': 'Moscow Time (MSK)', 'value': 'msk', 'offset': '+03:00'},
        {'label': 'India Standard Time (IST)', 'value': 'ist', 'offset': '+05:30'},
        {'label': 'China Standard Time (CST)', 'value': 'cst', 'offset': '+08:00'},
        {'label': 'Japan Standard Time (JST)', 'value': 'jst', 'offset': '+09:00'},
        {'label': 'Australian Eastern Time (AET)', 'value': 'aet', 'offset': '+10:00'},
    ]

    def put(self, request):
        user = request.user
        timezone = request.data.get('timezone')

        if not timezone:
            return Response(
                {'error': 'Timezone is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        valid_timezones = [tz['value'] for tz in self.TIMEZONES]
        if timezone not in valid_timezones:
            return Response(
                {'error': 'Invalid timezone'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.timezone = timezone
        user.save()

        return Response(
            {'message': 'Timezone updated successfully'},
            status=status.HTTP_200_OK
        )


class UserPermissionsView(generics.RetrieveUpdateAPIView):
    serializer_class = UserPermissionsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user