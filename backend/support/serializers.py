from rest_framework import serializers
from .models import SupportTicket

class SupportTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = ['id', 'subject', 'message', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at', 'user']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['user'] = request.user
        ticket = SupportTicket.objects.create(**validated_data)
        ticket.send_support_notification_email()
        return ticket