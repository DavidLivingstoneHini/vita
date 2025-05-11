import React from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Platform,
    Share,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native"; // Add this import
import Icon from "react-native-vector-icons/MaterialIcons";
import { Feather } from "@expo/vector-icons";
import { mythsItems } from "../../utils/mythsData"; // Import dummy data

const { width, height } = Dimensions.get("window");

// Responsive font sizing
const responsiveFontSize = (size) => {
    const scaleFactor = width / 375;
    const newSize = size * scaleFactor;
    return Math.ceil(newSize);
};

// Get safe area padding for different platforms
const getSafeAreaTop = () => {
    if (Platform.OS === "ios") {
        return 40;
    }
    return 20;
};

// Function to process myth content by removing the placeholders and actually formatting the text
const formatMythContent = (content) => {
    if (!content) return "";

    // Remove the special characters and convert them to actual line breaks
    return content
        .replace(/\{\\?["']\\n\\n\\?["']\}/g, '\n\n')
        .replace(/\{\\?["']\\n\\?["']\}/g, '\n')
        .trim();
};

const MythDetail = () => {
    const router = useRouter();
    const navigation = useNavigation(); // Get navigation object
    const { id } = useLocalSearchParams(); // Extract id from query params
    const parsedMythId = id ? parseInt(id, 10) : null; // Parse mythId to a number
    const myth = mythsItems.find((m) => m.id === parsedMythId); // Find the myth

    // Navigation function to match the MythsScreen pattern
    const navigateToMythDetail = (item) => {
        let id;

        // If item is a number (id), use it directly
        if (typeof item === 'number') {
            id = item;
        }
        // If item is a myth object, use its id
        else if (item && item.id) {
            id = item.id;
        }
        // Default case
        else {
            id = 1;
        }

        // Navigate using the same pattern as MythsScreen
        navigation.navigate("mythdetail/index", { id: id });
    };

    if (!myth) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Myths</Text>
                    <View style={{ width: responsiveFontSize(24) }} />
                </View>
                <Text style={styles.errorText}>Myth not found</Text>
            </View>
        );
    }

    // Format the myth content
    const formattedContent = formatMythContent(myth.content);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this myth: ${myth.title}\n\n${formattedContent}`,
                url: myth.image,
            });
        } catch (error) {
            console.log("Error sharing:", error.message);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
                    Exposing Myths
                </Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.actionIcon} onPress={handleShare}>
                        <Feather name="share-2" size={responsiveFontSize(20)} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Scrollable Content */}
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Myth Image */}
                <Image source={myth.image} style={styles.image} />

                {/* Myth Title */}
                <Text style={styles.titleQuestion}>{myth.title}</Text>

                {/* Myth Content - Now using formatted content */}
                <Text style={styles.content}>{formattedContent}</Text>

                {/* Similar Myths Section */}
                <Text style={styles.similarMythsHeading}>Similar Myths</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {mythsItems
                        .filter((m) => m.id !== parsedMythId) // Exclude the current myth
                        .map((similarMyth) => (
                            <TouchableOpacity
                                key={similarMyth.id}
                                style={styles.similarMythItem}
                                onPress={() => navigateToMythDetail(similarMyth.id)}
                            >
                                <Image source={similarMyth.image} style={styles.similarMythImage} />
                                <Text style={styles.similarMythTitle} numberOfLines={2}>
                                    {similarMyth.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                </ScrollView>

                {/* Spacer */}
                <View style={{ height: height * 0.05 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: getSafeAreaTop(),
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.04,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    headerTitle: {
        fontSize: responsiveFontSize(18),
        fontWeight: "700",
        flex: 1,
        textAlign: "center",
        marginHorizontal: width * 0.02,
    },
    headerActions: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionIcon: {
        marginLeft: width * 0.03,
        padding: width * 0.01,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: width * 0.04,
    },
    image: {
        width: "100%",
        height: height * 0.25,
        borderRadius: 8,
        marginTop: height * 0.02,
    },
    titleQuestion: {
        fontSize: responsiveFontSize(20),
        fontWeight: "700",
        marginTop: height * 0.03,
        marginBottom: height * 0.02,
    },
    content: {
        fontSize: responsiveFontSize(16),
        lineHeight: responsiveFontSize(24),
        color: "#333",
        marginBottom: height * 0.02,
    },
    similarMythsHeading: {
        fontSize: responsiveFontSize(18),
        fontWeight: "700",
        marginTop: height * 0.03,
        marginBottom: height * 0.02,
    },
    similarMythItem: {
        width: width * 0.4,
        marginRight: 16,
    },
    similarMythImage: {
        width: "100%",
        height: width * 0.3,
        borderRadius: 8,
        marginBottom: 8,
    },
    similarMythTitle: {
        fontSize: responsiveFontSize(14),
        fontWeight: "600",
        color: "#0C1549",
        textAlign: "center",
    },
    errorText: {
        fontSize: responsiveFontSize(18),
        color: "red",
        textAlign: "center",
        marginTop: height * 0.2,
    },
});

export default MythDetail;