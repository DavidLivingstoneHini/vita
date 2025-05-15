import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
    ActivityIndicator
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { formatDistanceToNow } from 'date-fns';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (size) => {
    const scaleFactor = width / 375;
    return Math.ceil(size * scaleFactor);
};

const getSafeAreaTop = () => {
    return Platform.OS === 'ios' ? 40 : 20;
};

const ActiveSessionsScreen = () => {
    const router = useRouter();
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentSessionId, setCurrentSessionId] = useState(null);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const accessToken = await SecureStore.getItemAsync('access_token');
                const response = await fetch(`${API_BASE_URL}v1/users/sessions/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setSessions(data.sessions);
                    setCurrentSessionId(data.current_session_id);
                } else {
                    throw new Error('Failed to fetch sessions');
                }
            } catch (error) {
                console.error('Error fetching sessions:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to load active sessions',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchSessions();
    }, []);

    const handleTerminateSession = async (sessionId) => {
        if (sessionId === currentSessionId) {
            Toast.show({
                type: 'error',
                text1: 'Cannot Terminate',
                text2: 'You cannot terminate your current session',
            });
            return;
        }

        Alert.alert(
            'Terminate Session',
            'Are you sure you want to terminate this session?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Terminate',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const accessToken = await SecureStore.getItemAsync('access_token');
                            const response = await fetch(`${API_BASE_URL}v1/users/sessions/${sessionId}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${accessToken}`,
                                },
                            });

                            if (response.ok) {
                                setSessions(sessions.filter(session => session.id !== sessionId));
                                Toast.show({
                                    type: 'success',
                                    text1: 'Session Terminated',
                                    text2: 'The session has been successfully terminated',
                                });
                            } else {
                                throw new Error('Failed to terminate session');
                            }
                        } catch (error) {
                            console.error('Error terminating session:', error);
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: 'Failed to terminate session',
                            });
                        }
                    },
                },
            ]
        );
    };

    const getDeviceIcon = (deviceType) => {
        switch (deviceType.toLowerCase()) {
            case 'iphone':
            case 'ipad':
                return 'mobile1';
            case 'mac':
            case 'macbook':
                return 'laptop';
            case 'android':
                return 'android1';
            default:
                return 'desktop';
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
                    Active Sessions
                </Text>
                <View style={{ width: 24 }} />
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <View style={styles.content}>
                    <Text style={[styles.infoText, { fontSize: responsiveFontSize(14) }]}>
                        These are devices that are currently logged into your account.
                    </Text>

                    {sessions.map((session) => (
                        <View key={session.id} style={styles.sessionCard}>
                            <View style={styles.sessionHeader}>
                                <AntDesign
                                    name={getDeviceIcon(session.device_type)}
                                    size={responsiveFontSize(24)}
                                    color="#007AFF"
                                />
                                <View style={styles.sessionInfo}>
                                    <Text style={[styles.deviceName, { fontSize: responsiveFontSize(16) }]}>
                                        {session.device_name || 'Unknown Device'}
                                    </Text>
                                    <Text style={[styles.sessionDetail, { fontSize: responsiveFontSize(14) }]}>
                                        {session.device_type} • {session.ip_address}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.sessionMeta}>
                                <Text style={[styles.sessionTime, { fontSize: responsiveFontSize(14) }]}>
                                    {formatDistanceToNow(new Date(session.last_activity))} ago
                                </Text>
                                {session.id === currentSessionId ? (
                                    <Text style={[styles.currentSession, { fontSize: responsiveFontSize(14) }]}>
                                        Current Session
                                    </Text>
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => handleTerminateSession(session.id)}
                                        style={styles.terminateButton}
                                    >
                                        <Text style={[styles.terminateText, { fontSize: responsiveFontSize(14) }]}>
                                            Terminate
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))}

                    <TouchableOpacity
                        style={styles.securityButton}
                        onPress={() => router.push('/settings/device-security')}
                    >
                        <Text style={[styles.securityButtonText, { fontSize: responsiveFontSize(16) }]}>
                            Manage Device Security
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
    content: {
        paddingHorizontal: width * 0.04,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: height * 0.6,
    },
    infoText: {
        color: '#666',
        marginBottom: height * 0.03,
        textAlign: 'center',
    },
    sessionCard: {
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        padding: width * 0.04,
        marginBottom: height * 0.02,
    },
    sessionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: height * 0.015,
    },
    sessionInfo: {
        marginLeft: width * 0.03,
        flex: 1,
    },
    deviceName: {
        fontWeight: '600',
        color: '#333',
    },
    sessionDetail: {
        color: '#666',
        marginTop: height * 0.005,
    },
    sessionMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: height * 0.015,
    },
    sessionTime: {
        color: '#666',
    },
    currentSession: {
        color: '#04b332',
        fontWeight: '500',
    },
    terminateButton: {
        backgroundColor: '#FF4444',
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.008,
        borderRadius: 4,
    },
    terminateText: {
        color: '#fff',
        fontWeight: '500',
    },
    securityButton: {
        backgroundColor: '#007AFF',
        padding: height * 0.015,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: height * 0.03,
    },
    securityButtonText: {
        color: '#fff',
        fontWeight: '500',
    },
});

export default ActiveSessionsScreen;