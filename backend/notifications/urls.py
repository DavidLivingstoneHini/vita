from django.urls import path
from .views import save_push_token, send_test_notification

urlpatterns = [
    path('save-push-token/', save_push_token, name='save_push_token'),
    path('send-test-notification/', send_test_notification, name='send_test_notification'),
]