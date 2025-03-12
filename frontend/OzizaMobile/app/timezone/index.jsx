import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Dimensions,
    Platform
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Checkbox from "expo-checkbox"; // Import Checkbox from expo-checkbox

// Get screen dimensions
const { width, height } = Dimensions.get("window");

// Responsive Font Size Function
const responsiveFontSize = (size) => {
    const scaleFactor = width / 375; // Base width of 375
    const newSize = size * scaleFactor;
    return Math.ceil(newSize); // Round to nearest whole number
};

// Function to get safe area top padding
const getSafeAreaTop = () => {
    if (Platform.OS === "ios") {
        return 40; // Adjust for iOS
    }
    return 20; // Default for Android
};

const TimezoneSelectionScreen = () => {
    const router = useRouter();
    const [isEnabled, setIsEnabled] = useState(false); // Toggle state
    const [notifications, setNotifications] = useState([
        { id: 1, text: "UTC -01:00", checked: false },
        { id: 2, text: "UTC (GMT)", checked: false },
        { id: 3, text: "UTC +01:00", checked: false },
        { id: 4, text: "UTC +02:00", checked: false },
        { id: 5, text: "UTC +03:00", checked: false },
        { id: 6, text: "UTC +04:00", checked: false },
    ]);

    // Toggle switch handler
    const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

    // Checkbox handler
    const handleCheckboxChange = (id) => {
        const updatedNotifications = notifications.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
        );
        setNotifications(updatedNotifications);
    };

    return (
        <ScrollView
            contentContainerStyle={[styles.container, { paddingTop: getSafeAreaTop() }]}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { fontSize: responsiveFontSize(20) }]}>
                    Timezone Selection
                </Text>
                <View style={styles.switchContainer}>
                    <Switch
                        trackColor={{ false: "#767577", true: "#04b332" }}
                        thumbColor={isEnabled ? "#f7f7f7" : "#f7f7f7"}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
            </View>

            {/* List Items */}
            {notifications.map((item) => (
                <View key={item.id}>
                    <View style={styles.listItem}>
                        <Text style={[styles.listItemText, { fontSize: responsiveFontSize(16) }]}>
                            {item.text}
                        </Text>
                        <Checkbox
                            value={item.checked}
                            onValueChange={() => handleCheckboxChange(item.id)}
                            color={item.checked ? "#000" : undefined}
                        />
                    </View>
                    <View style={styles.separator} />
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
        paddingHorizontal: width * 0.06, // Responsive padding (5% of screen width)
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: height * 0.02, // Responsive padding (2% of screen height)
        marginBottom: height * 0.02,
    },
    title: {
        fontWeight: "700",
    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: height * 0.02, // Responsive padding (2% of screen height)
        paddingHorizontal: width * 0.02, // Responsive padding (5% of screen width)
    },
    listItemText: {
        fontWeight: "500",
        color: "#0A0A0A",
    },
    switchContainer: {
        transform: [{ scale: 0.8 }], // Scale down the Switch container
    },
    separator: {
        height: 1,
        backgroundColor: "#ccc",
    },
});

export default TimezoneSelectionScreen;