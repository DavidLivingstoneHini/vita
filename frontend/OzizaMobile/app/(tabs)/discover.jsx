import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  PixelRatio,
  Platform,
  ActivityIndicator,
  Linking,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Scale factors for different screen sizes
const scale = SCREEN_WIDTH / 375; // Based on iPhone X width
const verticalScale = SCREEN_HEIGHT / 812; // Based on iPhone X height

// Normalize font size and dimensions across different devices
const normalize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

// Responsive spacing
const spacing = {
  xs: normalize(4),
  s: normalize(8),
  m: normalize(16),
  l: normalize(24),
  xl: normalize(32),
  xxl: normalize(40),
};

// API configuration
const API_KEY = '21cd8ba8ef5047319e95e3993edd1b17';
const HEALTH_SOURCES = 'medical-news-today,healthline';

// Fallback health-related image URLs
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352', // Healthy food
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b', // Yoga
  'https://images.unsplash.com/photo-1538805060514-97d9cc17730c', // Running
  'https://images.unsplash.com/photo-1518611012118-696072aa579a', // Meditation
  'https://images.unsplash.com/photo-1535914254981-b5012eebbd15', // Doctor
  'https://images.unsplash.com/photo-1545205597-3d9d02c29597', // Gym
  'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d', // Vegetables
  'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe', // Sleep
];

export default function Discover() {
  const [newsBackgroundUrl, setNewsBackgroundUrl] = useState('');
  const [newsImageUrl, setNewsImageUrl] = useState('');
  const [visibleArticles, setVisibleArticles] = useState(4);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const articlesPerPage = 4;

  const categories = [
    'All',
    'Nutrition',
    'Fitness',
    'Mental Health',
    'Sleep',
    'Healthy Recipes',
    'Exercise',
    'Wellness',
    'Preventative Care',
    'Cardio',
    'Strength Training',
  ];

  const [allArticles, setAllArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);

  // Get a fallback health image
  const getFallbackImage = (index) => {
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  };

  // Fetch health articles from NewsAPI
  const fetchHealthArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://newsapi.org/v2/everything?sources=${HEALTH_SOURCES}&apiKey=${API_KEY}&pageSize=20`
      );
      const data = await response.json();

      if (data.articles) {
        // Transform API data to match our structure
        const formattedArticles = data.articles.map((article, index) => ({
          id: `${index}`,
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage || getFallbackImage(index),
          publishedAt: new Date(article.publishedAt).toLocaleDateString(),
          category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1] || 'Wellness',
          readTime: `${Math.floor(Math.random() * 7) + 3} min`,
          content: article.content,
        }));

        setAllArticles(formattedArticles);
        setFilteredArticles(formattedArticles);
        setLoading(false);

        // Set featured images from first two articles
        if (data.articles.length > 0) {
          setNewsBackgroundUrl(data.articles[0].urlToImage || getFallbackImage(0));
          setNewsImageUrl(data.articles[1]?.urlToImage || getFallbackImage(1));
        }
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load health articles. Please try again later.');
      setLoading(false);

      // Fallback to mock data if API fails
      const mockArticles = generateMockArticles();
      setAllArticles(mockArticles);
      setFilteredArticles(mockArticles);
      setNewsBackgroundUrl(getFallbackImage(0));
      setNewsImageUrl(getFallbackImage(1));
    }
  };

  // Generate mock articles for fallback
  const generateMockArticles = () => {
    return Array.from({ length: 13 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Health Article ${i + 1}`,
      description: `This is a sample health article about ${categories[i % categories.length]}`,
      url: 'https://example.com',
      urlToImage: getFallbackImage(i),
      publishedAt: new Date().toLocaleDateString(),
      category: categories[(i % (categories.length - 1)) + 1] || 'Wellness',
      readTime: `${Math.floor(Math.random() * 7) + 3} min`,
      content: `This is the full content of health article ${i + 1}. In a real app, this would be fetched from the API.`,
    }));
  };

  // Filter articles by category
  const filterArticles = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredArticles(allArticles);
    } else {
      const filtered = allArticles.filter(article => article.category === category);
      setFilteredArticles(filtered);
    }
    setVisibleArticles(articlesPerPage);
    Keyboard.dismiss(); // Dismiss keyboard when filtering
  };

  // Filter articles by search query
  const searchArticles = (query) => {
    setSearchQuery(query);
    if (query === '') {
      filterArticles(selectedCategory);
    } else {
      const filtered = allArticles.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  };

  // Open article in browser
  const openArticle = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  // Load more articles
  const handleShowMore = () => {
    setVisibleArticles(prev => prev + articlesPerPage);
  };

  useEffect(() => {
    fetchHealthArticles();
  }, []);

  const renderHeader = () => (
    <>
      {/* Search Box */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBoxWrapper}>
          <Ionicons name="search" size={normalize(20)} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBox}
            placeholder="Search health topics..."
            placeholderTextColor="#808080"
            value={searchQuery}
            onChangeText={searchArticles}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
        </View>
      </View>

      {/* News Section */}
      <View style={styles.newsSection}>
        <ImageBackground
          source={{ uri: newsBackgroundUrl }}
          style={styles.newsBackground}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          <View style={styles.newsContent}>
            <Image
              source={{ uri: newsImageUrl }}
              style={styles.newsImage}
              resizeMode="cover"
            />
            <View style={styles.newsTextContent}>
              <Text style={styles.newsHeading}>Stay Informed on Health and Wellness</Text>
              <TouchableOpacity
                style={styles.readMoreButton}
                onPress={() => openArticle('https://www.healthline.com')}
              >
                <Text style={styles.readMoreText}>Learn More</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.topicsContainer}
        contentContainerStyle={styles.topicsContentContainer}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.topicButton,
              selectedCategory === category && styles.selectedTopicButton
            ]}
            onPress={() => filterArticles(category)}
          >
            <Text style={[
              styles.topicText,
              selectedCategory === category && styles.selectedTopicText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Trending Articles Header */}
      <View style={styles.trendingHeader}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'All' ? 'Trending Health Articles' : `${selectedCategory} Articles`}
        </Text>
      </View>
    </>
  );

  const renderArticleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.articleContainer}
      onPress={() => openArticle(item.url)}
    >
      <View style={styles.articleContent}>
        <View style={styles.metadataContainer}>
          <Text style={styles.categoryText}>{item.category}</Text>
          <Text style={styles.readTimeText}> • {item.readTime}</Text>
        </View>
        <Text style={styles.articleTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.articleDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
      <Image
        source={{ uri: item.urlToImage }}
        style={styles.articleImage}
        resizeMode="cover"
        defaultSource={require('../../assets/images/placeholder-image.jpg')} // Add a placeholder image in your assets
      />
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#000" style={styles.loadingIndicator} />;
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (filteredArticles.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No articles found for this category.</Text>
        </View>
      );
    }

    if (visibleArticles < filteredArticles.length) {
      return (
        <TouchableOpacity style={styles.showMoreButton} onPress={handleShowMore}>
          <Text style={styles.showMoreText}>Show more</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filteredArticles.slice(0, visibleArticles)}
        keyExtractor={(item) => item.id}
        renderItem={renderArticleItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.container}
        refreshing={loading}
        onRefresh={fetchHealthArticles}
        keyboardShouldPersistTaps="always" // This fixes the keyboard issue
        keyboardDismissMode="on-drag"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.s,
    paddingBottom: spacing.m,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
    gap: spacing.s,
  },
  searchBoxWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: normalize(8),
    paddingHorizontal: spacing.m,
    height: normalize(44),
    backgroundColor: '#f5f5f5',
  },
  searchIcon: {
    marginRight: spacing.s,
  },
  searchBox: {
    flex: 1,
    height: '100%',
    fontSize: normalize(16),
  },
  newsSection: {
    height: SCREEN_HEIGHT * 0.25,
    marginBottom: spacing.m,
    borderRadius: normalize(12),
    overflow: 'hidden',
  },
  newsBackground: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  newsContent: {
    flex: 1,
    flexDirection: 'row',
    padding: spacing.m,
    alignItems: 'center',
  },
  newsTextContent: {
    flex: 1,
    marginLeft: spacing.m,
  },
  newsHeading: {
    color: '#fff',
    fontSize: normalize(15),
    fontWeight: '600',
    marginBottom: spacing.s,
  },
  newsImage: {
    width: normalize(120),
    height: normalize(170),
    borderWidth: 1.5,
    borderColor: "#fff",
    borderRadius: normalize(4),
  },
  readMoreButton: {
    backgroundColor: '#000',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: '#fff',
    fontSize: normalize(14),
    fontWeight: '500',
  },
  topicsContainer: {
    marginBottom: spacing.m,
  },
  topicsContentContainer: {
    flexDirection: 'row',
    paddingRight: spacing.m,
  },
  topicButton: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    borderWidth: 1.2,
    borderColor: '#ddd',
    borderRadius: normalize(20),
    marginRight: spacing.s,
    marginBottom: spacing.s,
    backgroundColor: '#f5f5f5',
  },
  selectedTopicButton: {
    borderColor: '#000',
    backgroundColor: '#000',
  },
  topicText: {
    fontSize: normalize(14),
    color: '#000',
  },
  selectedTopicText: {
    color: '#fff',
  },
  trendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.m,
    marginBottom: spacing.s,
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  articleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
    padding: spacing.s,
    backgroundColor: '#f9f9f9',
    borderRadius: normalize(8),
  },
  articleContent: {
    flex: 1,
    marginRight: spacing.s,
  },
  metadataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryText: {
    fontWeight: '600',
    fontSize: normalize(13),
    color: '#333',
  },
  readTimeText: {
    color: '#666',
    fontSize: normalize(13),
  },
  articleTitle: {
    fontSize: normalize(15),
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  articleDescription: {
    fontSize: normalize(13),
    color: '#666',
    lineHeight: normalize(18),
  },
  articleImage: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: normalize(8),
  },
  showMoreButton: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: normalize(8),
    marginTop: spacing.s,
  },
  showMoreText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: normalize(14),
  },
  loadingIndicator: {
    marginVertical: spacing.l,
  },
  errorContainer: {
    padding: spacing.m,
    backgroundColor: '#ffeeee',
    borderRadius: normalize(8),
    marginTop: spacing.s,
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
  },
  emptyContainer: {
    padding: spacing.m,
    backgroundColor: '#f5f5f5',
    borderRadius: normalize(8),
    marginTop: spacing.s,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
  },
});