import ArticleScreen from "../app/articles";
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
        // Change the screen name to match your navigation setup
        screen: "articles/index",
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
        screen: condition.screen,
        params: condition.params,
      });
    }
  });

  return results;
};