import ArticleScreen from "../app/articles";

export const dataStore = {
  articles: [
    {
      id: 1,
      title: "Diabetes 101",
      content: "Learn about diabetes, its symptoms, and management.",
      image: "https://example.com/image1.jpg", // Replace with actual image URL
      screen: "articles/index",
      params: { articleId: 1 },
    },
    {
      id: 2,
      title: "Healthy Eating",
      content: "Discover the principles of healthy eating.",
      image: "https://example.com/image2.jpg", // Replace with actual image URL
      screen: "articles/index",
      params: { articleId: 2 },
    },
    // Add more articles as needed
  ],
  healthConditions: [
    {
      id: 1,
      title: "Skin Bleaching",
      description: "...",
      screen: "HealthConditionScreen",
      params: { conditionId: 1 },
    },
    {
      id: 2,
      title: "Hypertension",
      description: "...",
      screen: "HealthConditionScreen",
      params: { conditionId: 2 },
    },
    // Add more health conditions as needed
  ],
};
