import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    TextInput,
    Keyboard,
    ActivityIndicator,
    Platform,
    Alert,
    Animated,
    Easing,
    Image
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign, Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = "https://www.ozizabackapp.in/api/";

export default function VerifyEmailScreen() {
    const router = useRouter();
    const { token } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(30);
    const inputs = Array(6).fill(0).map((_, i) => useRef(null));
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Countdown timer for resend
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const startShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true
            }),
            Animated.timing(shakeAnim, {
                toValue: -10,
                duration: 50,
                useNativeDriver: true
            }),
            Animated.timing(shakeAnim, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true
            }),
            Animated.timing(shakeAnim, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true
            })
        ]).start();
    };

    const startPulse = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 500,
                    easing: Easing.ease,
                    useNativeDriver: true
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.ease,
                    useNativeDriver: true
                })
            ])
        ).start();
    };

    useEffect(() => {
        startPulse();
    }, []);

    const handleVerification = async () => {
        const code = verificationCode.join('');
        if (code.length !== 6) {
            startShake();
            Toast.show({
                type: 'error',
                text1: 'Incomplete Code',
                text2: 'Please enter the full 6-digit verification code',
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}v1/users/verify-email/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    code: code,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Verification failed. Please try again.');
            }

            // Store tokens and user data
            if (data.access) {
                await SecureStore.setItemAsync('access_token', data.access);
            }
            if (data.refresh) {
                await SecureStore.setItemAsync('refresh_token', data.refresh);
            }
            if (data.user) {
                await SecureStore.setItemAsync('full_name', data.user.full_name || '');
                await SecureStore.setItemAsync('email', data.user.email || '');
                await SecureStore.setItemAsync('phone_number', data.user.phone_number || '');
            }

            Toast.show({
                type: 'success',
                text1: 'Email Verified!',
                text2: 'Your account has been successfully verified',
            });

            router.replace('/(tabs)/home');
        } catch (error) {
            startShake();
            Toast.show({
                type: 'error',
                text1: 'Verification Error',
                text2: error.message || 'Something went wrong. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChangeText = (text, index) => {
        // Only allow numbers
        const numericText = text.replace(/[^0-9]/g, '');
        if (!numericText && text !== '') return;

        const newCode = [...verificationCode];
        newCode[index] = numericText;
        setVerificationCode(newCode);

        // Auto focus next input
        if (numericText && index < 5) {
            inputs[index + 1].current.focus();
        }

        // Auto submit if last digit is entered
        if (numericText && index === 5) {
            Keyboard.dismiss();
            handleVerification();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !verificationCode[index] && index > 0) {
            inputs[index - 1].current.focus();
        }
    };

    const handleResendCode = async () => {
        if (countdown > 0) return;

        setResendLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}v1/users/send-verification-email/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            if (!response.ok) {
                throw new Error('Failed to resend verification code');
            }

            setCountdown(30);
            Toast.show({
                type: 'success',
                text1: 'Code Resent!',
                text2: 'A new verification code has been sent to your email',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'Failed to resend code. Please try again.',
            });
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <AntDesign name="arrowleft" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Verify Your Email</Text>
                <View style={{ width: 24 }} /> {/* Spacer for alignment */}
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
                    <Image
                        source={require('../../assets/images/email-verification.png')} // Add your own image
                        style={styles.verificationIcon}
                        resizeMode="contain"
                    />
                </Animated.View>

                <Text style={styles.title}>Enter Verification Code</Text>
                <Text style={styles.subtitle}>
                    We've sent a 6-digit code to your email address
                </Text>

                <Animated.View style={[styles.codeContainer, { transform: [{ translateX: shakeAnim }] }]}>
                    {verificationCode.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={inputs[index]}
                            style={[
                                styles.codeInput,
                                digit ? styles.codeInputFilled : null,
                                index === 0 && styles.firstInput,
                                index === 5 && styles.lastInput
                            ]}
                            value={digit}
                            onChangeText={(text) => handleChangeText(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            textContentType="oneTimeCode"
                            autoFocus={index === 0}
                            selectTextOnFocus
                            editable={!loading}
                        />
                    ))}
                </Animated.View>

                <TouchableOpacity
                    style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
                    onPress={handleVerification}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.verifyButtonText}>Verify Email</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>
                        Didn't receive a code?{' '}
                        {countdown > 0 ? (
                            <Text style={styles.countdownText}>Resend in {countdown}s</Text>
                        ) : (
                            <TouchableOpacity
                                onPress={handleResendCode}
                                disabled={resendLoading || countdown > 0}
                            >
                                <Text style={styles.resendLink}>
                                    {resendLoading ? 'Sending...' : 'Resend Now'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.helpLink}
                    onPress={() => Alert.alert('Contact Support', 'Please email support@oziza.com for assistance')}
                >
                    <Feather name="help-circle" size={16} color="#666" />
                    <Text style={styles.helpText}>Need help?</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 5,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 20,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 30,
    },
    verificationIcon: {
        width: 120,
        height: 120,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        width: '100%',
    },
    codeInput: {
        width: 50,
        height: 60,
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '600',
        color: '#000',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    codeInputFilled: {
        borderColor: '#000',
        backgroundColor: '#f8f8f8',
    },
    firstInput: {
        marginLeft: 0,
    },
    lastInput: {
        marginRight: 0,
    },
    verifyButton: {
        backgroundColor: '#000',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    verifyButtonDisabled: {
        opacity: 0.7,
    },
    verifyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    resendContainer: {
        marginBottom: 30,
    },
    resendText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    resendLink: {
        color: '#000',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    countdownText: {
        color: '#999',
    },
    helpLink: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    helpText: {
        marginLeft: 5,
        color: '#666',
        fontSize: 14,
    },
});