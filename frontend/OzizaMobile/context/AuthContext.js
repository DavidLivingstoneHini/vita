import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        authenticated: false,
        onboardingCompleted: false,
        isLoading: true
    });

    const loadAuthState = async () => {
        try {
            const [token, onboarding] = await Promise.all([
                SecureStore.getItemAsync('access_token'),
                SecureStore.getItemAsync('onboarding_completed')
            ]);

            setAuthState({
                authenticated: !!token,
                onboardingCompleted: onboarding === 'true',
                isLoading: false
            });
        } catch (error) {
            console.error('Failed to load auth state:', error);
            setAuthState({
                authenticated: false,
                onboardingCompleted: false,
                isLoading: false
            });
        }
    };

    useEffect(() => {
        loadAuthState();
    }, []);

    const completeOnboarding = async () => {
        try {
            await SecureStore.setItemAsync('onboarding_completed', 'true');
            setAuthState(prev => ({ ...prev, onboardingCompleted: true }));
        } catch (error) {
            console.error('Failed to complete onboarding:', error);
        }
    };

    const login = async (token, refreshToken) => {
        try {
            await Promise.all([
                SecureStore.setItemAsync('access_token', token),
                SecureStore.setItemAsync('refresh_token', refreshToken)
            ]);
            setAuthState(prev => ({ ...prev, authenticated: true }));
        } catch (error) {
            console.error('Failed to login:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await Promise.all([
                SecureStore.deleteItemAsync('access_token'),
                SecureStore.deleteItemAsync('refresh_token')
            ]);
            setAuthState(prev => ({ ...prev, authenticated: false }));
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{
            ...authState,
            loadAuthState,
            completeOnboarding,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);