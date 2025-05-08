import requests
import json
from django.conf import settings


def send_push_notification(token, title, message, data=None):
    """
    Sends a push notification via Expo's API.
    Args:
        token (str): Expo push token
        title (str): Notification title
        message (str): Notification body
        data (dict, optional): Additional data payload
    Returns:
        dict: Expo API response
    """
    expo_api_url = "https://exp.host/--/api/v2/push/send"

    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }

    payload = {
        'to': token,
        'title': title,
        'body': message,
        'sound': 'default',
        'data': data or {},
    }

    try:
        response = requests.post(expo_api_url, headers=headers, data=json.dumps(payload))
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print('Failed to send notification:', e)
        return {'error': str(e)}