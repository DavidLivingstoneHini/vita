import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
    TextInput,
    FlatList,
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

const timeZones = [
    { label: 'Eastern Time (ET)', value: 'et', offset: '-05:00' },
    { label: 'Central Time (CT)', value: 'ct', offset: '-06:00' },
    { label: 'Mountain Time (MT)', value: 'mt', offset: '-07:00' },
    { label: 'Pacific Time (PT)', value: 'pt', offset: '-08:00' },
    { label: 'Alaska Time (AKT)', value: 'akt', offset: '-09:00' },
    { label: 'Hawaii-Aleutian Time (HAT)', value: 'hat', offset: '-10:00' },
    { label: 'Atlantic Time (AT)', value: 'at', offset: '-04:00' },
    { label: 'Newfoundland Time (NT)', value: 'nt', offset: '-03:30' },
    { label: 'Greenwich Mean Time (GMT)', value: 'gmt', offset: '+00:00' },
    { label: 'Central European Time (CET)', value: 'cet', offset: '+01:00' },
    { label: 'Eastern European Time (EET)', value: 'eet', offset: '+02:00' },
    { label: 'Moscow Time (MSK)', value: 'msk', offset: '+03:00' },
    { label: 'India Standard Time (IST)', value: 'ist', offset: '+05:30' },
    { label: 'China Standard Time (CST)', value: 'cst', offset: '+08:00' },
    { label: 'Japan Standard Time (JST)', value: 'jst', offset: '+09:00' },
    { label: 'Australian Eastern Time (AET)', value: 'aet', offset: '+10:00' },
];

const TimeZoneScreen = () => {
    const router = useRouter();
    const [selectedTimeZone, setSelectedTimeZone] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTimeZones, setFilteredTimeZones] = useState(timeZones);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Load saved timezone on mount
        const loadSavedTimezone = async () => {
            try {
                const savedTimezone = await SecureStore.getItemAsync('user_timezone');
                if (savedTimezone) {
                    const tz = JSON.parse(savedTimezone);
                    setSelectedTimeZone(tz.value);
                }
            } catch (error) {
                console.error('Error loading timezone:', error);
            }
        };
        loadSavedTimezone();
    }, []);

    useEffect(() => {
        // Filter timezones based on search query
        if (searchQuery.trim() === '') {
            setFilteredTimeZones(timeZones);
        } else {
            setFilteredTimeZones(
                timeZones.filter(zone =>
                    zone.label.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
    }, [searchQuery]);

    const handleSelectTimezone = async (timezone) => {
        setIsLoading(true);
        try {
            const accessToken = await SecureStore.getItemAsync('access_token');
            const response = await fetch(`${API_BASE_URL}v1/users/timezone/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ timezone: timezone.value }),
            });

            if (response.ok) {
                setSelectedTimeZone(timezone.value);
                await SecureStore.setItemAsync('user_timezone', JSON.stringify(timezone));
                Toast.show({
                    type: 'success',
                    text1: 'Timezone Updated',
                    text2: `Your timezone has been set to ${timezone.label}`,
                });
            } else {
                throw new Error('Failed to update timezone');
            }
        } catch (error) {
            console.error('Timezone update error:', error);
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
                text2: 'Failed to update timezone settings',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.timezoneItem,
                selectedTimeZone === item.value && styles.selectedTimezone
            ]}
            onPress={() => handleSelectTimezone(item)}
            disabled={isLoading}
        >
            <Text style={[styles.timezoneText, { fontSize: responsiveFontSize(16) }]}>
                {item.label}
            </Text>
            <Text style={[styles.offsetText, { fontSize: responsiveFontSize(14) }]}>
                UTC{item.offset}
            </Text>
            {selectedTimeZone === item.value && (
                <AntDesign name="check" size={20} color="#04b332" style={styles.checkIcon} />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: getSafeAreaTop() }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <Text style={[styles.title, { fontSize: responsiveFontSize(20) }]}>
                    Time Zone
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(16) }]}>
                    Select your time zone
                </Text>

                <View style={styles.searchContainer}>
                    <AntDesign
                        name="search1"
                        size={responsiveFontSize(18)}
                        color="#666"
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={[styles.searchInput, { fontSize: responsiveFontSize(16) }]}
                        placeholder="Search time zones..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        clearButtonMode="while-editing"
                    />
                </View>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#007AFF" />
                    </View>
                ) : (
                    <FlatList
                        data={filteredTimeZones}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.value}
                        style={styles.timezoneList}
                        keyboardShouldPersistTaps="always"
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        ListEmptyComponent={
                            <Text style={[styles.noResults, { fontSize: responsiveFontSize(16) }]}>
                                No matching time zones found
                            </Text>
                        }
                        ListHeaderComponent={
                            <View style={{ paddingBottom: 10 }} />
                        }
                        ListFooterComponent={
                            selectedTimeZone && !isLoading ? (
                                <View style={styles.currentTimezone}>
                                    <Text style={[styles.currentLabel, { fontSize: responsiveFontSize(14) }]}>
                                        Current:
                                    </Text>
                                    <Text style={[styles.currentValue, { fontSize: responsiveFontSize(16) }]}>
                                        {timeZones.find(z => z.value === selectedTimeZone)?.label}
                                    </Text>
                                </View>
                            ) : null
                        }
                    />
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
    timezoneList: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
        marginBottom: height * 0.02,
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
        paddingHorizontal: width * 0.04,
        paddingBottom: height * 0.04,
    },
    sectionTitle: {
        fontWeight: "600",
        marginBottom: height * 0.02,
        color: "#333",
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        paddingHorizontal: width * 0.03,
        marginBottom: height * 0.03,
    },
    searchIcon: {
        marginRight: width * 0.02,
    },
    searchInput: {
        flex: 1,
        paddingVertical: height * 0.015,
        color: '#333',
    },
    timezoneList: {
        maxHeight: height * 0.6,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    timezoneItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: height * 0.018,
        paddingHorizontal: width * 0.04,
        backgroundColor: '#fff',
    },
    selectedTimezone: {
        backgroundColor: '#f0f9ff',
    },
    timezoneText: {
        flex: 1,
        color: '#333',
    },
    offsetText: {
        color: '#666',
        marginRight: width * 0.04,
    },
    checkIcon: {
        marginLeft: width * 0.02,
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginHorizontal: width * 0.04,
    },
    noResults: {
        textAlign: 'center',
        padding: width * 0.04,
        color: '#666',
    },
    loadingContainer: {
        padding: width * 0.04,
        alignItems: 'center',
    },
    currentTimezone: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: height * 0.03,
        padding: width * 0.03,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
    },
    currentLabel: {
        fontWeight: '500',
        color: '#666',
        marginRight: width * 0.02,
    },
    currentValue: {
        fontWeight: '600',
        color: '#04b332',
    },
});

export default TimeZoneScreen;