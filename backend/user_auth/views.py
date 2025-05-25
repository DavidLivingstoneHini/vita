import uuid
from datetime import timedelta, datetime

from django.conf import settings
from django.core.files.storage import default_storage
from django.core.mail import send_mail
from django.db.models import F, FloatField, ExpressionWrapper
from django.db.models.functions import ACos, Cos, Radians, Sin, Sqrt
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.html import strip_tags
from rest_framework import status, generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenViewBase

from .models import User, Gym
from .serializers import (
    LoginSerializer,
    UserSerializer,
    RegisterSerializer,
    PasswordChangeSerializer,
    PasswordResetConfirmSerializer,
    UserPermissionsSerializer, GymSerializer
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

        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response(
                {"detail": "Invalid or expired refresh token"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Get the user from the refresh token
        refresh = RefreshToken(request.data['refresh'])
        user_id = refresh.payload.get('user_id')

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Generate new tokens
        new_refresh = RefreshToken.for_user(user)
        access_token = str(new_refresh.access_token)
        refresh_token = str(new_refresh)

        # Calculate expiration time
        expiration_time = datetime.utcnow() + api_settings.ACCESS_TOKEN_LIFETIME

        return Response({
            'access': access_token,
            'refresh': refresh_token,
            'expires_in': expiration_time.isoformat() + 'Z',
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)


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
            return Response(
                {'error': 'No image provided'},
                status=status.HTTP_400_BAD_REQUEST,
                content_type='application/json'  # Explicitly set content type
            )

        try:
            file = request.FILES['profile_picture']

            # Validate file size
            if file.size > 2 * 1024 * 1024:
                return Response(
                    {'error': 'Image size exceeds 2MB limit'},
                    status=status.HTTP_400_BAD_REQUEST,
                    content_type='application/json'
                )

            # Validate file type
            valid_types = ['image/jpeg', 'image/png']
            if file.content_type not in valid_types:
                return Response(
                    {'error': 'Invalid image type. Only JPEG and PNG are allowed'},
                    status=status.HTTP_400_BAD_REQUEST,
                    content_type='application/json'
                )

            # Generate unique filename
            file_ext = file.name.split('.')[-1]
            file_name = f'profile_pictures/{user.id}_profile_{uuid.uuid4().hex[:8]}.{file_ext}'

            # Save file
            file_path = default_storage.save(file_name, file)
            file_url = f"{settings.MEDIA_URL}{file_path}"

            # Update user
            user.profile_picture = file_url
            user.save()

            return Response(
                {'profile_picture': file_url},
                status=status.HTTP_200_OK,
                content_type='application/json'
            )

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content_type='application/json'
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


class GymListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')
        radius = float(request.query_params.get('radius', 10))  # Default 10km radius

        if not lat or not lng:
            return Response(
                {"error": "Location coordinates are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            lat = float(lat)
            lng = float(lng)
            request.user_location = {'lat': lat, 'lng': lng}

            # Haversine formula in Django ORM
            dlat = Radians(F('latitude') - lat)
            dlong = Radians(F('longitude') - lng)

            a = (
                    Sin(dlat / 2) * Sin(dlat / 2) +
                    Cos(Radians(lat)) *
                    Cos(Radians(F('latitude'))) *
                    Sin(dlong / 2) * Sin(dlong / 2)
            )

            c = 2 * ACos(Sqrt(a))
            distance = ExpressionWrapper(6371 * c, output_field=FloatField())

            # Filter gyms within radius
            gyms = Gym.objects.annotate(
                distance=distance
            ).filter(
                distance__lte=radius
            ).order_by('distance')

            serializer = GymSerializer(gyms, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response(
                {"error": "Invalid location parameters"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )