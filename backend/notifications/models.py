from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class UserPushToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='push_tokens')
    token = models.CharField(max_length=255, unique=True)
    platform = models.CharField(max_length=20)  # 'ios' or 'android'
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'token')


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('message', 'Message'),
        ('reminder', 'Reminder'),
        ('health', 'Health Tip'),
        ('general', 'General'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    body = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default='general')
    is_read = models.BooleanField(default=False)
    data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
        ]