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
  FlatList,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { getArticleById, getRecommendedArticles } from "../../services/api";
import RenderHTML from "react-native-render-html";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const responsiveFontSize = (size) => {
  const scaleFactor = width / 375;
  return Math.ceil(size * scaleFactor);
};

const getSafeAreaTop = () => (Platform.OS === "ios" ? 40 : 20);

const ContentNotAvailable = ({ onBack }) => (
  <View style={styles.emptyStateContainer}>
    <MaterialCommunityIcons
      name="text-box-remove-outline"
      size={responsiveFontSize(60)}
      color="#d3d3d3"
    />
    <Text style={styles.emptyStateTitle}>Content Not Available</Text>
    <Text style={styles.emptyStateText}>
      The article you're looking for doesn't exist or the link is invalid
    </Text>
    <TouchableOpacity
      style={styles.backButton}
      onPress={onBack}
    >
      <Text style={styles.backButtonText}>Go Back</Text>
    </TouchableOpacity>
  </View>
);

const ArticleScreen = () => {
  const router = useRouter();
  const { articleId } = useLocalSearchParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [similarArticles, setSimilarArticles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // Handle undefined/invalid articleId immediately
  if (!articleId || articleId === "undefined") {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require("../../assets/images/back-arrow.png")}
              style={styles.backArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Article Unavailable</Text>
          <View style={{ width: responsiveFontSize(24) }} />
        </View>
        <ContentNotAvailable onBack={() => router.back()} />
      </View>
    );
  }

  const fetchArticleAndSimilar = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the main article
      const response = await getArticleById(articleId);

      if (response.status === "success") {
        setArticle(response.data);

        // Fetch similar articles based on categories
        const similarResponse = await getRecommendedArticles(
          response.data.id,
          response.data.categories?.map(c => c.id) || []
        );

        if (similarResponse.status === "success") {
          setSimilarArticles(similarResponse.data);
        }

        // Check bookmarks
        const bookmarks = await AsyncStorage.getItem('bookmarks');
        const bookmarksArray = bookmarks ? JSON.parse(bookmarks) : [];
        setIsBookmarked(bookmarksArray.some(item => item.id === response.data.id));
      } else {
        throw new Error(response.message || "Failed to load article");
      }
    } catch (err) {
      console.error("Failed to fetch article:", err);
      setError(err.message || "Failed to load article");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchArticleAndSimilar();
  }, [articleId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchArticleAndSimilar();
  };

  const handleShare = async () => {
    if (!article) return;
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\n${article.content.substring(0, 200)}...`,
        url: article.header_image || `https://oziza.org/articles/${article.id}`,
      });
    } catch (error) {
      console.log("Error sharing:", error.message);
    }
  };

  const handleArticlePress = (articleId) => {
    navigation.navigate("articles/index", {
      articleId: articleId.toString()
    });
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
        bookmarksArray = bookmarksArray.filter(item => item.id !== article.id);
      } else {
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
          strong: { fontWeight: "bold", color: "#000000" },
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
          ul: { marginBottom: height * 0.03, paddingLeft: width * 0.05 },
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

  const renderSimilarArticleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.similarArticleItem}
      onPress={() => handleArticlePress(item.id)}
    >
      <Image
        source={{ uri: item.header_image || require("../../assets/images/placeholder-image.jpg") }}
        style={styles.similarArticleImage}
        defaultSource={require("../../assets/images/placeholder-image.jpg")}
      />
      <Text style={styles.similarArticleTitle} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
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

  if (error || !article) {
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
        <ContentNotAvailable onBack={() => router.back()} />
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
          <TouchableOpacity style={styles.actionIcon} onPress={toggleBookmark}>
            <MaterialIcons
              name={isBookmarked ? "bookmark" : "bookmark-border"}
              size={responsiveFontSize(20)}
              color="#000"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionIcon} onPress={toggleSpeech}>
            <MaterialIcons
              name={isSpeaking ? "volume-off" : "volume-up"}
              size={responsiveFontSize(20)}
              color="#000"
            />
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.actionIcon} onPress={handlePrint}>
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
          </TouchableOpacity> */}
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {article.header_image && (
          <Image
            source={{ uri: article.header_image }}
            style={styles.headerImage}
            defaultSource={require("../../assets/images/placeholder-image.jpg")}
          />
        )}

        {renderHtmlContent(article.content)}

        {article.categories?.length > 0 && (
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

        {/* Similar Articles Section */}
        {similarArticles.length > 0 && (
          <View style={styles.similarArticlesContainer}>
            <Text style={styles.similarArticlesTitle}>Similar Articles</Text>
            <FlatList
              data={similarArticles}
              renderItem={renderSimilarArticleItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarArticlesList}
            />
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
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.1,
  },
  emptyStateTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: '600',
    color: '#333',
    marginTop: height * 0.03,
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: responsiveFontSize(16),
    color: '#707070',
    textAlign: 'center',
    lineHeight: responsiveFontSize(24),
    marginBottom: height * 0.04,
  },
  backButton: {
    backgroundColor: '#000',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
  },
  similarArticlesContainer: {
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
  },
  similarArticlesTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: "700",
    marginBottom: height * 0.02,
    color: "#000000",
  },
  similarArticlesList: {
    paddingRight: width * 0.04,
  },
  similarArticleItem: {
    width: width * 0.4,
    marginRight: width * 0.04,
  },
  similarArticleImage: {
    width: "100%",
    height: width * 0.3,
    borderRadius: 8,
    marginBottom: height * 0.01,
  },
  similarArticleTitle: {
    fontSize: responsiveFontSize(14),
    fontWeight: "600",
    color: "#0C1549",
    textAlign: "left",
  },
});

export default ArticleScreen;