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

export default function Discover() {
  const [newsBackgroundUrl, setNewsBackgroundUrl] = useState('');
  const [newsImageUrl, setNewsImageUrl] = useState('');
  const [visibleArticles, setVisibleArticles] = useState(4); // Show initial 4 articles
  const articlesPerPage = 4; // Number of articles to load per "Show More" click

  const topics = ['Technology', 'Health', 'Science', 'Business', 'Entertainment', 'Sports', 'Education', 'Politics', 'World News', 'Local News'];

  const allArticles = [
    { id: '1', category: 'Healthy Food', readTime: '5 min', title: 'The Benefits of Eating Healthy' },
    { id: '2', category: 'Fitness', readTime: '4 min', title: 'Top 10 Fitness Trends of 2023' },
    { id: '3', category: 'Technology', readTime: '6 min', title: 'The Future of AI in 2024' },
    { id: '4', category: 'Education', readTime: '3 min', title: 'How Online Learning is Changing the World' },
    { id: '5', category: 'Travel', readTime: '7 min', title: 'Exploring Hidden Gems in Europe' },
    { id: '6', category: 'Finance', readTime: '5 min', title: 'Investing in Cryptocurrency: A Beginner\'s Guide' },
    { id: '7', category: 'Fashion', readTime: '4 min', title: 'Sustainable Fashion Trends for 2024' },
    { id: '8', category: 'Music', readTime: '6 min', title: 'The Evolution of Pop Music' },
    { id: '9', category: 'Books', readTime: '3 min', title: 'Must-Read Novels of the Year' },
    { id: '10', category: 'Movies', readTime: '7 min', title: 'Top 10 Movies to Watch This Weekend' },
  ];

  const [trendingArticles, setTrendingArticles] = useState(allArticles.slice(0, visibleArticles));

  const getRandomImageUrl = (width, height, seed) => {
    return `https://picsum.photos/seed/${seed}/${Math.floor(width)}/${Math.floor(height)}`;
  };

  useEffect(() => {
    setNewsBackgroundUrl(getRandomImageUrl(SCREEN_WIDTH, SCREEN_HEIGHT * 0.3, 'news-bg-red'));
    setNewsImageUrl(getRandomImageUrl(normalize(200), normalize(200), 'news-room'));
  }, []);

  const handleShowMore = () => {
    setVisibleArticles((prevVisibleArticles) => {
      const newVisibleArticles = prevVisibleArticles + articlesPerPage;
      setTrendingArticles(allArticles.slice(0, newVisibleArticles)); // Update trendingArticles
      return newVisibleArticles;
    });
  };

  const limitedTopics = topics.slice(0, 8);

  const renderHeader = () => (
    <>
      {/* Search Box and Settings Icon */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBoxWrapper}>
          <Ionicons name="search" size={normalize(20)} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBox}
            placeholder="Search..."
            placeholderTextColor="#808080"
          />
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={normalize(24)} color="#000" />
        </TouchableOpacity>
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
            <View style={styles.newsTextContent}>
              <Text style={styles.newsHeading}>Latest News Heading</Text>
              <TouchableOpacity style={styles.readMoreButton}>
                <Text style={styles.readMoreText}>Read More</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: newsImageUrl }}
              style={styles.newsImage}
              resizeMode="cover"
            />
          </View>
        </ImageBackground>
      </View>

      {/* Topics */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.topicsContainer}
      >
        <View style={styles.topicsRow}>
          {limitedTopics.slice(0, 4).map((topic, index) => (
            <TouchableOpacity key={index} style={styles.topicButton}>
              <Text style={styles.topicText}>{topic}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.topicsRow}>
          {limitedTopics.slice(4).map((topic, index) => (
            <TouchableOpacity key={index + 4} style={styles.topicButton}>
              <Text style={styles.topicText}>{topic}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Trending Articles Header */}
      <View style={styles.trendingHeader}>
        <Text style={styles.sectionTitle}>Trending Articles</Text>
      </View>
    </>
  );

  const renderFooter = () => (
    visibleArticles < allArticles.length && (
      <TouchableOpacity style={styles.showMoreButton} onPress={handleShowMore}>
        <Text style={styles.showMoreText}>Show more</Text>
      </TouchableOpacity>
    )
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={trendingArticles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.articleContainer}>
            <View style={styles.articleContent}>
              <View style={styles.metadataContainer}>
                <Text style={styles.categoryText}>{item.category}</Text>
                <Text style={styles.readTimeText}> • {item.readTime}</Text>
              </View>
              <Text style={styles.articleTitle}>{item.title}</Text>
            </View>
            <Image
              source={{ uri: getRandomImageUrl(normalize(160), normalize(160), `article-${item.id}`) }}
              style={styles.articleImage}
              resizeMode="cover"
            />
          </View>
        )}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.container}
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
  },
  searchIcon: {
    marginRight: spacing.s,
  },
  searchBox: {
    flex: 1,
    height: '100%',
    fontSize: normalize(16),
  },
  settingsButton: {
    padding: spacing.s,
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
    marginRight: spacing.m,
  },
  newsHeading: {
    color: '#fff',
    fontSize: normalize(15),
    fontWeight: 600,
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
    flexDirection: 'column',
    marginBottom: spacing.m,
  },
  topicsRow: {
    flexDirection: 'row',
  },
  topicButton: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    borderWidth: 1.2,
    borderColor: '#000',
    borderRadius: normalize(20),
    marginRight: spacing.s,
    marginBottom: spacing.s,
  },
  topicText: {
    fontSize: normalize(14),
    color: '#000',
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
  },
  readTimeText: {
    color: '#666',
    fontSize: normalize(13),
  },
  articleTitle: {
    fontSize: normalize(15),
    fontWeight: '500',
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
  },
  showMoreText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: normalize(14),
  },
});