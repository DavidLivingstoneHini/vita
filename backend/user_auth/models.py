from datetime import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.core.validators import RegexValidator, MaxLengthValidator, MinLengthValidator
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
import uuid
import re


def validate_health_profile(value):
    expected_structure = {
        'height': int,
        'weight': int,
        'allergies': list
    }
    for key, expected_type in expected_structure.items():
        if key not in value or not isinstance(value[key], expected_type):
            raise ValidationError(
                f'Invalid health profile structure. Expected {key} to be of type {expected_type.__name__}')


class CustomUserManager(BaseUserManager):
    def _create_user(self, email, phone_number, password, **extra_fields):
        if not email and not phone_number:
            raise ValueError('Either email or phone number must be set')

        if email:
            email = self.normalize_email(email).lower()
        user = self.model(email=email, phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email=None, phone_number=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, phone_number, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self._create_user(email, None, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]

    email = models.EmailField(max_length=255, unique=True, blank=True, null=True)
    phone_number = models.CharField(
        max_length=13,
        unique=True,
        blank=True,
        null=True,
        validators=[RegexValidator(r'^\+?1?\d{9,15}$', 'Enter a valid phone number.')]
    )
    full_name = models.CharField(max_length=255, blank=False, null=False, validators=[
        RegexValidator(
            regex=r'^[a-zA-Z\s\-\' ]{2,50}$',
            message='Full name contains invalid characters. Please use only letters, spaces, hyphen, and apostrophe.'
        )
    ])
    health_profile = models.JSONField(null=True, blank=True, validators=[validate_health_profile])
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES, blank=True, null=True)
    profile_picture = models.CharField(max_length=255, blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    reset_password_token = models.UUIDField(null=True, blank=True)
    reset_password_token_expires = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    timezone = models.CharField(max_length=50, blank=True, null=True)
    country = models.CharField(max_length=2, blank=True, null=True)
    region = models.CharField(max_length=5, blank=True, null=True)
    allow_location = models.BooleanField(default=False)
    allow_notifications = models.BooleanField(default=True)
    allow_camera = models.BooleanField(default=False)
    allow_contacts = models.BooleanField(default=False)
    allow_storage = models.BooleanField(default=True)
    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.UUIDField(null=True, blank=True)
    email_verification_token_expires = models.DateTimeField(null=True, blank=True)
    verification_code = models.CharField(max_length=6, null=True, blank=True)

    objects = CustomUserManager()
    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        app_label = 'user_auth'

    def __str__(self):
        return self.email or self.phone_number

    def send_password_reset_email(self):
        self.reset_password_token = uuid.uuid4()
        self.reset_password_token_expires = timezone.now() + timezone.timedelta(hours=1)
        self.save()

        subject = 'Password Reset Request'
        reset_link = f"{settings.FRONTEND_URL}/reset-password/{self.reset_password_token}/"
        html_message = render_to_string('password_reset_email.html', {
            'user': self,
            'reset_link': reset_link,
        })
        plain_message = strip_tags(html_message)
        send_mail(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            [self.email],
            html_message=html_message,
            fail_silently=False,
        )

    def clean(self):
        if not self.email and not self.phone_number:
            raise ValidationError('Either email or phone number must be provided')

        if self.email:
            if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', self.email):
                raise ValidationError('Enter a valid email address')

            if hasattr(settings, 'DISPOSABLE_EMAIL_DOMAINS'):
                domain = self.email.split('@')[-1]
                if domain in settings.DISPOSABLE_EMAIL_DOMAINS:
                    raise ValidationError('Disposable email addresses are not allowed')

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='%(app_label)s_%(class)s_groups',
        related_query_name='%(app_label)s_%(class)s',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='%(app_label)s_%(class)s_permissions',
        related_query_name='%(app_label)s_%(class)s',
        blank=True,
    )