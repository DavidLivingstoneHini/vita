import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
    Alert
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
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

const AccountDeactivationScreen = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleDeactivate = async () => {
        Alert.alert(
            'Confirm Account Deactivation',
            'Are you sure you want to deactivate your account? This will:\n\n• Remove your profile from search results\n• Delete all your personal data\n• Cancel any active subscriptions\n\nThis action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Deactivate Account',
                    style: 'destructive',
                    onPress: async () => {
                        setIsLoading(true);
                        try {
                            const accessToken = await SecureStore.getItemAsync('access_token');
                            const response = await fetch(`${API_BASE_URL}v1/users/profile/deactivate/`, {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${accessToken}`,
                                },
                            });

                            if (response.ok) {
                                await Promise.all([
                                    SecureStore.deleteItemAsync('access_token'),
                                    SecureStore.deleteItemAsync('refresh_token'),
                                ]);
                                router.push('/login');
                                Toast.show({
                                    type: 'success',
                                    text1: 'Account Deactivated',
                                    text2: 'Your account has been deactivated successfully',
                                });
                            } else {
                                throw new Error('Failed to deactivate account');
                            }
                        } catch (error) {
                            console.error('Deactivation error:', error);
                            Toast.show({
                                type: 'error',
                                text1: 'Deactivation Failed',
                                text2: error.message || 'There was an issue deactivating your account',
                            });
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
            ],
            { cancelable: true }
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
                    Account Deactivation
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.warningContainer}>
                    <Text style={[styles.warningTitle, { fontSize: responsiveFontSize(18) }]}>
                        ⚠️ Important Notice
                    </Text>
                    <Text style={[styles.warningText, { fontSize: responsiveFontSize(16) }]}>
                        Deactivating your account will permanently remove your profile and all associated data from our systems.
                    </Text>
                </View>

                <View style={styles.detailsContainer}>
                    <Text style={[styles.detailTitle, { fontSize: responsiveFontSize(16) }]}>
                        What happens when you deactivate:
                    </Text>
                    <View style={styles.detailItem}>
                        <Text style={[styles.detailBullet, { fontSize: responsiveFontSize(16) }]}>•</Text>
                        <Text style={[styles.detailText, { fontSize: responsiveFontSize(14) }]}>
                            Your profile will no longer be visible to other users
                        </Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={[styles.detailBullet, { fontSize: responsiveFontSize(16) }]}>•</Text>
                        <Text style={[styles.detailText, { fontSize: responsiveFontSize(14) }]}>
                            All your personal data will be deleted
                        </Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={[styles.detailBullet, { fontSize: responsiveFontSize(16) }]}>•</Text>
                        <Text style={[styles.detailText, { fontSize: responsiveFontSize(14) }]}>
                            Any active subscriptions will be canceled
                        </Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={[styles.detailBullet, { fontSize: responsiveFontSize(16) }]}>•</Text>
                        <Text style={[styles.detailText, { fontSize: responsiveFontSize(14) }]}>
                            This action cannot be undone
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.deactivateButton, isLoading && styles.disabledButton]}
                    onPress={handleDeactivate}
                    disabled={isLoading}
                >
                    <Text style={[styles.deactivateButtonText, { fontSize: responsiveFontSize(16) }]}>
                        {isLoading ? 'Processing...' : 'Deactivate Account'}
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
        paddingBottom: height * 0.05,
    },
    warningContainer: {
        backgroundColor: '#FFF6F6',
        borderLeftWidth: 4,
        borderLeftColor: '#FF4444',
        padding: width * 0.04,
        marginBottom: height * 0.04,
        borderRadius: 4,
    },
    warningTitle: {
        fontWeight: 'bold',
        color: '#FF4444',
        marginBottom: height * 0.01,
    },
    warningText: {
        color: '#FF4444',
        lineHeight: responsiveFontSize(22),
    },
    detailsContainer: {
        marginBottom: height * 0.04,
    },
    detailTitle: {
        fontWeight: '600',
        color: '#333',
        marginBottom: height * 0.02,
    },
    detailItem: {
        flexDirection: 'row',
        marginBottom: height * 0.01,
        alignItems: 'flex-start',
    },
    detailBullet: {
        marginRight: width * 0.02,
        color: '#333',
    },
    detailText: {
        flex: 1,
        color: '#666',
        lineHeight: responsiveFontSize(20),
    },
    deactivateButton: {
        backgroundColor: '#FF4444',
        padding: height * 0.02,
        borderRadius: 5,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#FF9999',
    },
    deactivateButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default AccountDeactivationScreen;