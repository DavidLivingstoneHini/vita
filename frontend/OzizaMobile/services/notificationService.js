import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = "https://www.ozizabackapp.in/api/";

// Configure notifications handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

// Register for push notifications
export const registerForPushNotificationsAsync = async () => {
    if (!Device.isDevice) {
        console.warn('Must use physical device for Push Notifications');
        return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo push token:', token);

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
};

// Store the push token in your backend
export const storePushToken = async (token) => {
    try {
        const accessToken = await SecureStore.getItemAsync("access_token");
        if (!accessToken) {
            console.warn('No access token available');
            return;
        }

        const response = await fetch(`${API_BASE_URL}push-token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                push_token: token,
                platform: Platform.OS,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error response:', errorData);
            throw new Error(`Failed to store push token: ${response.status} ${response.statusText}`);
        }

        console.log('Push token stored successfully');
        return true;
    } catch (error) {
        console.error('Error storing push token:', error.message);
        return false;
    }
};

// listener for token refresh
export const setupTokenRefreshListener = () => {
    return Notifications.addPushTokenListener(async (newToken) => {
        console.log('Push token refreshed:', newToken.data);
        await storePushToken(newToken.data);
    });
};

// Initialize push notifications
export const initializePushNotifications = async () => {
    try {
        // Skip in Expo Go
        if (Constants.appOwnership === 'expo') {
            console.warn('Push notifications not fully supported in Expo Go');
            return () => { };
        }

        // Register for initial token
        const token = await registerForPushNotificationsAsync();
        if (token) {
            await storePushToken(token);
        }

        // Set up listener for token changes
        const tokenListener = setupTokenRefreshListener();

        // Return cleanup function
        return () => {
            tokenListener.remove();
        };
    } catch (error) {
        console.error('Error initializing push notifications:', error);
        return () => { }; // Return empty cleanup function if initialization fails
    }
};

// Handle notification responses (when user taps on notification)
export const setupNotificationHandlers = (router) => {
    // Handle notifications received while app is in foreground
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification received:', notification);
    });

    // Handle notification taps
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;
        if (data?.screen) {
            router.push(data.screen);
        }
    });

    return () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
    };
};

// Fetch notifications from backend
export const fetchNotifications = async () => {
    try {
        const accessToken = await SecureStore.getItemAsync("access_token");
        if (!accessToken) return [];

        const response = await fetch(`${API_BASE_URL}notifications/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch notifications');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
};