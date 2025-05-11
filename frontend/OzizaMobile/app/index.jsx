import React, { useState, useEffect } from "react";
import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import { initializePushNotifications } from "../services/notificationService";

export default function Index() {
  const [redirectTo, setRedirectTo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check for both access token and user data
        const accessToken = await SecureStore.getItemAsync("access_token");
        const refreshToken = await SecureStore.getItemAsync("refresh_token");
        const userEmail = await SecureStore.getItemAsync("email");

        if (accessToken && refreshToken && userEmail) {
          // User is authenticated - redirect to home and initialize notifications
          await initializePushNotifications();
          setRedirectTo("/(tabs)/home");
        } else if (accessToken && !refreshToken) {
          // Partial auth state
          setRedirectTo("/login");
        } else {
          // No auth tokens
          setRedirectTo("/onboarding1");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setRedirectTo("/onboarding1");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View>
      <Redirect href={redirectTo} />
    </View>
  );
}