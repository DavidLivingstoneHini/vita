import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
    ActivityIndicator,
    TextInput,
    FlatList
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { countries } from 'countries-list';

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => {
    const scaleFactor = width / 375;
    return Math.ceil(size * scaleFactor);
};

const getSafeAreaTop = () => {
    return Platform.OS === "ios" ? 40 : 20;
};

const API_BASE_URL = "http://192.168.100.34:8000/api/";

// Prepare country data
const prepareCountries = () => {
    const countryList = [];
    for (const [code, country] of Object.entries(countries)) {  // Now using the imported 'countries'
        countryList.push({
            value: code.toLowerCase(),
            label: country.name,
            phone: country.phone,
            emoji: country.emoji
        });
    }
    return countryList.sort((a, b) => a.label.localeCompare(b.label));
};

// Prepare region data
const prepareRegions = () => {
    const regionsMap = {};
    for (const [countryCode, country] of Object.entries(countries)) {
        if (country.states) {
            regionsMap[countryCode.toLowerCase()] = Object.entries(country.states).map(([code, name]) => ({
                value: code.toLowerCase(),
                label: name
            }));
        } else {
            regionsMap[countryCode.toLowerCase()] = [
                { value: 'default', label: 'Not specified' }
            ];
        }
    }
    return regionsMap;
};

const RegionalSettingsScreen = () => {
    const router = useRouter();
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCountryList, setShowCountryList] = useState(false);
    const [showRegionList, setShowRegionList] = useState(false);

    // Initialize country and region data
    const [countries] = useState(prepareCountries());
    const [regions] = useState(prepareRegions());

    // Filter countries based on search
    const filteredCountries = countries.filter(country =>
        country.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Load saved settings when component mounts
    useEffect(() => {
        const loadRegionalSettings = async () => {
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
                    if (data.country) {
                        setSelectedCountry(data.country.toLowerCase());
                    }
                    if (data.region) {
                        setSelectedRegion(data.region.toLowerCase());
                    }
                } else {
                    throw new Error('Failed to load regional settings');
                }
            } catch (error) {
                console.error('Error loading regional settings:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Load Failed',
                    text2: 'Could not load your regional settings',
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadRegionalSettings();
    }, []);

    const handleCountrySelect = (country) => {
        setSelectedCountry(country.value);
        setSelectedRegion(null);
        setShowCountryList(false);
        setSearchQuery('');
        saveSettings(country.value, null);
    };

    const handleRegionSelect = (region) => {
        setSelectedRegion(region.value);
        setShowRegionList(false);
        saveSettings(selectedCountry, region.value);
    };

    const saveSettings = async (country, region) => {
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
                    country,
                    region
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save regional settings');
            }

            Toast.show({
                type: 'success',
                text1: 'Settings Saved',
                text2: 'Your regional settings have been updated',
            });
        } catch (error) {
            console.error('Error saving regional settings:', error);
            Toast.show({
                type: 'error',
                text1: 'Save Failed',
                text2: 'Could not save your regional settings',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const renderCountryItem = ({ item }) => (
        <TouchableOpacity
            style={styles.listItem}
            onPress={() => handleCountrySelect(item)}
        >
            <Text style={styles.listItemText}>
                {item.emoji} {item.label}
            </Text>
        </TouchableOpacity>
    );

    const renderRegionItem = ({ item }) => (
        <TouchableOpacity
            style={styles.listItem}
            onPress={() => handleRegionSelect(item)}
        >
            <Text style={styles.listItemText}>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: getSafeAreaTop() }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <Text style={[styles.title, { fontSize: responsiveFontSize(20) }]}>
                    Regional Settings
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
                            Country
                        </Text>

                        <TouchableOpacity
                            style={styles.pickerContainer}
                            onPress={() => {
                                setShowCountryList(!showCountryList);
                                setShowRegionList(false);
                            }}
                            disabled={isSaving}
                        >
                            <Text style={styles.selectedValue}>
                                {selectedCountry
                                    ? countries.find(c => c.value === selectedCountry)?.label
                                    : "Select your country..."}
                            </Text>
                            <AntDesign
                                name={showCountryList ? "up" : "down"}
                                size={16}
                                color="#666"
                            />
                        </TouchableOpacity>

                        {showCountryList && (
                            <View style={styles.searchContainer}>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search countries..."
                                    placeholderTextColor="#999"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                                <FlatList
                                    data={filteredCountries}
                                    renderItem={renderCountryItem}
                                    keyExtractor={(item) => item.value}
                                    style={styles.listContainer}
                                    keyboardShouldPersistTaps="always"
                                    initialNumToRender={20}
                                    maxToRenderPerBatch={20}
                                    windowSize={10}
                                />
                            </View>
                        )}

                        {selectedCountry && (
                            <>
                                <Text style={[styles.sectionTitle, {
                                    fontSize: responsiveFontSize(16),
                                    marginTop: height * 0.03
                                }]}>
                                    Region/State
                                </Text>

                                <TouchableOpacity
                                    style={styles.pickerContainer}
                                    onPress={() => {
                                        setShowRegionList(!showRegionList);
                                        setShowCountryList(false);
                                    }}
                                    disabled={isSaving || !selectedCountry}
                                >
                                    <Text style={styles.selectedValue}>
                                        {selectedRegion
                                            ? regions[selectedCountry]?.find(r => r.value === selectedRegion)?.label
                                            : "Select your region..."}
                                    </Text>
                                    <AntDesign
                                        name={showRegionList ? "up" : "down"}
                                        size={16}
                                        color="#666"
                                    />
                                </TouchableOpacity>

                                {showRegionList && (
                                    <FlatList
                                        data={regions[selectedCountry] || []}
                                        renderItem={renderRegionItem}
                                        keyExtractor={(item) => item.value}
                                        style={styles.listContainer}
                                        keyboardShouldPersistTaps="always"
                                        initialNumToRender={20}
                                        maxToRenderPerBatch={20}
                                        windowSize={10}
                                    />
                                )}
                            </>
                        )}

                        {isSaving && (
                            <View style={styles.savingContainer}>
                                <ActivityIndicator size="small" color="#007AFF" />
                                <Text style={styles.savingText}>Saving changes...</Text>
                            </View>
                        )}

                        {selectedCountry && selectedRegion && (
                            <View style={styles.selectedContainer}>
                                <Text style={[styles.selectedText, { fontSize: responsiveFontSize(14) }]}>
                                    Country: {countries.find(c => c.value === selectedCountry)?.label}
                                </Text>
                                <Text style={[styles.selectedText, { fontSize: responsiveFontSize(14) }]}>
                                    Region: {regions[selectedCountry]?.find(r => r.value === selectedRegion)?.label}
                                </Text>
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
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: width * 0.03,
        paddingVertical: height * 0.015,
        marginBottom: height * 0.02,
    },
    selectedValue: {
        fontSize: responsiveFontSize(16),
        color: 'black',
    },
    searchContainer: {
        marginBottom: height * 0.02,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: width * 0.03,
        fontSize: responsiveFontSize(16),
        marginBottom: height * 0.01,
    },
    listContainer: {
        maxHeight: height * 0.3,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    listItem: {
        padding: width * 0.03,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    listItemText: {
        fontSize: responsiveFontSize(16),
    },
    selectedContainer: {
        marginTop: height * 0.03,
        padding: width * 0.04,
        backgroundColor: '#f8f8f8',
        borderRadius: 5,
    },
    selectedText: {
        color: "#333",
        marginBottom: height * 0.01,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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

export default RegionalSettingsScreen;