import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  Dimensions,
  Platform,
  PixelRatio,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getRecommendedArticles } from "../../services/api";

// Dummy data for buttons with health-related titles
const buttonsData = [
  { id: 0, text: "For You" },
  { id: 1, text: "Nutrition" },
  { id: 2, text: "Fitness" },
  { id: 3, text: "Mental Health" },
  { id: 4, text: "Chronic Diseases" },
  { id: 5, text: "Preventive Care" },
  { id: 6, text: "Women's Health" },
  { id: 7, text: "Men's Health" },
  { id: 8, text: "Children's Health" },
  { id: 9, text: "Elderly Care" },
  { id: 10, text: "Health Tech" },
  { id: 12, text: "Public Health" },
  { id: 13, text: "Health Policy" },
  { id: 15, text: "Pandemics" },
  { id: 16, text: "Vaccines" },
  { id: 17, text: "Health Education" },
  { id: 18, text: "Health Innovations" },
  { id: 19, text: "Health Disparities" },
  { id: 20, text: "Health Equity" },
];

// Normalize font size across different screen sizes
const normalizeFont = (size) => {
  const scale = Dimensions.get('window').width / 375; // 375 is standard iPhone width
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Get dynamic dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const vw = screenWidth / 100;
const vh = screenHeight / 100;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const HEADER_HEIGHT = Platform.OS === 'ios' ? vh * 5.5 : vh * 7;

const News = () => {
  const [selectedButton, setSelectedButton] = useState(buttonsData[0]);
  const [refreshing, setRefreshing] = useState(false);
  const [dimensions, setDimensions] = useState({ screenWidth, screenHeight });
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendedArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRecommendedArticles();
      if (response.status === "success") {
        setRecommendedArticles(response.data);
      } else {
        throw new Error(response.message || "Failed to load recommendations");
      }
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
      setError(err.message || "Failed to load recommendations");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendedArticles();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecommendedArticles();
  };

  const renderContent = () => {
    if (selectedButton.id === 0) {
      return (
        <ForYouContent
          selectedButton={selectedButton}
          articles={recommendedArticles}
          loading={loading}
          error={error}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      );
    } else {
      return (
        <View style={styles.categoryContent}>
          <Text style={styles.categoryTitle}>Coming Soon</Text>
          <Text style={styles.categoryText}>
            {selectedButton.text} content will be available soon
          </Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={[styles.title, { fontSize: normalizeFont(18) }]}>
              News
            </Text>
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={[styles.buttonsContainer, { height: vh * 20 }]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.multiRowScrollView}
            >
              <View style={styles.buttonRowsContainer}>
                {Array.from({ length: 3 }, (_, rowIndex) => (
                  <View key={rowIndex} style={styles.buttonRow}>
                    {buttonsData
                      .slice(rowIndex * 7, (rowIndex + 1) * 7)
                      .map((button) => (
                        <TouchableOpacity
                          key={button.id}
                          style={[
                            styles.smallButton,
                            selectedButton.id === button.id && styles.selectedSmallButton,
                            { minWidth: vw * 20 },
                          ]}
                          onPress={() => setSelectedButton(button)}
                        >
                          <Text
                            style={[
                              styles.smallButtonText,
                              selectedButton.id === button.id && { color: "#fff" },
                              { fontSize: normalizeFont(12) },
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {button.text}
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
          <View style={styles.contentContainer}>{renderContent()}</View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const ForYouContent = ({
  selectedButton,
  articles,
  loading,
  error,
  onRefresh,
  refreshing
}) => {
  const navigation = useNavigation();

  const handleArticlePress = (articleId) => {
    navigation.navigate("articles/index", {
      articleId: articleId.toString()
    });
  };

  if (loading && !refreshing) {
    return (
      <View style={forYouStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#1C3612" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={forYouStyles.errorContainer}>
        <Text style={forYouStyles.errorText}>{error}</Text>
        <TouchableOpacity
          style={forYouStyles.retryButton}
          onPress={onRefresh}
        >
          <Text style={forYouStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={forYouStyles.forYouContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {articles.length > 0 ? (
        <>
          <View style={forYouStyles.editorsPickContainer}>
            <Text style={[forYouStyles.editorsPickTitle, { fontSize: normalizeFont(20) }]}>
              Editor's Pick
            </Text>
            <TouchableOpacity
              onPress={() => handleArticlePress(articles[0].id)}
            >
              <Image
                source={{ uri: articles[0].header_image || articles[0].image || 'https://via.placeholder.com/300x200?text=No+Image' }}
                style={[forYouStyles.editorsPickImage, { height: vh * 25 }]}
                resizeMode="cover"
              />
              <Text style={[forYouStyles.descriptionTitle, { fontSize: normalizeFont(14) }]}>
                {articles[0].title}
              </Text>
              <Text
                style={[forYouStyles.forYouText, { fontSize: normalizeFont(13) }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {articles[0].summary || "Read more about this article"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={forYouStyles.listTitleContainer}>
            <Text style={[forYouStyles.listTitle, { fontSize: normalizeFont(18) }]}>
              {selectedButton.text}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Library")}>
              <Text style={[forYouStyles.seeAll, { fontSize: normalizeFont(12) }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {articles.slice(1).map((article) => (
            <TouchableOpacity
              key={article.id}
              style={forYouStyles.forYouItem}
              onPress={() => handleArticlePress(article.id)}
            >
              <Image
                source={{ uri: article.header_image || 'https://via.placeholder.com/300x200?text=No+Image' }}
                style={[forYouStyles.forYouImage, { height: vh * 20 }]}
                resizeMode="cover"
              />
              <Text style={[forYouStyles.descriptionTitle, { fontSize: normalizeFont(14) }]}>
                {article.title}
              </Text>
              <Text
                style={[forYouStyles.forYouText, { fontSize: normalizeFont(13) }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {article.summary || "Read more about this article"}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      ) : (
        <View style={forYouStyles.emptyContainer}>
          <Text style={forYouStyles.emptyText}>No recommendations available</Text>
          <TouchableOpacity
            style={forYouStyles.retryButton}
            onPress={onRefresh}
          >
            <Text style={forYouStyles.retryButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : 0,
  },
  header: {
    height: HEADER_HEIGHT,
    paddingHorizontal: vw * 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: '700',
  },
  buttonsContainer: {
    paddingVertical: vh * 1.5,
    paddingHorizontal: vw * 4,
    marginBottom: vh * 1,
  },
  buttonRowsContainer: {
    flexDirection: "column",
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: vh * 1,
  },
  multiRowScrollView: {
    width: "100%",
  },
  smallButton: {
    marginRight: vw * 2,
    marginBottom: vh * 1,
    paddingHorizontal: vw * 4,
    paddingVertical: vh * 1,
    borderRadius: 8,
    backgroundColor: "#828282",
  },
  selectedSmallButton: {
    backgroundColor: "#1C3612",
  },
  smallButtonText: {
    color: "#FFFFFF",
  },
  contentContainer: {
    flex: 1,
    padding: vw * 4,
  },
  categoryContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  categoryTitle: {
    fontSize: normalizeFont(20),
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1C3612',
  },
  categoryText: {
    fontSize: normalizeFont(16),
    textAlign: 'center',
    color: '#555',
  },
});

const forYouStyles = StyleSheet.create({
  forYouContainer: {
    flex: 1,
  },
  editorsPickContainer: {
    marginBottom: vh * 4,
    marginTop: vh * 0.5,
  },
  editorsPickTitle: {
    fontWeight: "bold",
    marginBottom: vh * 1.5,
  },
  editorsPickImage: {
    width: "100%",
    borderRadius: 8,
  },
  forYouItem: {
    marginBottom: vh * 2,
  },
  forYouImage: {
    width: "100%",
    borderRadius: 8,
  },
  descriptionTitle: {
    fontWeight: '800',
    marginTop: vh * 1,
    color: "#000000",
  },
  forYouText: {
    marginTop: vh * 0.4,
    color: '#555',
  },
  listTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vh * 1.5,
  },
  listTitle: {
    fontWeight: "bold",
  },
  seeAll: {
    color: "#000000",
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: normalizeFont(16),
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#1C3612',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: normalizeFont(14),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: normalizeFont(16),
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default News;