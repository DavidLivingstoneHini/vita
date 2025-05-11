from rest_framework import serializers
from .models import UserPushToken, Notification
from django.utils.timesince import timesince


class UserPushTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPushToken
        fields = ['token', 'platform']
        extra_kwargs = {
            'token': {'required': True},
            'platform': {'required': True}
        }


class NotificationSerializer(serializers.ModelSerializer):
    time_display = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'body', 'notification_type',
            'is_read', 'data', 'created_at', 'time_display'
        ]
        read_only_fields = ['created_at']

    def get_time_display(self, obj):
        return timesince(obj.created_at) + ' ago'