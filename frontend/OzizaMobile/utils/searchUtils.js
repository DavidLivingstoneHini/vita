import { dataStore } from "./dataStore";

export const search = (query) => {
  const results = [];
  const lowerCaseQuery = query.toLowerCase();

  // Search articles
  dataStore.articles.forEach((article) => {
    if (article.title.toLowerCase().includes(lowerCaseQuery) || article.content.toLowerCase().includes(lowerCaseQuery)) {
      results.push({
        title: article.title,
        screen: article.screen,
        params: article.params,
      });
    }
  });

  // Search health conditions
  dataStore.healthConditions.forEach((condition) => {
    if (condition.title.toLowerCase().includes(lowerCaseQuery) || condition.description.toLowerCase().includes(lowerCaseQuery)) {
      results.push({
        title: condition.title,
        screen: condition.screen,
        params: condition.params,
      });
    }
  });

  return results;
};
