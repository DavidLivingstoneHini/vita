import React, { useState, useEffect } from "react";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function Index() {
  const [redirectTo, setRedirectTo] = useState("onboarding2"); // Default redirect

  useEffect(() => {
    const checkIfRegistered = async () => {
      try {
        // Check for presence of access token
        const storedAccessToken = await SecureStore.getItemAsync(
          "access_token"
        );
        if (storedAccessToken) {
          setRedirectTo("/login"); // Redirect to login if registered
        }
      } catch (error) {
        console.error("Error checking registration status:", error);
      }
    };
    checkIfRegistered();
  }, []);

  return (
    <View>
      <Redirect href={redirectTo} />
    </View>
  );
}
