import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { MaterialIcons } from '@expo/vector-icons';

// Custom Toast configuration
export const toastConfig = {
    success: (props) => (
        <BaseToast
            {...props}
            style={{
                backgroundColor: '#FFFFFF',
                borderLeftColor: '#2ECC71',
                width: '90%',
                height: 60,
                borderRadius: 8,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#333333',
            }}
            text2Style={{
                fontSize: 14,
                color: '#666666',
            }}
            renderLeadingIcon={() => (
                <View style={styles.iconContainer}>
                    <MaterialIcons name="check-circle" size={24} color="#2ECC71" />
                </View>
            )}
        />
    ),

    error: (props) => (
        <ErrorToast
            {...props}
            style={{
                backgroundColor: '#FFFFFF',
                borderLeftColor: '#E74C3C',
                width: '90%',
                height: 60,
                borderRadius: 8,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#333333',
            }}
            text2Style={{
                fontSize: 14,
                color: '#666666',
            }}
            renderLeadingIcon={() => (
                <View style={styles.iconContainer}>
                    <MaterialIcons name="error" size={24} color="#E74C3C" />
                </View>
            )}
        />
    ),

    info: (props) => (
        <BaseToast
            {...props}
            style={{
                backgroundColor: '#FFFFFF',
                borderLeftColor: '#3498DB',
                width: '90%',
                height: 60,
                borderRadius: 8,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#333333',
            }}
            text2Style={{
                fontSize: 14,
                color: '#666666',
            }}
            renderLeadingIcon={() => (
                <View style={styles.iconContainer}>
                    <MaterialIcons name="info" size={24} color="#3498DB" />
                </View>
            )}
        />
    ),
};

const styles = StyleSheet.create({
    iconContainer: {
        paddingLeft: 15,
        justifyContent: 'center',
    },
});