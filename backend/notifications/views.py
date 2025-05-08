from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import PushToken
from .serializers import PushTokenSerializer
from .utils import send_push_notification

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_push_token(request):
    token = request.data.get('token')
    if not token:
        return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

    # Delete old tokens if they exist
    PushToken.objects.filter(user=request.user).delete()

    # Save new token
    push_token = PushToken.objects.create(user=request.user, token=token)
    serializer = PushTokenSerializer(push_token)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_test_notification(request):
    try:
        push_token = PushToken.objects.get(user=request.user)
        title = "Test Notification"
        message = "Hello from Django!"
        result = send_push_notification(push_token.token, title, message)
        return Response({'success': 'Notification sent', 'result': result}, status=status.HTTP_200_OK)
    except PushToken.DoesNotExist:
        return Response({'error': 'User has no registered push token'}, status=status.HTTP_404_NOT_FOUND)