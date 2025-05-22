import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
    Modal,
    ActivityIndicator
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => {
    const scaleFactor = width / 375;
    return Math.ceil(size * scaleFactor);
};

const getSafeAreaTop = () => {
    return Platform.OS === "ios" ? 40 : 20;
};

const API_BASE_URL = "https://www.ozizabackapp.in/api/";

const languages = [
    { id: '1', name: 'English', code: 'en' },
    { id: '2', name: 'Spanish', code: 'es' },
    { id: '3', name: 'French', code: 'fr' },
    { id: '4', name: 'German', code: 'de' },
    { id: '5', name: 'Chinese', code: 'zh' },
    { id: '6', name: 'Hindi', code: 'hi' },
    { id: '7', name: 'Arabic', code: 'ar' },
    { id: '8', name: 'Portuguese', code: 'pt' },
    { id: '9', name: 'Russian', code: 'ru' },
    { id: '10', name: 'Japanese', code: 'ja' },
    { id: '11', name: 'Italian', code: 'it' },
    { id: '12', name: 'Korean', code: 'ko' },
    { id: '13', name: 'Dutch', code: 'nl' },
    { id: '14', name: 'Turkish', code: 'tr' },
    { id: '15', name: 'Swedish', code: 'sv' },
    { id: '16', name: 'Polish', code: 'pl' },
];

const LanguagePreferencesScreen = () => {
    const router = useRouter();
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedLanguageName, setSelectedLanguageName] = useState('Select a language');

    // Load saved language preference when component mounts
    useEffect(() => {
        const loadLanguagePreference = async () => {
            setIsLoading(true);
            try {
                const accessToken = await SecureStore.getItemAsync('access_token');
                const response = await fetch(`${API_BASE_URL}v1/users/profile/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.language) {
                        const lang = languages.find(l => l.code === data.language);
                        setSelectedLanguage(data.language);
                        setSelectedLanguageName(lang?.name || 'Select a language');
                    }
                } else {
                    throw new Error('Failed to load language preference');
                }
            } catch (error) {
                console.error('Error loading language preference:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Load Failed',
                    text2: 'Could not load your language preference',
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadLanguagePreference();
    }, []);

    const handleLanguageSelect = async (language) => {
        setShowDropdown(false);
        setIsSaving(true);
        try {
            const accessToken = await SecureStore.getItemAsync('access_token');
            const response = await fetch(`${API_BASE_URL}v1/users/profile/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    language: language.code
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save language preference');
            }

            setSelectedLanguage(language.code);
            setSelectedLanguageName(language.name);
            Toast.show({
                type: 'success',
                text1: 'Settings Saved',
                text2: 'Your language preference has been updated',
            });
        } catch (error) {
            console.error('Error saving language preference:', error);
            Toast.show({
                type: 'error',
                text1: 'Save Failed',
                text2: 'Could not save your language preference',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: getSafeAreaTop() }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <Text style={[styles.title, { fontSize: responsiveFontSize(20) }]}>
                    Language Preferences
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#007AFF" />
                    </View>
                ) : (
                    <>
                        <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16) }]}>
                            Select your preferred language
                        </Text>

                        <TouchableOpacity
                            style={styles.selectField}
                            onPress={() => setShowDropdown(!showDropdown)}
                            disabled={isSaving}
                        >
                            <Text style={[styles.selectText, { fontSize: responsiveFontSize(16) }]}>
                                {selectedLanguageName}
                            </Text>
                            <AntDesign
                                name={showDropdown ? "up" : "down"}
                                size={16}
                                color="#666"
                            />
                        </TouchableOpacity>

                        <Modal
                            visible={showDropdown}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={() => setShowDropdown(false)}
                        >
                            <TouchableOpacity
                                style={styles.modalOverlay}
                                activeOpacity={1}
                                onPress={() => setShowDropdown(false)}
                            >
                                <View style={styles.dropdownContainer}>
                                    <ScrollView style={styles.dropdownScroll}>
                                        {languages.map((language) => (
                                            <TouchableOpacity
                                                key={language.id}
                                                style={[
                                                    styles.dropdownItem,
                                                    selectedLanguage === language.code && styles.selectedItem
                                                ]}
                                                onPress={() => handleLanguageSelect(language)}
                                            >
                                                <Text style={[styles.dropdownText, { fontSize: responsiveFontSize(16) }]}>
                                                    {language.name}
                                                </Text>
                                                {selectedLanguage === language.code && (
                                                    <AntDesign name="check" size={20} color="#04b332" />
                                                )}
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </TouchableOpacity>
                        </Modal>

                        <Text style={[styles.note, { fontSize: responsiveFontSize(14) }]}>
                            Changing language preference will affect all text in the application.
                        </Text>

                        {isSaving && (
                            <View style={styles.savingContainer}>
                                <ActivityIndicator size="small" color="#007AFF" />
                                <Text style={styles.savingText}>Saving changes...</Text>
                            </View>
                        )}
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: width * 0.06,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: height * 0.02,
        marginBottom: height * 0.02,
    },
    title: {
        fontWeight: "700",
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",
        zIndex: -1,
    },
    content: {
        flex: 1,
        paddingHorizontal: width * 0.04,
    },
    sectionTitle: {
        fontWeight: "600",
        marginBottom: height * 0.02,
        color: "#333",
    },
    selectField: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: width * 0.03,
        paddingVertical: height * 0.015,
        marginBottom: height * 0.03,
    },
    selectText: {
        color: 'black',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        paddingHorizontal: width * 0.1,
    },
    dropdownContainer: {
        maxHeight: height * 0.6,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: width * 0.03,
    },
    dropdownScroll: {
        flexGrow: 0,
    },
    dropdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: height * 0.018,
        paddingHorizontal: width * 0.03,
    },
    selectedItem: {
        backgroundColor: '#f0f9ff',
    },
    dropdownText: {
        color: "#333",
    },
    note: {
        color: "#666",
        fontStyle: "italic",
        marginTop: height * 0.02,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    savingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    savingText: {
        marginLeft: 10,
        color: '#666',
        fontSize: responsiveFontSize(14),
    },
});

export default LanguagePreferencesScreen;