import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Platform,
    ActivityIndicator,
    Alert,
    SafeAreaView,
    StatusBar,
} from "react-native";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => {
    const scaleFactor = width / 375;
    const newSize = size * scaleFactor;
    return Math.ceil(newSize);
};

const getSafeAreaTop = () => {
    if (Platform.OS === "ios") {
        return 40;
    }
    return 20;
};

const ProfileInfoScreen = () => {
    const router = useRouter();
    const [userData, setUserData] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        profile_picture: null,
    });
    const [loading, setLoading] = useState(true);

    const getUserInitials = (name) => {
        if (!name) return "";
        const initials = name
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase());
        return initials.slice(0, 2).join("");
    };

    const fetchUserData = async () => {
        try {
            const accessToken = await SecureStore.getItemAsync("access_token");
            const response = await fetch("https://www.ozizabackapp.in/api/v1/users/profile/", {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserData({
                    full_name: data.full_name || "Not provided",
                    email: data.email || "Not provided",
                    phone_number: data.phone_number || "Not provided",
                    profile_picture: data.profile_picture || null,
                });
            } else {
                throw new Error("Failed to fetch profile data");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to load profile information',
            });
        } finally {
            setLoading(false);
        }
    };

    const navigateToDeactivation = () => {
        router.push('/accountdeactivation');
    };

    const confirmDeactivation = () => {
        Alert.alert(
            "Account Deactivation",
            "You're about to navigate to the account deactivation screen. Are you sure you want to proceed?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Continue",
                    onPress: navigateToDeactivation
                }
            ]
        );
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#0313a3" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#F8F9FA" barStyle="dark-content" />

            {/* Fixed Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <AntDesign
                        name="arrowleft"
                        size={responsiveFontSize(24)}
                        color="#000"
                    />
                </TouchableOpacity>
                <Text style={[styles.title, { fontSize: responsiveFontSize(18) }]}>
                    Profile Information
                </Text>
                <View style={styles.headerRightPlaceholder} />
            </View>

            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    {/* Profile Picture */}
                    <View style={styles.profilePictureContainer}>
                        {userData.profile_picture ? (
                            <Image
                                source={{ uri: userData.profile_picture }}
                                style={styles.profilePicture}
                            />
                        ) : (
                            <View style={styles.defaultProfilePicture}>
                                <Text style={styles.initials}>{getUserInitials(userData.full_name)}</Text>
                            </View>
                        )}
                    </View>

                    {/* User Name */}
                    <Text style={styles.userName}>{userData.full_name}</Text>
                </View>

                {/* Profile Info */}
                <View style={styles.infoContainer}>
                    {/* Info Item - Full Name */}
                    <View style={styles.infoItem}>
                        <View style={styles.infoIcon}>
                            <Feather name="user" size={20} color="#0313a3" />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Full Name</Text>
                            <Text style={styles.infoValue}>{userData.full_name}</Text>
                        </View>
                    </View>

                    <View style={styles.separator} />

                    {/* Info Item - Email */}
                    <View style={styles.infoItem}>
                        <View style={styles.infoIcon}>
                            <Feather name="mail" size={20} color="#0313a3" />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Email Address</Text>
                            
                            <Text style={styles.infoValue}>{userData.email}</Text>
                        </View>
                    </View>

                    <View style={styles.separator} />

                    {/* Info Item - Phone */}
                    <View style={styles.infoItem}>
                        <View style={styles.infoIcon}>
                            <Feather name="phone" size={20} color="#0313a3" />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Phone Number</Text>
                            <Text style={styles.infoValue}>{userData.phone_number}</Text>
                        </View>
                    </View>
                </View>

                {/* Danger Zone */}
                <View style={styles.dangerZone}>
                    <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
                    <Text style={styles.dangerZoneSubtitle}>These actions are irreversible</Text>

                    <TouchableOpacity
                        style={styles.deactivateButton}
                        onPress={confirmDeactivation}
                    >
                        <MaterialIcons name="delete-outline" size={20} color="#FFF" />
                        <Text style={styles.deactivateButtonText}>Deactivate Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F8F9FA",
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.05,
        backgroundColor: "#F8F9FA",
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
        zIndex: 10,
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontWeight: "700",
        color: "#333",
    },
    headerRightPlaceholder: {
        width: 40,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: width * 0.05,
        paddingBottom: 30,
    },
    profileSection: {
        alignItems: 'center',
        marginVertical: height * 0.03,
    },
    profilePictureContainer: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    profilePicture: {
        width: width * 0.35,
        height: width * 0.35,
        borderRadius: width * 0.175,
        borderWidth: 3,
        borderColor: "#FFF",
    },
    defaultProfilePicture: {
        width: width * 0.35,
        height: width * 0.35,
        borderRadius: width * 0.175,
        backgroundColor: "#0313a3",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#FFF",
    },
    initials: {
        fontSize: responsiveFontSize(32),
        color: "#FFF",
        fontWeight: 'bold',
    },
    userName: {
        fontSize: responsiveFontSize(20),
        fontWeight: '600',
        color: '#333',
        marginTop: 15,
    },
    infoContainer: {
        marginTop: height * 0.02,
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: width * 0.04,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2.22,
        elevation: 3,
    },
    infoItem: {
        paddingVertical: height * 0.02,
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0EDFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: responsiveFontSize(12),
        color: '#828282',
        marginBottom: 3,
    },
    infoValue: {
        fontSize: responsiveFontSize(16),
        color: '#0A0A0A',
        fontWeight: '500',
    },
    separator: {
        height: 1,
        backgroundColor: '#f0f0f0',
    },
    dangerZone: {
        marginTop: 30,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2.22,
        elevation: 3,
    },
    dangerZoneTitle: {
        fontSize: responsiveFontSize(18),
        fontWeight: '700',
        color: '#FF4444',
        marginBottom: 5,
    },
    dangerZoneSubtitle: {
        fontSize: responsiveFontSize(12),
        color: '#828282',
        marginBottom: 20,
    },
    deactivateButton: {
        backgroundColor: '#FF4444',
        padding: 15,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deactivateButtonText: {
        color: '#FFF',
        fontWeight: '600',
        marginLeft: 10,
        fontSize: responsiveFontSize(16),
    },
});

export default ProfileInfoScreen;