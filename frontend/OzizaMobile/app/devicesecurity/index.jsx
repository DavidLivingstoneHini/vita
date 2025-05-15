import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Dimensions,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (size) => {
    const scaleFactor = width / 375;
    return Math.ceil(size * scaleFactor);
};

const getSafeAreaTop = () => {
    return Platform.OS === 'ios' ? 40 : 20;
};

const DeviceSecurityScreen = () => {
    const router = useRouter();
    const [settings, setSettings] = useState({
        biometricAuth: false,
        deviceLock: true,
        suspiciousActivityAlerts: true,
        autoLock: true,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDeviceSettings = async () => {
            try {
                const accessToken = await SecureStore.getItemAsync('access_token');
                const response = await fetch(`${API_BASE_URL}v1/users/device-security/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setSettings(data.settings);
                } else {
                    throw new Error('Failed to fetch device security settings');
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to load device security settings',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeviceSettings();
    }, []);

    const handleToggle = async (setting) => {
        const newSettings = { ...settings, [setting]: !settings[setting] };
        setSettings(newSettings);

        try {
            const accessToken = await SecureStore.getItemAsync('access_token');
            const response = await fetch(`${API_BASE_URL}v1/users/device-security/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [setting]: newSettings[setting] }),
            });

            if (!response.ok) {
                throw new Error('Failed to update device security settings');
            }
        } catch (error) {
            console.error('Update error:', error);
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
                text2: 'Failed to update device security settings',
            });
            setSettings(settings);
        }
    };

    const handleResetDeviceSecurity = () => {
        Alert.alert(
            'Reset All Device Security',
            'This will reset all device-specific security settings to their defaults. Are you sure?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const accessToken = await SecureStore.getItemAsync('access_token');
                            const response = await fetch(`${API_BASE_URL}v1/users/device-security/reset/`, {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${accessToken}`,
                                },
                            });

                            if (response.ok) {
                                const data = await response.json();
                                setSettings(data.default_settings);
                                Toast.show({
                                    type: 'success',
                                    text1: 'Settings Reset',
                                    text2: 'Device security settings have been reset to defaults',
                                });
                            } else {
                                throw new Error('Failed to reset device security settings');
                            }
                        } catch (error) {
                            console.error('Reset error:', error);
                            Toast.show({
                                type: 'error',
                                text1: 'Reset Failed',
                                text2: 'Failed to reset device security settings',
                            });
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView
            contentContainerStyle={[styles.container, { paddingTop: getSafeAreaTop() }]}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <Text style={[styles.title, { fontSize: responsiveFontSize(20) }]}>
                    Device Security
                </Text>
                <View style={{ width: 24 }} />
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <View style={styles.content}>
                    <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(14) }]}>
                        DEVICE PROTECTION
                    </Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingIcon}>
                            <MaterialIcons name="fingerprint" size={24} color="#007AFF" />
                        </View>
                        <View style={styles.settingTextContainer}>
                            <Text style={[styles.settingText, { fontSize: responsiveFontSize(16) }]}>
                                Biometric Authentication
                            </Text>
                            <Text style={[styles.settingDescription, { fontSize: responsiveFontSize(14) }]}>
                                Require fingerprint or face ID to access sensitive features
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#767577', true: '#04b332' }}
                            thumbColor="#f7f7f7"
                            value={settings.biometricAuth}
                            onValueChange={() => handleToggle('biometricAuth')}
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.settingItem}>
                        <View style={styles.settingIcon}>
                            <MaterialIcons name="lock-outline" size={24} color="#007AFF" />
                        </View>
                        <View style={styles.settingTextContainer}>
                            <Text style={[styles.settingText, { fontSize: responsiveFontSize(16) }]}>
                                Device Lock
                            </Text>
                            <Text style={[styles.settingDescription, { fontSize: responsiveFontSize(14) }]}>
                                Prevent access when device is locked
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#767577', true: '#04b332' }}
                            thumbColor="#f7f7f7"
                            value={settings.deviceLock}
                            onValueChange={() => handleToggle('deviceLock')}
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.settingItem}>
                        <View style={styles.settingIcon}>
                            <MaterialIcons name="security" size={24} color="#007AFF" />
                        </View>
                        <View style={styles.settingTextContainer}>
                            <Text style={[styles.settingText, { fontSize: responsiveFontSize(16) }]}>
                                Auto Lock
                            </Text>
                            <Text style={[styles.settingDescription, { fontSize: responsiveFontSize(14) }]}>
                                Automatically lock after 5 minutes of inactivity
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#767577', true: '#04b332' }}
                            thumbColor="#f7f7f7"
                            value={settings.autoLock}
                            onValueChange={() => handleToggle('autoLock')}
                        />
                    </View>

                    <Text style={[styles.sectionTitle, {
                        fontSize: responsiveFontSize(14),
                        marginTop: height * 0.03
                    }]}>
                        SECURITY ALERTS
                    </Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingIcon}>
                            <MaterialIcons name="warning" size={24} color="#007AFF" />
                        </View>
                        <View style={styles.settingTextContainer}>
                            <Text style={[styles.settingText, { fontSize: responsiveFontSize(16) }]}>
                                Suspicious Activity Alerts
                            </Text>
                            <Text style={[styles.settingDescription, { fontSize: responsiveFontSize(14) }]}>
                                Get notified about unusual device activity
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#767577', true: '#04b332' }}
                            thumbColor="#f7f7f7"
                            value={settings.suspiciousActivityAlerts}
                            onValueChange={() => handleToggle('suspiciousActivityAlerts')}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={handleResetDeviceSecurity}
                    >
                        <Text style={[styles.resetButtonText, { fontSize: responsiveFontSize(16) }]}>
                            Reset All Device Security Settings
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.securityButton}
                        onPress={() => router.push('sessions/index')}
                    >
                        <Text style={[styles.securityButtonText, { fontSize: responsiveFontSize(16) }]}>
                            View Active Sessions
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        paddingHorizontal: width * 0.06,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: height * 0.02,
        marginBottom: height * 0.02,
    },
    title: {
        fontWeight: '700',
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: -1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: height * 0.6,
    },
    content: {
        paddingHorizontal: width * 0.04,
    },
    sectionTitle: {
        color: '#828282',
        fontWeight: '500',
        marginBottom: height * 0.02,
        letterSpacing: 0.5,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: height * 0.02,
    },
    settingIcon: {
        marginRight: width * 0.03,
    },
    settingTextContainer: {
        flex: 1,
        marginRight: width * 0.03,
    },
    settingText: {
        fontWeight: '500',
        color: '#0A0A0A',
        marginBottom: height * 0.005,
    },
    settingDescription: {
        color: '#666',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
    },
    resetButton: {
        padding: height * 0.015,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: height * 0.04,
        borderWidth: 1,
        borderColor: '#FF4444',
    },
    resetButtonText: {
        color: '#FF4444',
        fontWeight: '500',
    },
    securityButton: {
        backgroundColor: '#007AFF',
        padding: height * 0.015,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: height * 0.02,
    },
    securityButtonText: {
        color: '#fff',
        fontWeight: '500',
    },
});

export default DeviceSecurityScreen;