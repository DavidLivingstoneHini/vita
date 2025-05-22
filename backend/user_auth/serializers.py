from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import User
from django.conf import settings
from django.contrib.auth import authenticate
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils import timezone
import uuid
import re


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'phone_number', 'full_name', 'password', 'password2',
                  'health_profile', 'date_of_birth', 'gender', 'is_staff',
                  'is_superuser']
        extra_kwargs = {
            'email': {'required': False},
            'phone_number': {'required': False},
        }

    def validate(self, data):
        if not data.get('email') and not data.get('phone_number'):
            raise serializers.ValidationError("Either email or phone number must be provided")

        if data.get('email'):
            try:
                validate_email(data['email'])
            except DjangoValidationError:
                raise serializers.ValidationError({"email": "Enter a valid email address"})

            if hasattr(settings, 'DISPOSABLE_EMAIL_DOMAINS'):
                domain = data['email'].split('@')[-1]
                if domain in settings.DISPOSABLE_EMAIL_DOMAINS:
                    raise serializers.ValidationError({"email": "Disposable email addresses are not allowed"})

        if data.get('is_superuser') and not self.context['request'].user.is_superuser:
            raise serializers.ValidationError("Only superusers can create new superusers")
        if data.get('is_staff') and not (
                self.context['request'].user.is_superuser or self.context['request'].user.is_staff):
            raise serializers.ValidationError("Only superusers and staff can create new staff")

        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        is_staff = validated_data.pop('is_staff', False)
        is_superuser = validated_data.pop('is_superuser', False)

        user = User.objects.create_user(**validated_data)
        user.is_staff = is_staff
        user.is_superuser = is_superuser
        user.save()

        return user

    def validate_email(self, value):
        if value:
            value = value.lower()
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError('Email already in use')
        return value

    def validate_phone_number(self, value):
        if value:
            if User.objects.filter(phone_number=value).exists():
                raise serializers.ValidationError('Phone number already in use')
        return value


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'phone_number', 'full_name', 'profile_picture', 'health_profile',
                'date_of_birth', 'gender', 'is_staff', 'is_superuser',
                'created_at', 'updated_at', 'timezone', 'country', 'region']
        read_only_fields = ['is_superuser', 'is_staff']
        extra_kwargs = {
            'date_of_birth': {'required': False},
            'gender': {'required': False},
            'phone_number': {'required': False},
            'timezone': {'required': False},
            'country': {'required': False},
            'region': {'required': False}
        }


class LoginSerializer(serializers.Serializer):
    email_or_phone = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=255, write_only=True)

    def validate(self, data):
        email_or_phone = data['email_or_phone']
        password = data['password']

        if '@' in email_or_phone:
            user = User.objects.filter(email=email_or_phone.lower()).first()
        else:
            user = User.objects.filter(phone_number=email_or_phone).first()

        if not user or not user.check_password(password):
            raise serializers.ValidationError({
                'email_or_phone': ['Invalid credentials. Please try again.']
            })

        return user


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Old password is incorrect')
        return value

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        value = value.lower()
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError('No user found with this email address')
        return value

    def save(self):
        user = User.objects.get(email=self.validated_data['email'])
        user.send_password_reset_email()
        return user


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.UUIDField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True)

    def validate(self, data):
        try:
            user = User.objects.get(reset_password_token=data['token'])
            if user.reset_password_token_expires < timezone.now():
                raise serializers.ValidationError('Token has expired')
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid token')

        if data['new_password'] != data['new_password2']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})

        return data

    def save(self):
        user = User.objects.get(reset_password_token=self.validated_data['token'])
        user.set_password(self.validated_data['new_password'])
        user.reset_password_token = None
        user.reset_password_token_expires = None
        user.save()
        return user


class UserPermissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'allow_location',
            'allow_notifications',
            'allow_camera',
            'allow_contacts',
            'allow_storage',
        ]

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance