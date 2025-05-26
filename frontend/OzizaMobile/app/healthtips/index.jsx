import React from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
    StatusBar,
    FlatList,
    SafeAreaView,
    Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Import images
const backArrowIcon = require("../../assets/images/back-arrow.png");
const bannerBackground = require("../../assets/images/banner1.jpeg");
const ItemImage1 = require("../../assets/images/bleach.png");
const ItemImage2 = require("../../assets/images/hypertension.jpg");
const ItemImage3 = require("../../assets/images/Phobia.jpg");
const ItemImage25 = require("../../assets/images/headache.jpg");
const ItemImage26 = require("../../assets/images/anxiety.jpg");
const ItemImage27 = require("../../assets/images/eczema.jpg");
const ItemImage21 = require("../../assets/images/fitness.png");
const ItemImage22 = require("../../assets/images/sleep.png");
const ItemImage23 = require("../../assets/images/exercise.png");
const ItemImage24 = require("../../assets/images/eye.jpg");

const HealthTips = () => {
    const navigation = useNavigation();
    const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

    // All health conditions data
    const healthTips = [
        // { id: 1, image: ItemImage25, title: "Headache" },
        // { id: 2, image: ItemImage27, title: "Eczema" },
        // { id: 3, image: ItemImage3, title: "Phobia" },
        // { id: 4, image: ItemImage2, title: "Hypertension" },
        { id: 6, image: ItemImage26, title: "Anxiety" },
        { id: 7, image: ItemImage21, title: "Weight Loss" },
        { id: 8, image: ItemImage22, title: "Sleep" },
        { id: 9, image: ItemImage23, title: "Physical Exercise" },
        { id: 10, image: ItemImage24, title: "Eye Health" },
        { id: 11, image: ItemImage1, title: "Skin Bleaching" },
    ];

    const navigateToDetail = (title) => {
        // Create a mapping between health condition titles and article IDs
        const conditionToArticleMap = {
            "Anxiety": 4,
            "Diabetes": 2,
            "General Ailments": 1,
            "Weight Loss": 12,
            "Sleep": 13,
            "Skin Bleaching": 10,
            "Physical Exercise": 15,
            "Eye Health": 14,
        };

        // Default to article ID 1 if no match found
        let articleId = conditionToArticleMap[title] || 1;

        // Navigate to the article detail screen
        navigation.navigate("articles/index", { articleId });
    };

    // Calculate font scaling factor based on screen width
    const fontScale = Math.min(screenWidth / 375, 1.2); // Using iPhone 8 as base (375px width)

    // Calculate responsive sizes
    const getResponsiveSize = (size) => size * fontScale;

    const renderHealthItem = ({ item, index }) => {
        // Calculate the item width to show 3 items per row with spacing
        const itemWidth = (screenWidth - 48) / 3;

        return (
            <TouchableOpacity
                style={[styles.healthItem, { width: itemWidth }]}
                onPress={() => navigateToDetail(item.title)}
            >
                <Image
                    source={item.image}
                    style={[styles.healthImage, { height: itemWidth * 0.9 }]}
                    resizeMode="cover"
                />
                <Text
                    style={[styles.healthTitle, { fontSize: getResponsiveSize(12) }]}
                    numberOfLines={2}
                >
                    {item.title}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Fixed Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Image source={backArrowIcon} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { fontSize: getResponsiveSize(18), marginLeft: 10 }]}>
                    Health Conditions
                </Text>
                <View style={styles.placeholderRight} />
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Banner with Title */}
                <ImageBackground
                    source={bannerBackground}
                    style={[styles.banner, { height: screenHeight * 0.18 }]}
                    resizeMode="cover"
                >
                    <View style={styles.bannerOverlay}>
                        <Text style={[styles.bannerTitle, { fontSize: getResponsiveSize(22) }]}>
                            Useful Health Tips
                        </Text>
                    </View>
                </ImageBackground>

                {/* Health Conditions Grid Section */}
                <View style={styles.healthContainer}>
                    <FlatList
                        data={healthTips}
                        renderItem={renderHealthItem}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={3}
                        columnWrapperStyle={styles.healthRow}
                        scrollEnabled={false} // Disable FlatList scroll, we're using ScrollView
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        height: Platform.OS === 'ios' ? 56 : 60,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#EFEFEF",
        paddingHorizontal: 16,
        zIndex: 10,
    },
    backButton: {
        padding: 8,
    },
    backIcon: {
        width: 20,
        height: 20,
    },
    headerTitle: {
        fontWeight: "700",
        color: "#0C1549",
    },
    placeholderRight: {
        width: 36,
    },
    scrollContainer: {
        flex: 1,
    },
    banner: {
        width: "100%",
    },
    bannerOverlay: {
        flex: 1,
        backgroundColor: "rgba(12, 21, 73, 0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    bannerTitle: {
        fontWeight: "700",
        color: "#FFFFFF",
        textAlign: "center",
    },
    healthContainer: {
        padding: 16,
    },
    healthRow: {
        justifyContent: "space-between",
        marginBottom: 16,
    },
    healthItem: {
        alignItems: "center",
        marginBottom: 16,
    },
    healthImage: {
        width: "100%",
        borderRadius: 8,
        marginBottom: 8,
    },
    healthTitle: {
        fontWeight: "600",
        textAlign: "center",
        color: "#0C1549",
        paddingHorizontal: 4,
    },
});

export default HealthTips;