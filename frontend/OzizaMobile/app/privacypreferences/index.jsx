import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Dimensions,
    Platform
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');
const API_BASE_URL = "https://www.ozizabackapp.in/api/";

const responsiveFontSize = (size) => {
    const scaleFactor = width / 375;
    return Math.ceil(size * scaleFactor);
};

const getSafeAreaTop = () => {
    return Platform.OS === 'ios' ? 40 : 20;
};

const PrivacyPreferencesScreen = () => {
    const router = useRouter();
    const [privacySettings, setPrivacySettings] = useState({
        showEmail: true,
        showPhone: false,
        searchVisibility: true,
        dataSharing: false,
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadPrivacySettings = async () => {
            try {
                const accessToken = await SecureStore.getItemAsync('access_token');
                const response = await fetch(`${API_BASE_URL}v1/users/privacy/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPrivacySettings(data);
                }
            } catch (error) {
                console.error('Error loading privacy settings:', error);
            }
        };

        loadPrivacySettings();
    }, []);

    const handleToggle = async (setting) => {
        const newSettings = { ...privacySettings, [setting]: !privacySettings[setting] };
        setPrivacySettings(newSettings);

        try {
            setIsLoading(true);
            const accessToken = await SecureStore.getItemAsync('access_token');
            const response = await fetch(`${API_BASE_URL}v1/users/privacy/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSettings),
            });

            if (!response.ok) {
                throw new Error('Failed to update privacy settings');
            }
        } catch (error) {
            console.error('Update error:', error);
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
                text2: 'Failed to update privacy settings',
            });
            setPrivacySettings(privacySettings);
        } finally {
            setIsLoading(false);
        }
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
                    Privacy Preferences
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.settingItem}>
                    <View style={styles.settingTextContainer}>
                        <Text style={[styles.settingText, { fontSize: responsiveFontSize(16) }]}>
                            Show Email to Other Users
                        </Text>
                        <Text style={[styles.settingDescription, { fontSize: responsiveFontSize(14) }]}>
                            Allow other users to see your email address
                        </Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: '#04b332' }}
                        thumbColor="#f7f7f7"
                        value={privacySettings.showEmail}
                        onValueChange={() => handleToggle('showEmail')}
                        disabled={isLoading}
                    />
                </View>

                <View style={styles.divider} />

                <View style={styles.settingItem}>
                    <View style={styles.settingTextContainer}>
                        <Text style={[styles.settingText, { fontSize: responsiveFontSize(16) }]}>
                            Show Phone Number to Other Users
                        </Text>
                        <Text style={[styles.settingDescription, { fontSize: responsiveFontSize(14) }]}>
                            Allow other users to see your phone number
                        </Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: '#04b332' }}
                        thumbColor="#f7f7f7"
                        value={privacySettings.showPhone}
                        onValueChange={() => handleToggle('showPhone')}
                        disabled={isLoading}
                    />
                </View>

                <View style={styles.divider} />

                <View style={styles.settingItem}>
                    <View style={styles.settingTextContainer}>
                        <Text style={[styles.settingText, { fontSize: responsiveFontSize(16) }]}>
                            Appear in Search Results
                        </Text>
                        <Text style={[styles.settingDescription, { fontSize: responsiveFontSize(14) }]}>
                            Allow your profile to appear in search results
                        </Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: '#04b332' }}
                        thumbColor="#f7f7f7"
                        value={privacySettings.searchVisibility}
                        onValueChange={() => handleToggle('searchVisibility')}
                        disabled={isLoading}
                    />
                </View>

                <View style={styles.divider} />

                <View style={styles.settingItem}>
                    <View style={styles.settingTextContainer}>
                        <Text style={[styles.settingText, { fontSize: responsiveFontSize(16) }]}>
                            Allow Data Sharing for Analytics
                        </Text>
                        <Text style={[styles.settingDescription, { fontSize: responsiveFontSize(14) }]}>
                            Help us improve by sharing anonymous usage data
                        </Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: '#04b332' }}
                        thumbColor="#f7f7f7"
                        value={privacySettings.dataSharing}
                        onValueChange={() => handleToggle('dataSharing')}
                        disabled={isLoading}
                    />
                </View>
            </View>
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
    content: {
        paddingHorizontal: width * 0.04,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: height * 0.02,
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
});

export default PrivacyPreferencesScreen;