import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Dimensions,
    Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const { width, height } = Dimensions.get("window");
const API_BASE_URL = "https://www.ozizabackapp.in/api/";

const responsiveFontSize = (size) => {
    const scaleFactor = width / 375;
    return Math.ceil(size * scaleFactor);
};

const getSafeAreaTop = () => {
    return Platform.OS === "ios" ? 40 : 20;
};

const PermissionItem = ({ title, description, value, onValueChange }) => (
    <View style={styles.permissionItem}>
        <View style={styles.permissionTextContainer}>
            <Text style={[styles.permissionTitle, { fontSize: responsiveFontSize(16) }]}>
                {title}
            </Text>
            <Text style={[styles.permissionDesc, { fontSize: responsiveFontSize(14) }]}>
                {description}
            </Text>
        </View>
        <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#767577', true: '#04b332' }}
            thumbColor="#f7f7f7"
        />
    </View>
);

const ManagePermissionsScreen = () => {
    const router = useRouter();
    const [permissions, setPermissions] = React.useState({
        location: false,
        notifications: true,
        camera: false,
        contacts: false,
        storage: true,
    });

    // Fetch current permissions on load
    React.useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const accessToken = await SecureStore.getItemAsync("access_token");
                const response = await fetch(`${API_BASE_URL}v1/users/permissions/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const data = await response.json();
                setPermissions({
                    location: data.allow_location,
                    notifications: data.allow_notifications,
                    camera: data.allow_camera,
                    contacts: data.allow_contacts,
                    storage: data.allow_storage,
                });
            } catch (error) {
                console.error("Error fetching permissions:", error);
            }
        };
        fetchPermissions();
    }, []);

    // Update permissions on toggle
    const togglePermission = async (permission) => {
        const newValue = !permissions[permission];
        const updatedPermissions = { ...permissions, [permission]: newValue };

        try {
            const accessToken = await SecureStore.getItemAsync("access_token");
            const response = await fetch(`${API_BASE_URL}v1/users/permissions/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    [`allow_${permission}`]: newValue,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update permissions");
            }

            setPermissions(updatedPermissions);
        } catch (error) {
            console.error("Error updating permissions:", error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to update permissions',
            });
        }
    };

    return (
        <ScrollView
            contentContainerStyle={[styles.container, { paddingTop: getSafeAreaTop() }]}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={responsiveFontSize(24)} color="#000" />
                </TouchableOpacity>
                <Text style={[styles.title, { fontSize: responsiveFontSize(18) }]}>
                    Manage Permissions
                </Text>
            </View>

            <View style={styles.content}>
                <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(14) }]}>
                    APP PERMISSIONS
                </Text>

                <PermissionItem
                    title="Location Access"
                    description="Allow app to access your location for nearby features"
                    value={permissions.location}
                    onValueChange={() => togglePermission("location")}
                />

                <PermissionItem
                    title="Notifications"
                    description="Receive important updates and alerts"
                    value={permissions.notifications}
                    onValueChange={() => togglePermission("notifications")}
                />

                <PermissionItem
                    title="Camera Access"
                    description="Allow app to access your camera for photos and videos"
                    value={permissions.camera}
                    onValueChange={() => togglePermission("camera")}
                />

                <PermissionItem
                    title="Contacts Access"
                    description="Find friends who also use this app"
                    value={permissions.contacts}
                    onValueChange={() => togglePermission("contacts")}
                />

                <PermissionItem
                    title="Storage Access"
                    description="Save files and media to your device"
                    value={permissions.storage}
                    onValueChange={() => togglePermission("storage")}
                />

                <Text style={[styles.note, { fontSize: responsiveFontSize(12) }]}>
                    Some permissions are required for core features. You can change these anytime in your device settings.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
        paddingHorizontal: width * 0.05,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: height * 0.02,
    },
    title: {
        fontWeight: "700",
        marginLeft: width * 0.04,
    },
    content: {
        marginTop: height * 0.03,
    },
    sectionTitle: {
        color: "#828282",
        fontWeight: "500",
        marginBottom: height * 0.02,
    },
    permissionItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: height * 0.02,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    permissionTextContainer: {
        flex: 1,
        marginRight: width * 0.05,
    },
    permissionTitle: {
        fontWeight: "500",
        color: "#0A0A0A",
        marginBottom: height * 0.005,
    },
    permissionDesc: {
        color: "#828282",
    },
    note: {
        color: "#828282",
        marginTop: height * 0.03,
        fontStyle: "italic",
    },
});

export default ManagePermissionsScreen;