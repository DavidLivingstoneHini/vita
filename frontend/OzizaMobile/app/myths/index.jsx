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
import { mythsItems } from "../../utils/mythsData"; // Import dummy data

// Import images
const backArrowIcon = require("../../assets/images/back-arrow.png");
const bannerBackground = require("../../assets/images/banner1.jpeg");

const MythsScreen = () => {
    const navigation = useNavigation();
    const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

    const navigateToMythDetail = (item) => {
        let id;

        // If item is a string (title), find the corresponding myth
        if (typeof item === 'string') {
            const matchingMyth = mythsItems.find((myth) =>
                myth.title.toLowerCase().includes(item.toLowerCase())
            );

            if (matchingMyth) {
                id = matchingMyth.id;
            } else {
                id = 1; // Default to first myth if no match found
            }
        } else {
            // If item is already a myth object, use its id
            id = item.id;
        }

        // Navigate to the myth detail screen with the mythId parameter
        navigation.navigate("mythdetail/index", { id });
    };

    // Calculate font scaling factor based on screen width
    const fontScale = Math.min(screenWidth / 375, 1.2); // Using iPhone 8 as base (375px width)

    // Calculate responsive sizes
    const getResponsiveSize = (size) => size * fontScale;

    const renderMythItem = ({ item, index }) => {
        // Calculate the item width to show 3 items per row with spacing
        const itemWidth = (screenWidth - 48) / 3;

        return (
            <TouchableOpacity
                style={[styles.mythItem, { width: itemWidth }]}
                onPress={() => navigateToMythDetail(item)}
            >
                <Image source={item.image} style={[styles.mythImage, { height: itemWidth * 0.9 }]} resizeMode="cover" />
                <Text style={[styles.mythTitle, { fontSize: getResponsiveSize(12) }]} numberOfLines={2}>
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
                    Exposing Myths
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
                            Myths on Health
                        </Text>
                    </View>
                </ImageBackground>

                {/* Myths Grid Section */}
                <View style={styles.mythsContainer}>
                    <FlatList
                        data={mythsItems}
                        renderItem={renderMythItem}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={3}
                        columnWrapperStyle={styles.mythsRow}
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
        justifyContent: "flex-start", // Align items to the start
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
        width: 36, // Balance the layout
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
    mythsContainer: {
        padding: 16,
    },
    mythsRow: {
        justifyContent: "space-between",
        marginBottom: 16,
    },
    mythItem: {
        alignItems: "center",
        marginBottom: 16,
    },
    mythImage: {
        width: "100%",
        borderRadius: 8,
        marginBottom: 8,
    },
    mythTitle: {
        fontWeight: "600",
        textAlign: "center",
        color: "#0C1549",
        paddingHorizontal: 4,
    },
});

export default MythsScreen;