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
import Checkbox from "expo-checkbox";

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => {
    const scaleFactor = width / 375;
    return Math.ceil(size * scaleFactor);
};

const getSafeAreaTop = () => {
    return Platform.OS === "ios" ? 40 : 20;
};

const SmsNotificationsScreen = () => {
    const router = useRouter();
    const [isEnabled, setIsEnabled] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, text: "Appointment Reminders", checked: false },
        { id: 2, text: "Emergency Alerts", checked: false },
        { id: 3, text: "Security Notifications", checked: false },
    ]);

    const toggleSwitch = () => setIsEnabled(prev => !prev);

    const handleCheckboxChange = (id) => {
        setNotifications(notifications.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    return (
        <ScrollView
            contentContainerStyle={[styles.container, { paddingTop: getSafeAreaTop() }]}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <Text style={[styles.title, { fontSize: responsiveFontSize(20) }]}>
                    SMS Notifications
                </Text>
                <View style={styles.switchContainer}>
                    <Switch
                        trackColor={{ false: "#767577", true: "#04b332" }}
                        thumbColor="#f7f7f7"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
            </View>

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
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.02,
    },
    listItemText: {
        fontWeight: "500",
        color: "#0A0A0A",
    },
    switchContainer: {
        transform: [{ scale: 0.8 }],
    },
    separator: {
        height: 1,
        backgroundColor: "#ccc",
    },
});

export default SmsNotificationsScreen;