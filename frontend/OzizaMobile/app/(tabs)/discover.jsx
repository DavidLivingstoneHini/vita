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

  const topics = ['Technology', 'Health', 'Science', 'Business', 'Entertainment', 'Sports', 'Education'];

  const trendingArticles = [
    { id: '1', category: 'Healthy Food', readTime: '5 min', title: 'The Benefits of Eating Healthy' },
    { id: '2', category: 'Fitness', readTime: '4 min', title: 'Top 10 Fitness Trends of 2023' },
    { id: '3', category: 'Technology', readTime: '6 min', title: 'The Future of AI in 2024' },
    { id: '4', category: 'Education', readTime: '3 min', title: 'How Online Learning is Changing the World' },
  ];

  const getRandomImageUrl = (width, height, seed) => {
    return `https://picsum.photos/seed/${seed}/${Math.floor(width)}/${Math.floor(height)}`;
  };

  useEffect(() => {
    setNewsBackgroundUrl(getRandomImageUrl(SCREEN_WIDTH, SCREEN_HEIGHT * 0.3, 'news-bg'));
    setNewsImageUrl(getRandomImageUrl(normalize(200), normalize(200), 'news-side'));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Search Box and Settings Icon */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBoxWrapper}>
            <Ionicons name="search" size={normalize(20)} color="#666" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchBox} 
              placeholder="Search..."
              placeholderTextColor="#666"
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
          style={styles.topicsContainer}
          showsHorizontalScrollIndicator={false}
        >
          {topics.map((topic, index) => (
            <TouchableOpacity key={index} style={styles.topicButton}>
              <Text style={styles.topicText}>{topic}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending Articles */}
        <View style={styles.trendingSection}>
          <View style={styles.trendingHeader}>
            <Text style={styles.sectionTitle}>Trending Articles</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>See More</Text>
            </TouchableOpacity>
          </View>
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
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
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
    fontSize: normalize(24),
    fontWeight: 'bold',
    marginBottom: spacing.s,
  },
  newsImage: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: normalize(8),
  },
  readMoreButton: {
    backgroundColor: '#000',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    borderRadius: normalize(6),
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
  topicButton: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    backgroundColor: '#f0f0f0',
    borderRadius: normalize(20),
    marginRight: spacing.s,
  },
  topicText: {
    fontSize: normalize(14),
    color: '#000',
  },
  trendingSection: {
    flex: 1,
  },
  trendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  sectionTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
  },
  seeMoreText: {
    color: '#666',
    fontSize: normalize(14),
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
    fontWeight: 'bold',
    fontSize: normalize(14),
  },
  readTimeText: {
    color: '#666',
    fontSize: normalize(14),
  },
  articleTitle: {
    fontSize: normalize(16),
    fontWeight: '500',
  },
  articleImage: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: normalize(8),
  },
});