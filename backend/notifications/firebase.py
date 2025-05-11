import firebase_admin
from firebase_admin import credentials
from django.conf import settings
import os


def initialize_firebase():
    if not firebase_admin._apps:
        cred_path = getattr(settings, 'FIREBASE_CREDENTIALS_PATH', None)
        if not cred_path or not os.path.exists(cred_path):
            raise ValueError("Firebase credentials not configured properly")

        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        print("Firebase initialized successfully")
    return firebase_admin.get_app()