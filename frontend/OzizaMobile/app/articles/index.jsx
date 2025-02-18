import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { dataStore } from "../../utils/dataStore";

const ArticleScreen = ({ route }) => {
  const { articleId } = route.params;
  
  // Find the article by ID
  const article = dataStore.articles.find((a) => a.id === articleId);

  if (!article) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Article not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: article.image }} // Assuming you have an image property in your articles
        style={styles.image}
      />
      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.content}>{article.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ArticleScreen;
