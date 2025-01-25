import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshTokens = async () => {
  try {
    const refreshToken = await SecureStore.getItemAsync("refresh_token");
    const response = await api.post("users/token/refresh/", {
      refresh: refreshToken,
    });

    await SecureStore.setItemAsync("access_token", response.data.access);
    await SecureStore.setItemAsync("refresh_token", response.data.refresh);

    return response.data.access;
  } catch (error) {
    console.error("Token refresh error:", error.response?.data);
    return null;
  }
};

// api.interceptors.push({
//   async request(config) {
//     const accessToken = await SecureStore.getItemAsync("access_token");
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }

//     const expirationTime = await SecureStore.getItemAsync("expiration_time");
//     if (expirationTime && Date.now() > expirationTime) {
//       try {
//         const newAccessToken = await refreshTokens();
//         if (newAccessToken) {
//           config.headers.Authorization = `Bearer ${newAccessToken}`;
//         }
//       } catch (error) {
//         console.error("Token refresh error during interceptor:", error.response?.data);
//       }
//     }

//     return config;
//   },
// });

export default api;
