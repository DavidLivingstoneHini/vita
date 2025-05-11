from django.urls import path
from .views import (
    PushTokenView,
    NotificationListView,
    SendNotificationView
)

urlpatterns = [
    path('api/push-token/', PushTokenView.as_view(), name='push-token'),
    path('api/notifications/', NotificationListView.as_view(), name='notification-list'),
    path('api/notifications/send/', SendNotificationView.as_view(), name='send-notification'),
]