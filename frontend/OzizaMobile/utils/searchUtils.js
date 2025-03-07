import { dataStore } from "./dataStore";

export const search = (query) => {
  const results = [];
  const lowerCaseQuery = query.toLowerCase();

  // Search articles
  dataStore.articles.forEach((article) => {
    if (article.title.toLowerCase().includes(lowerCaseQuery) ||
      article.content.toLowerCase().includes(lowerCaseQuery)) {
      results.push({
        title: article.title,
        // Fixed screen name format for Expo Router navigation
        screen: "articles",
        params: {
          articleId: article.id
        },
      });
    }
  });

  // Search health conditions
  dataStore.healthConditions.forEach((condition) => {
    if (condition.title.toLowerCase().includes(lowerCaseQuery) ||
      condition.description.toLowerCase().includes(lowerCaseQuery)) {
      results.push({
        title: condition.title,
        screen: condition.screen || "articles", // Provide fallback if screen is not defined
        params: condition.params || { articleId: condition.id },
      });
    }
  });

  return results;
};