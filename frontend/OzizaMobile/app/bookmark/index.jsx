import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    Dimensions,
    Platform,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const BookmarksScreen = () => {
    const router = useRouter();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const storedBookmarks = await AsyncStorage.getItem('bookmarks');
                setBookmarks(storedBookmarks ? JSON.parse(storedBookmarks) : []);
            } catch (error) {
                console.log("Error fetching bookmarks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, []);

    const removeBookmark = async (id) => {
        try {
            const updatedBookmarks = bookmarks.filter(item => item.id !== id);
            await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
            setBookmarks(updatedBookmarks);
        } catch (error) {
            console.log("Error removing bookmark:", error);
        }
    };

    const handleArticlePress = (articleId) => {
        router.push({
            pathname: "articles/index",
            params: { articleId: articleId.toString() }
        });
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Bookmarks</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#000000" />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bookmarks</Text>
            </View>

            {bookmarks.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="bookmark-border" size={responsiveFontSize(50)} color="#ccc" />
                    <Text style={styles.emptyText}>No bookmarks yet</Text>
                    <Text style={styles.emptySubText}>Save articles to read them later</Text>
                </View>
            ) : (
                <FlatList
                    data={bookmarks}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.bookmarkItem}
                            onPress={() => handleArticlePress(item.id)}
                        >
                            {item.header_image && (
                                <Image
                                    source={{ uri: item.header_image }}
                                    style={styles.bookmarkImage}
                                    defaultSource={require("../../assets/images/placeholder-image.jpg")}
                                />
                            )}
                            <View style={styles.bookmarkContent}>
                                <Text style={styles.bookmarkTitle} numberOfLines={2}>{item.title}</Text>
                                <Text style={styles.bookmarkSummary} numberOfLines={2}>{item.summary}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.bookmarkRemove}
                                onPress={() => removeBookmark(item.id)}
                            >
                                <Icon name="delete" size={responsiveFontSize(20)} color="#ff4444" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )}
                />
            )}
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
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.04,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    headerTitle: {
        fontSize: responsiveFontSize(18),
        fontWeight: "700",
        marginLeft: width * 0.02,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: height * 0.1,
    },
    emptyText: {
        fontSize: responsiveFontSize(18),
        color: "#666",
        marginTop: height * 0.02,
    },
    emptySubText: {
        fontSize: responsiveFontSize(14),
        color: "#999",
        marginTop: height * 0.01,
    },
    listContainer: {
        paddingHorizontal: width * 0.04,
        paddingTop: height * 0.02,
    },
    bookmarkItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: height * 0.02,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        overflow: "hidden",
    },
    bookmarkImage: {
        width: width * 0.2,
        height: width * 0.2,
        resizeMode: "cover",
    },
    bookmarkContent: {
        flex: 1,
        padding: width * 0.03,
    },
    bookmarkTitle: {
        fontSize: responsiveFontSize(16),
        fontWeight: "600",
        marginBottom: height * 0.005,
    },
    bookmarkSummary: {
        fontSize: responsiveFontSize(14),
        color: "#666",
    },
    bookmarkRemove: {
        padding: width * 0.04,
    },
});

export default BookmarksScreen;