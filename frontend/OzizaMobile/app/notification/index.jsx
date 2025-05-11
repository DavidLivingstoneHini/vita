import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, Platform, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { fetchNotifications } from "../../services/notificationService";
import * as SecureStore from 'expo-secure-store';

const { width, height } = Dimensions.get("window");

// Function for responsive font size
const responsiveFontSize = (size) => {
    const scaleFactor = width / 375;
    return Math.ceil(size * scaleFactor);
};

const getSafeAreaTop = () => (Platform.OS === "ios" ? 40 : 20);

const NotificationsScreen = () => {
    const router = useRouter();
    const [notifications, setNotifications] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadNotifications = async () => {
        setRefreshing(true);
        try {
            const fetchedNotifications = await fetchNotifications();
            setNotifications(fetchedNotifications);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const getIconForNotificationType = (type) => {
        switch (type) {
            case 'message':
                return 'email';
            case 'reminder':
                return 'alarm';
            case 'health':
                return 'healing';
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
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={loadNotifications}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No notifications yet</Text>
                    </View>
                }
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
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: responsiveFontSize(22),
        fontWeight: "700",
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
        backgroundColor: "#F9F9F9",
        borderRadius: 12,
        marginBottom: height * 0.01,
        shadowColor: "#000",
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.3,
    },
    emptyText: {
        fontSize: responsiveFontSize(16),
        color: '#999',
    },
});

export default NotificationsScreen;