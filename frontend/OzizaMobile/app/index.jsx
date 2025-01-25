import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import { SecureStore } from "expo-secure-store";
import React, { useState, useEffect } from "react";

export default function Index() {
  const [redirectTo, setRedirectTo] = useState("(tabs)/home"); // Default redirect

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
