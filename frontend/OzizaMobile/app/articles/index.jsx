import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Platform,
  Share,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { getArticleById } from "../../services/api";
import RenderHTML from "react-native-render-html";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get("window");

// Responsive font sizing
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

const ArticleScreen = () => {
  const router = useRouter();
  const { articleId } = useLocalSearchParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getArticleById(articleId);

        if (response.status === "success") {
          setArticle(response.data);
          // Check if article is bookmarked
          const bookmarks = await AsyncStorage.getItem('bookmarks');
          const bookmarksArray = bookmarks ? JSON.parse(bookmarks) : [];
          setIsBookmarked(bookmarksArray.some(item => item.id === response.data.id));
        } else {
          throw new Error(response.message || "Failed to load article");
        }
      } catch (err) {
        console.error("Failed to fetch article:", err);
        setError(err.message || "Failed to load article");

        if (err.message.includes("401")) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const handleShare = async () => {
    if (!article) return;

    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\n${article.content.substring(0, 200)}...`,
        url: article.header_image || "https://oziza.org/articles/" + article.id,
      });
    } catch (error) {
      console.log("Error sharing:", error.message);
    }
  };

  const handlePrint = async () => {
    if (!article) return;

    try {
      const html = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: Arial; padding: 20px; }
              h1 { font-size: 24px; color: #000; }
              img { max-width: 100%; height: auto; }
              p { font-size: 16px; line-height: 1.5; }
            </style>
          </head>
          <body>
            <h1>${article.title}</h1>
            ${article.content}
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.log("Error printing:", error);
    }
  };

  const toggleBookmark = async () => {
    if (!article) return;

    try {
      const bookmarks = await AsyncStorage.getItem('bookmarks');
      let bookmarksArray = bookmarks ? JSON.parse(bookmarks) : [];

      if (isBookmarked) {
        // Remove bookmark
        bookmarksArray = bookmarksArray.filter(item => item.id !== article.id);
      } else {
        // Add bookmark
        bookmarksArray.push({
          id: article.id,
          title: article.title,
          summary: article.summary,
          header_image: article.header_image,
          date: new Date().toISOString()
        });
      }

      await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarksArray));
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.log("Error toggling bookmark:", error);
    }
  };

  const toggleSpeech = () => {
    if (!article) return;

    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      // Strip HTML tags for speech
      const textContent = article.content.replace(/<[^>]*>/g, ' ');
      Speech.speak(`${article.title}. ${textContent}`, {
        language: 'en',
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
      });
      setIsSpeaking(true);
    }
  };

  const renderHtmlContent = (html) => {
    if (!html) return null;

    return (
      <RenderHTML
        contentWidth={width * 0.9}
        source={{ html }}
        tagsStyles={{
          p: {
            fontSize: responsiveFontSize(16),
            lineHeight: responsiveFontSize(24),
            color: "#333",
            marginBottom: height * 0.01,
            textAlign: 'justify',
          },
          strong: {
            fontWeight: "bold",
            color: "#000000",
          },
          h2: {
            fontSize: responsiveFontSize(19),
            fontWeight: "bold",
            marginVertical: height * 0.015,
            color: "#000000",
            paddingBottom: 2,
          },
          h3: {
            fontSize: responsiveFontSize(19),
            fontWeight: "600",
            marginVertical: height * 0.015,
            color: "#000000",
          },
          ul: {
            marginBottom: height * 0.03,
            paddingLeft: width * 0.05,
          },
          li: {
            fontSize: responsiveFontSize(16),
            lineHeight: responsiveFontSize(24),
            color: "#333",
            marginBottom: height * 0.01,
          },
          blockquote: {
            backgroundColor: '#f8f8f8',
            borderLeftWidth: 4,
            borderLeftColor: '#000000',
            padding: width * 0.04,
            marginVertical: height * 0.02,
            fontStyle: 'italic',
          },
        }}
        baseStyle={{
          color: '#333',
          lineHeight: responsiveFontSize(24),
        }}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require("../../assets/images/back-arrow.png")}
              style={styles.backArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading...</Text>
          <View style={{ width: responsiveFontSize(24) }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require("../../assets/images/back-arrow.png")}
              style={styles.backArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
          <View style={{ width: responsiveFontSize(24) }} />
        </View>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!article) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require("../../assets/images/back-arrow.png")}
              style={styles.backArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Not Found</Text>
          <View style={{ width: responsiveFontSize(24) }} />
        </View>
        <Text style={styles.errorText}>Article not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("../../assets/images/back-arrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
          {article.title}
        </Text>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionIcon} onPress={toggleSpeech}>
            <MaterialIcons
              name={isSpeaking ? "volume-off" : "volume-up"}
              size={responsiveFontSize(20)}
              color="#000"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionIcon} onPress={toggleBookmark}>
            <MaterialIcons
              name={isBookmarked ? "bookmark" : "bookmark-border"}
              size={responsiveFontSize(20)}
              color="#000"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionIcon} onPress={handlePrint}>
            <Feather
              name="download"
              size={responsiveFontSize(20)}
              color="#000"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionIcon} onPress={handleShare}>
            <Feather
              name="share-2"
              size={responsiveFontSize(20)}
              color="#000"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {article.header_image && (
          <>
            {console.log("Image URL to load:", article.header_image)}
            <Image
              source={{ uri: article.header_image }}
              style={styles.headerImage}
              defaultSource={require("../../assets/images/placeholder-image.jpg")}
              onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
            />
          </>
        )}

        {renderHtmlContent(article.content)}

        {article.categories && article.categories.length > 0 && (
          <View style={styles.categoriesContainer}>
            <Text style={styles.sectionTitle}>Categories:</Text>
            <View style={styles.categoryTags}>
              {article.categories.map((category, index) => (
                <View key={index} style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{category.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

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
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: "700",
    flex: 1,
    marginLeft: width * 0.02,
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
  headerImage: {
    width: "100%",
    height: height * 0.3,
    borderRadius: 8,
    marginTop: height * 0.01,
    marginBottom: height * 0.02,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: "600",
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
    color: "#000000",
  },
  errorText: {
    fontSize: responsiveFontSize(18),
    color: "red",
    textAlign: "center",
    marginTop: height * 0.2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesContainer: {
    marginTop: height * 0.02,
    marginBottom: height * 0.03,
  },
  categoryTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: height * 0.01,
  },
  categoryTag: {
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.005,
    marginRight: width * 0.02,
    marginBottom: height * 0.01,
  },
  categoryText: {
    fontSize: responsiveFontSize(12),
    color: "#555",
  },
  backArrow: {
    width: width * 0.05,
    height: width * 0.05,
    marginRight: width * 0.02,
  },
});

export default ArticleScreen;