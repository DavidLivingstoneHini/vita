from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from firebase_admin import messaging
from .models import UserPushToken, Notification
from .serializers import UserPushTokenSerializer, NotificationSerializer
from .firebase import initialize_firebase
from django.contrib.auth import get_user_model

User = get_user_model()


class PushTokenView(APIView):
    def post(self, request):
        serializer = UserPushTokenSerializer(data=request.data)
        if serializer.is_valid():
            # Delete existing token if exists
            UserPushToken.objects.filter(
                user=request.user,
                platform=serializer.validated_data['platform']
            ).delete()

            # Create new token
            UserPushToken.objects.create(
                user=request.user,
                **serializer.validated_data
            )
            return Response({'message': 'Push token saved'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NotificationListView(APIView):
    def get(self, request):
        notifications = request.user.notifications.all().order_by('-created_at')[:50]
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)


class SendNotificationView(APIView):
    def post(self, request):
        initialize_firebase()  # Ensure Firebase is initialized

        user_id = request.data.get('user_id')
        title = request.data.get('title')
        body = request.data.get('body')
        notification_type = request.data.get('type', 'general')
        data = request.data.get('data', {})

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Create notification record
        notification = Notification.objects.create(
            user=user,
            title=title,
            body=body,
            notification_type=notification_type,
            data=data
        )

        # Get push tokens
        push_tokens = UserPushToken.objects.filter(user=user).values_list('token', flat=True)

        if not push_tokens:
            return Response({'message': 'No push tokens found'}, status=status.HTTP_200_OK)

        # Prepare Firebase message
        message = messaging.MulticastMessage(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data={
                'title': title,
                'body': body,
                'type': notification_type,
                **data
            },
            tokens=list(push_tokens)
        )

        try:
            response = messaging.send_multicast(message)
            return Response({
                'success': response.success_count,
                'failure': response.failure_count,
                'notification_id': notification.id
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)