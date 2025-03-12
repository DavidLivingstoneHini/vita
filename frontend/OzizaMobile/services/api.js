import * as SecureStore from "expo-secure-store";

// Function to refresh access token using the refresh token
const refreshTokens = async () => {
  try {
    const refreshToken = await SecureStore.getItemAsync("refresh_token");
    const response = await fetch(
      "https://djbackend-9d8q.onrender.com/api/v1/users/token/refresh/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Save new tokens in SecureStore
    await SecureStore.setItemAsync("access_token", data.access);
    await SecureStore.setItemAsync("refresh_token", data.refresh);

    return data.access;
  } catch (error) {
    console.error("Token refresh error:", error.message);
    return null;
  }
};

// Function to send API requests with token authentication
const apiRequest = async (url, options = {}) => {
  try {
    // If this is the sign-up request, skip the Authorization header
    if (url.includes("login") || url.includes("signup")) {
      options.headers = {
        ...options.headers,
      };
    } else {
      // Add Authorization header for other API requests
      const accessToken = await SecureStore.getItemAsync("access_token");
      const expirationTime = await SecureStore.getItemAsync("expiration_time");

      // If the token has expired, refresh it
      if (expirationTime && Date.now() > expirationTime) {
        const newAccessToken = await refreshTokens();
        if (newAccessToken) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };
        }
      } else if (accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        };
      }
    }

    // Send the request
    const response = await fetch(url, options);

    // Check if the response is not OK (e.g., 400, 401, etc.)
    if (!response.ok) {
      // Parse the error response
      const errorResponse = await response.json();
      throw { response: { data: errorResponse } }; // Throw the error response
    }

    return response.json();
  } catch (error) {
    console.error("Request error:", error.message || error);
    throw error; // Propagate the error
  }
};

export default {
  apiRequest,
};