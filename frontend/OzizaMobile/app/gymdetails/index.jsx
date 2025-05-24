import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    Platform,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Linking,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

// API Configuration
const API_URL = "https://www.ozizabackapp.in/api/v1";

// Responsive Font Size Function
const responsiveFontSize = (size) => {
    const scaleFactor = width / 375; // Base width of 375 (iPhone SE)
    const newSize = size * scaleFactor;
    return Math.ceil(newSize); // Round to nearest whole number
};

const GymDetailsScreen = () => {
    const { gymId } = useLocalSearchParams();
    const [gym, setGym] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchGymDetails = async () => {
            try {
                setIsLoading(true);
                const accessToken = await SecureStore.getItemAsync("access_token");
                const response = await axios.get(`${API_URL}/gyms/${gymId}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setGym(response.data);
            } catch (err) {
                console.error("Error fetching gym details:", err);
                setError("Failed to load gym details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchGymDetails();
    }, [gymId]);

    const handleCall = () => {
        if (gym?.phone) {
            Linking.openURL(`tel:${gym.phone}`);
        }
    };

    const handleWebsite = () => {
        if (gym?.website) {
            Linking.openURL(gym.website);
        }
    };

    const handleDirections = () => {
        if (gym?.latitude && gym?.longitude) {
            const url = Platform.select({
                ios: `maps://app?daddr=${gym.latitude},${gym.longitude}`,
                android: `google.navigation:q=${gym.latitude},${gym.longitude}`
            });
            Linking.openURL(url).catch(() => {
                Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${gym.latitude},${gym.longitude}`);
            });
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.errorContainer]}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.retryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!gym) {
        return (
            <View style={[styles.container, styles.errorContainer]}>
                <Text style={styles.errorText}>Gym not found</Text>
            </View>
        );
    }

    const region = {
        latitude: gym.latitude,
        longitude: gym.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Gym Details</Text>
                <View style={{ width: 24 }} /> {/* For alignment */}
            </View>

            {/* Gym Image */}
            <Image
                source={require("../../assets/images/gym-placeholder.jpg")} // Replace with actual gym image if available
                style={styles.gymImage}
                resizeMode="cover"
            />

            {/* Gym Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.gymName}>{gym.name}</Text>

                {/* Rating */}
                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={20} color="#FFD700" />
                    <Text style={styles.ratingText}>{gym.rating.toFixed(1)}</Text>
                    <Text style={styles.reviewCount}>({gym.review_count || 0} reviews)</Text>
                </View>

                {/* Address */}
                <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={20} color="#666" />
                    <Text style={styles.infoText}>{gym.address}</Text>
                </View>

                {/* Distance */}
                {gym.distance && (
                    <View style={styles.infoRow}>
                        <Ionicons name="navigate-outline" size={20} color="#666" />
                        <Text style={styles.infoText}>{gym.distance.toFixed(1)} km away</Text>
                    </View>
                )}

                {/* Opening Hours */}
                <Text style={styles.sectionTitle}>Opening Hours</Text>
                {gym.opening_hours?.map((hour, index) => (
                    <View key={index} style={styles.hoursRow}>
                        <Text style={styles.dayText}>{hour.day}</Text>
                        <Text style={styles.hoursText}>
                            {hour.open} - {hour.close}
                        </Text>
                    </View>
                ))}

                {/* Facilities */}
                <Text style={styles.sectionTitle}>Facilities</Text>
                <View style={styles.facilitiesContainer}>
                    {gym.facilities?.map((facility, index) => (
                        <View key={index} style={styles.facilityTag}>
                            <Text style={styles.facilityText}>{facility}</Text>
                        </View>
                    ))}
                </View>

                {/* Map */}
                <Text style={styles.sectionTitle}>Location</Text>
                <View style={styles.mapContainer}>
                    <MapView style={styles.map} initialRegion={region}>
                        <Marker
                            coordinate={{
                                latitude: gym.latitude,
                                longitude: gym.longitude,
                            }}
                            title={gym.name}
                        >
                            <View style={styles.markerContainer}>
                                <View style={styles.markerBubble}>
                                    <Text style={styles.markerText}>{gym.name}</Text>
                                </View>
                                <View style={styles.markerArrow} />
                            </View>
                        </Marker>
                    </MapView>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.callButton]}
                        onPress={handleCall}
                        disabled={!gym.phone}
                    >
                        <Ionicons name="call-outline" size={20} color="white" />
                        <Text style={styles.actionButtonText}>Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.directionsButton]}
                        onPress={handleDirections}
                    >
                        <Ionicons name="navigate-outline" size={20} color="white" />
                        <Text style={styles.actionButtonText}>Directions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.websiteButton]}
                        onPress={handleWebsite}
                        disabled={!gym.website}
                    >
                        <Ionicons name="globe-outline" size={20} color="white" />
                        <Text style={styles.actionButtonText}>Website</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    loadingContainer: {
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 50,
    },
    errorContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: responsiveFontSize(16),
        color: "#D32F2F",
        marginBottom: 20,
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: "#1976D2",
        padding: 12,
        borderRadius: 8,
        width: "60%",
        alignItems: "center",
    },
    retryButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: responsiveFontSize(16),
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    headerTitle: {
        fontSize: responsiveFontSize(18),
        fontWeight: "bold",
    },
    gymImage: {
        width: "100%",
        height: 250,
    },
    infoContainer: {
        padding: 16,
    },
    gymName: {
        fontSize: responsiveFontSize(24),
        fontWeight: "bold",
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    ratingText: {
        fontSize: responsiveFontSize(16),
        fontWeight: "bold",
        marginLeft: 4,
        marginRight: 8,
    },
    reviewCount: {
        fontSize: responsiveFontSize(14),
        color: "#666",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    infoText: {
        fontSize: responsiveFontSize(16),
        marginLeft: 8,
        color: "#333",
    },
    sectionTitle: {
        fontSize: responsiveFontSize(18),
        fontWeight: "bold",
        marginTop: 24,
        marginBottom: 12,
    },
    hoursRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    dayText: {
        fontSize: responsiveFontSize(16),
    },
    hoursText: {
        fontSize: responsiveFontSize(16),
        fontWeight: "bold",
    },
    facilitiesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 16,
    },
    facilityTag: {
        backgroundColor: "#f0f0f0",
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    facilityText: {
        fontSize: responsiveFontSize(14),
    },
    mapContainer: {
        height: 200,
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 16,
    },
    map: {
        width: "100%",
        height: "100%",
    },
    markerContainer: {
        alignItems: "center",
    },
    markerBubble: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 8,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    markerText: {
        fontSize: responsiveFontSize(12),
        fontWeight: "bold",
    },
    markerArrow: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 8,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "white",
        transform: [{ rotate: "180deg" }],
        marginTop: -2,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
    },
    actionButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    callButton: {
        backgroundColor: "#4CAF50",
    },
    directionsButton: {
        backgroundColor: "#2196F3",
    },
    websiteButton: {
        backgroundColor: "#FF9800",
    },
    actionButtonText: {
        color: "white",
        fontWeight: "bold",
        marginLeft: 8,
    },
});

export default GymDetailsScreen;