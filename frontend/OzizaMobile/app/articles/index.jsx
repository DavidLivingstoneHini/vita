import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform, Share } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Feather } from "@expo/vector-icons";
import { dataStore } from "../../utils/dataStore";

const { width, height } = Dimensions.get('window');

// Responsive font sizing
const responsiveFontSize = (size) => {
  const scaleFactor = width / 375;
  const newSize = size * scaleFactor;
  return Math.ceil(newSize);
};

// Get safe area padding for different platforms
const getSafeAreaTop = () => {
  if (Platform.OS === 'ios') {
    return 40;
  }
  return 20;
};

const ArticleScreen = () => {
  const router = useRouter();
  const { articleId } = useLocalSearchParams(); // Extract articleId from query params
  const parsedArticleId = articleId ? parseInt(articleId, 10) : null; // Parse articleId to a number
  const article = dataStore.articles.find((a) => a.id === parsedArticleId); // Find the article

  if (!article) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/home")}>
            <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Articles</Text>
          <View style={{ width: responsiveFontSize(24) }} />
        </View>
        <Text style={styles.errorText}>Article not found</Text>
      </View>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this article: ${article.title}\n\n${article.content}`,
        url: article.image,
      });
    } catch (error) {
      console.log("Error sharing:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={responsiveFontSize(24)} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
          {article.title}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionIcon}>
            <Feather name="download" size={responsiveFontSize(20)} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIcon} onPress={handleShare}>
            <Feather name="share-2" size={responsiveFontSize(20)} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Image source={article.image} style={styles.image} />
        <Text style={styles.titleQuestion}>What is {article.title}?</Text>
        <Text style={styles.content}>{article.content}</Text>

        {article.sections && article.sections.map((section, index) => (
          <View key={index}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionText}>{section.content}</Text>
          </View>
        ))}
        <View style={{ height: height * 0.05 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: getSafeAreaTop(),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: width * 0.02,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
    width: '100%',
    height: height * 0.25,
    borderRadius: 8,
    marginTop: height * 0.02,
  },
  titleQuestion: {
    fontSize: responsiveFontSize(20),
    fontWeight: '700',
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
  },
  content: {
    fontSize: responsiveFontSize(16),
    lineHeight: responsiveFontSize(24),
    color: '#333',
    marginBottom: height * 0.02,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
  },
  sectionText: {
    fontSize: responsiveFontSize(16),
    lineHeight: responsiveFontSize(24),
    color: '#333',
    marginBottom: height * 0.02,
  },
  errorText: {
    fontSize: responsiveFontSize(18),
    color: "red",
    textAlign: "center",
    marginTop: height * 0.2,
  },
});

export default ArticleScreen;