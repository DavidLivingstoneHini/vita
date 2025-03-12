import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, Platform } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons"; // Or any other icon library
// import { formatDistanceToNow } from 'date-fns'; // If you want relative dates
// import { enUS } from 'date-fns/locale'

const { width, height } = Dimensions.get("window");

// Function for responsive font size
const responsiveFontSize = (size) => {
    const scaleFactor = width / 375;
    return Math.ceil(size * scaleFactor);
};

// Function to handle safe area top padding
const getSafeAreaTop = () => (Platform.OS === "ios" ? 40 : 20);

const notifications = [
    { id: 1, title: "New Message", message: "You have a new message from John.", time: "2 hours ago", type: 'message' }, // Added 'type'
    { id: 2, title: "Appointment Reminder", message: "Your appointment is scheduled for tomorrow at 10 AM.", time: "1 day ago", type: 'reminder' },
    { id: 3, title: "Health Tip", message: "Drink more water to stay hydrated!", time: "3 days ago", type: 'health' },
];

const NotificationsScreen = () => {
    const router = useRouter();

    const getIconForNotificationType = (type) => {
        switch (type) {
            case 'message':
                return 'email'; // Example: MaterialIcons 'email'
            case 'reminder':
                return 'alarm'; // Example: MaterialIcons 'alarm'
            case 'health':
                return 'healing'; // Example: MaterialIcons 'healing'
            default:
                return 'notifications';
        }
    };


    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.notificationItem}
            onPress={() =>
                router.push(`/notificationdetail?title=${encodeURIComponent(item.title)}&message=${encodeURIComponent(item.message)}&time=${encodeURIComponent(item.time)}`)
            }
        >
            <View style={styles.iconContainer}>
                <Icon name={getIconForNotificationType(item.type)} size={responsiveFontSize(24)} color="#032825" />
            </View>
            <View style={styles.notificationTextContainer}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationTime}>{item.time}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Notifications</Text>
            </View>

            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: getSafeAreaTop(),
        paddingHorizontal: width * 0.04,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: height * 0.02,
        backgroundColor: '#f0f0f0', // Example: Header background
    },
    title: {
        fontSize: responsiveFontSize(22),  // Increased size
        fontWeight: "700",              // Stronger weight
        marginLeft: width * 0.02,
    },
    listContainer: {
        marginTop: height * 0.02,
    },
    notificationItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.03,
        // borderBottomWidth: 1,   Removed the bottom border
        // borderBottomColor: "#ccc",
        backgroundColor: "#F9F9F9",
        borderRadius: 12,          // Increased corner radius
        marginBottom: height * 0.01,
        shadowColor: "#000",       // Added shadow for depth
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    iconContainer: {
        backgroundColor: "#D9D9D9",
        borderRadius: 50,
        width: responsiveFontSize(40),
        height: responsiveFontSize(40),
        alignItems: "center",
        justifyContent: "center",
        marginRight: width * 0.03,
    },
    notificationTextContainer: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: responsiveFontSize(16),
        fontWeight: "bold",
        color: "#032825",
    },
    notificationMessage: {
        fontSize: responsiveFontSize(14),
        color: "#666",
        marginTop: 2,
    },
    notificationTime: {
        fontSize: responsiveFontSize(12),
        color: "#999",
        marginTop: 2,
    },
});

export default NotificationsScreen;

