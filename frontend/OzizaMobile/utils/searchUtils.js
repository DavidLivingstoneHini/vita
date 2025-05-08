import api from "../services/api";

export const search = async (query) => {
  try {
    const lowerCaseQuery = query.toLowerCase().trim();
    if (!lowerCaseQuery) return [];

    const response = await api.apiRequest(`articles/search/?search=${encodeURIComponent(lowerCaseQuery)}`);

    // Handle different response structures
    if (!response) {
      throw new Error('Empty response from server');
    }

    // Check for success status or direct data array
    const data = response.status === 'success' ? response.data : response;

    if (!Array.isArray(data)) {
      throw new Error('Invalid response format - expected array');
    }

    return data.map(article => ({
      id: article.id,
      title: article.title,
      type: 'article',
      screen: "articles",
      params: { articleId: article.id }
    }));

  } catch (error) {
    console.error("Search error:", error.message, error.response?.data);
    return [];
  }
};