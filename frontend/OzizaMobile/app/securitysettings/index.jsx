import React, { useState } from 'react';
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
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (size) => {
    const scaleFactor = width / 375;
    return Math.ceil(size * scaleFactor);
};

const getSafeAreaTop = () => {
    return Platform.OS === 'ios' ? 40 : 20;
};

const SecuritySettingsScreen = () => {
    const API_BASE_URL = "http://192.168.100.34:8000/api/";
    const router = useRouter();
    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: false,
        loginAlerts: true,
        passwordUpdateRequired: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const handleToggle = async (setting) => {
        const newSettings = { ...securitySettings, [setting]: !securitySettings[setting] };
        setSecuritySettings(newSettings);

        try {
            setIsLoading(true);
            const accessToken = await SecureStore.getItemAsync('access_token');
            const response = await fetch(`${API_BASE_URL}v1/users/security/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [setting]: newSettings[setting] }),
            });

            if (!response.ok) {
                throw new Error('Failed to update security settings');
            }
        } catch (error) {
            console.error('Update error:', error);
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
                text2: 'Failed to update security settings',
            });
            setSecuritySettings(securitySettings);
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
                    Security Settings
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(14) }]}>
                    ACCOUNT SECURITY
                </Text>

                <View style={styles.settingItem}>
                    <View style={styles.settingTextContainer}>
                        <Text style={[styles.settingText, { fontSize: responsiveFontSize(16) }]}>
                            Two-Factor Authentication
                        </Text>
                        <Text style={[styles.settingDescription, { fontSize: responsiveFontSize(14) }]}>
                            Add an extra layer of security to your account
                        </Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: '#04b332' }}
                        thumbColor="#f7f7f7"
                        value={securitySettings.twoFactorAuth}
                        onValueChange={() => handleToggle('twoFactorAuth')}
                        disabled={isLoading}
                    />
                </View>

                <View style={styles.divider} />

                <View style={styles.settingItem}>
                    <View style={styles.settingTextContainer}>
                        <Text style={[styles.settingText, { fontSize: responsiveFontSize(16) }]}>
                            Login Alerts
                        </Text>
                        <Text style={[styles.settingDescription, { fontSize: responsiveFontSize(14) }]}>
                            Get notified when someone logs into your account
                        </Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: '#04b332' }}
                        thumbColor="#f7f7f7"
                        value={securitySettings.loginAlerts}
                        onValueChange={() => handleToggle('loginAlerts')}
                        disabled={isLoading}
                    />
                </View>

                <View style={styles.divider} />

                <View style={styles.settingItem}>
                    <View style={styles.settingTextContainer}>
                        <Text style={[styles.settingText, { fontSize: responsiveFontSize(16) }]}>
                            Require Password Update
                        </Text>
                        <Text style={[styles.settingDescription, { fontSize: responsiveFontSize(14) }]}>
                            Ask me to update my password every 90 days
                        </Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: '#04b332' }}
                        thumbColor="#f7f7f7"
                        value={securitySettings.passwordUpdateRequired}
                        onValueChange={() => handleToggle('passwordUpdateRequired')}
                        disabled={isLoading}
                    />
                </View>

                <Text style={[styles.sectionTitle, {
                    fontSize: responsiveFontSize(14),
                    marginTop: height * 0.03
                }]}>
                    ACCOUNT ACTIONS
                </Text>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#000' }]}
                    onPress={() => navigation.navigate("changepassword/index")}
                    disabled={isLoading}
                >
                    <Text style={[styles.actionButtonText, { color: '#fff' }]}>
                        Change Password
                    </Text>
                </TouchableOpacity>
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
    actionButton: {
        padding: height * 0.015,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: height * 0.015,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    actionButtonText: {
        fontSize: responsiveFontSize(16),
        fontWeight: '500',
    },
});

export default SecuritySettingsScreen;