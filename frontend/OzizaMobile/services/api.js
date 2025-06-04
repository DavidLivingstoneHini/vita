import * as SecureStore from "expo-secure-store";

const API_BASE_URL = "https://www.ozizabackapp.in/api/";

// Token refresh management
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

/**
 * Decodes a JWT token
 * @param {string} token - JWT token
 * @returns {object|null} Decoded payload or null if invalid
 */
const decodeToken = (token) => {
  try {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Checks if the access token is expired or about to expire
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired or will expire soon
 */
const isTokenExpired = (token) => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;

  const now = Date.now() / 1000;
  // Consider token expired if it has less than 1 day remaining
  return payload.exp < now + 86400;
};

/**
 * Refreshes the access token using the refresh token
 * @returns {Promise<string|null>} New access token or null if refresh fails
 */
const refreshTokens = async () => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh(resolve);
    });
  }

  try {
    isRefreshing = true;
    const refreshToken = await SecureStore.getItemAsync("refresh_token");

    if (!refreshToken) {
      console.log("No refresh token available");
      throw new Error("No refresh token available");
    }

    // Check if refresh token is expired
    const refreshPayload = decodeToken(refreshToken);
    if (!refreshPayload || !refreshPayload.exp || refreshPayload.exp < Date.now() / 1000) {
      await clearTokens();
      throw new Error("Refresh token expired. Please login again.");
    }

    const response = await fetch(
      `${API_BASE_URL}v1/users/token/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      }
    );

    if (!response.ok) {
      // If refresh token is invalid/expired, clear all tokens
      if (response.status === 401) {
        await clearTokens();
        throw new Error("Refresh token expired. Please login again.");
      }
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    await SecureStore.setItemAsync("access_token", data.access);
    // Only update refresh token if a new one was provided
    if (data.refresh) {
      await SecureStore.setItemAsync("refresh_token", data.refresh);
    }

    // Get user data if included in response
    if (data.user) {
      await SecureStore.setItemAsync("user_data", JSON.stringify(data.user));
    }

    onRefreshed(data.access);
    return data.access;
  } catch (error) {
    console.error("Token refresh error:", error);
    await clearTokens();
    throw error;
  } finally {
    isRefreshing = false;
  }
};

/**
 * Clears both access and refresh tokens
 */
const clearTokens = async () => {
  await SecureStore.deleteItemAsync("access_token");
  await SecureStore.deleteItemAsync("refresh_token");
  await SecureStore.deleteItemAsync("user_data");
};

/**
 * Main API request function with automatic token refresh
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<any>} API response
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  let token = await SecureStore.getItemAsync('access_token');

  // Check if token is expired or about to expire
  if (token && isTokenExpired(token)) {
    try {
      token = await refreshTokens();
    } catch (error) {
      // If refresh fails, clear tokens and throw error
      await clearTokens();
      throw new Error("Session expired. Please login again.");
    }
  }

  try {
    // Initial request
    let response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    });

    // If unauthorized, try refreshing token once
    if (response.status === 401) {
      try {
        const newToken = await refreshTokens();
        // Retry with new token
        response = await fetch(url, {
          ...options,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newToken}`,
            ...options.headers,
          },
        });
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        throw new Error("Session expired. Please login again.");
      }
    }

    // Handle response
    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      const errorData = contentType?.includes('application/json')
        ? await response.json()
        : { message: await response.text() };
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return contentType?.includes('application/json')
      ? await response.json()
      : await response.text();
  } catch (error) {
    console.error(`API request to ${url} failed:`, error);
    throw error;
  }
};

/**
 * Validates the current token on app startup
 * @returns {Promise<boolean>} Whether the token is valid
 */
export const validateTokenOnStartup = async () => {
  try {
    const token = await SecureStore.getItemAsync('access_token');
    if (!token) return false;

    // Check if token is expired
    if (isTokenExpired(token)) {
      try {
        await refreshTokens();
        return true;
      } catch {
        return false;
      }
    }

    // Simple validation request
    await apiRequest('auth/user/');
    return true;
  } catch (error) {
    console.log("Token validation failed:", error);
    await clearTokens();
    return false;
  }
};

// Symptom Checker API Functions

/**
 * Fetches symptoms with optional search query
 * @param {string} searchQuery - Search term for symptoms
 * @returns {Promise<Array>} List of symptoms
 */
export const getSymptoms = async (searchQuery = '') => {
  try {
    const endpoint = `symptoms/search/?q=${encodeURIComponent(searchQuery.trim())}`;
    const response = await apiRequest(endpoint);

    if (!response) {
      throw new Error('Empty response from server');
    }

    const data = response.status === 'success' ? response.data : response;

    if (!Array.isArray(data)) {
      throw new Error('Invalid response format - expected array');
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const sortedResults = [...data].sort((a, b) => {
      const aExact = a.name.toLowerCase() === lowerCaseQuery;
      const bExact = b.name.toLowerCase() === lowerCaseQuery;

      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return 0;
    });

    return sortedResults;
  } catch (error) {
    console.error('Error fetching symptoms:', error);
    throw error;
  }
};

/**
 * Submits symptoms for diagnosis
 * @param {Array<number>} symptoms - Array of symptom IDs
 * @returns {Promise<object>} Diagnosis results
 */
export const submitSymptoms = async (symptoms) => {
  try {
    const symptomIds = symptoms.map(id => {
      const num = Number(id);
      if (isNaN(num)) throw new Error(`Invalid symptom ID: ${id}`);
      return num;
    });

    const response = await apiRequest('diagnose/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms: symptomIds }),
    });

    // Add validation
    if (!response) throw new Error('No response received from server');

    let diseases = response.data?.potential_diseases || response.potential_diseases || [];

    // Basic validation of disease objects
    if (!Array.isArray(diseases)) {
      throw new Error('Invalid diseases format - expected array');
    }

    // Ensure each disease has required fields
    diseases = diseases.filter(d => d?.disease?.id && d?.disease?.name);

    return { data: { potential_diseases: diseases } };

    // // Handle error response
    // if (response.error) {
    //   throw new Error(response.error || 'Invalid response structure');
    // }

    // // Handle different response structures
    // if (response.potential_diseases) {
    //   return { data: { potential_diseases: response.potential_diseases } };
    // }

    // if (response.data?.potential_diseases) {
    //   return response;
    // }

    // throw new Error('Invalid response structure from diagnosis API');
  } catch (error) {
    console.error('API Error:', { error: error.message, symptoms });
    throw error;
  }
};

/**
 * Gets details for a specific disease
 * @param {number} diseaseId - ID of the disease
 * @returns {Promise<object>} Disease details
 */
export const getDiseaseDetails = async (diseaseId) => {
  try {
    return await apiRequest(`diseases/${diseaseId}/`);
  } catch (error) {
    console.error('Error fetching disease details:', error);
    throw error;
  }
};

// Recommendation APIs

/**
 * Gets article by ID
 * @param {number} articleId - ID of the article
 * @returns {Promise<object>} Article details
 */
export const getArticleById = async (articleId) => {
  try {
    return await apiRequest(`articles/${articleId}/`);
  } catch (error) {
    console.error(`Error fetching article ${articleId}:`, error);
    throw error;
  }
};

/**
 * Gets recommended articles
 * @returns {Promise<Array>} List of recommended articles
 */
export const getRecommendedArticles = async () => {
  try {
    return await apiRequest('recommended/');
  } catch (error) {
    console.error('Error fetching recommended articles:', error);
    throw error;
  }
};

// User Authentication APIs

/**
 * Logs in a user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<object>} User data and tokens
 */
export const loginUser = async (email, password) => {
  try {
    const response = await apiRequest('auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    await SecureStore.setItemAsync("access_token", response.access);
    await SecureStore.setItemAsync("refresh_token", response.refresh);

    if (response.user) {
      await SecureStore.setItemAsync("user_data", JSON.stringify(response.user));
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logs out the current user
 */
export const logoutUser = async () => {
  try {
    await clearTokens();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Gets current user profile
 * @returns {Promise<object>} User profile data
 */
export const getCurrentUser = async () => {
  try {
    // First try to get from SecureStore
    const userData = await SecureStore.getItemAsync("user_data");
    if (userData) {
      return JSON.parse(userData);
    }

    // Fallback to API request
    return await apiRequest('auth/user/');
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export default {
  apiRequest,
  refreshTokens,
  validateTokenOnStartup,
  clearTokens,

  // Symptom Checker
  getSymptoms,
  submitSymptoms,
  getDiseaseDetails,

  // Articles
  getArticleById,
  getRecommendedArticles,

  // Auth
  loginUser,
  logoutUser,
  getCurrentUser,
};