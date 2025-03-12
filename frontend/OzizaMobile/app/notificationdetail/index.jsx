import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => {
    const scaleFactor = width / 375;
    return Math.ceil(size * scaleFactor);
};

const NotificationDetailScreen = () => {
    const router = useRouter();
    const { title, message, time } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Notification</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.notificationTitle}>{title}</Text>
                <Text style={styles.notificationMessage}>{message}</Text>
                <Text style={styles.notificationTime}>{time}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: width * 0.04,
        paddingTop: 40,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: height * 0.02,
    },
    title: {
        fontSize: responsiveFontSize(20),
        fontWeight: "800",
        marginLeft: width * 0.02,
    },
    content: {
        marginTop: height * 0.02,
        padding: width * 0.04,
        backgroundColor: "#F9F9F9",
        borderRadius: 8,
    },
    notificationTitle: {
        fontSize: responsiveFontSize(18),
        fontWeight: "bold",
        color: "#032825",
        marginBottom: 8,
    },
    notificationMessage: {
        fontSize: responsiveFontSize(16),
        color: "#666",
        marginBottom: 8,
    },
    notificationTime: {
        fontSize: responsiveFontSize(14),
        color: "#999",
    },
});

export default NotificationDetailScreen;
