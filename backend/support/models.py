from django.db import models
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings

class SupportTicket(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='support_tickets'
    )
    subject = models.CharField(max_length=255)
    message = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='open'
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Ticket #{self.id} - {self.subject}"

    def send_support_notification_email(self):
        subject = f"New Support Ticket: {self.subject}"
        message = (
            f"User: {self.user.email}\n"
            f"Subject: {self.subject}\n"
            f"Message: {self.message}\n\n"
            f"Ticket ID: {self.id}\n"
            f"Status: {self.status}"
        )
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [settings.SUPPORT_EMAIL],
            fail_silently=False,
        )