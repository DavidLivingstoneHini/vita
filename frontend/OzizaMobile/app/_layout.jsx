import { Stack } from "expo-router";
import { SecureStore } from "expo-secure-store";
import React, { useState, useEffect } from "react";

export default function RootLayout() {
  const [accessToken, setAccessToken] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const storedAccessToken = await SecureStore.getItemAsync("access_token");
      setAccessToken(storedAccessToken);
      setAuthenticated(!!storedAccessToken); // Set authenticated state based on token presence
    };
    checkToken();
  }, []);

  if (!authenticated) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="onboarding1/index"
          options={{ title: "onboarding1" }}
        />
        <Stack.Screen
          name="onboarding2/index"
          options={{ title: "onboarding2" }}
        />
        <Stack.Screen name="login/index" options={{ title: "login" }} />
        <Stack.Screen name="signup/index" options={{ title: "signup" }} />
      </Stack>
    );
  }

  return (
    <Stack>
      <Stack.Screen
        name="inspiration/index"
        options={{ title: "inspiration" }}
      />
      <Stack.Screen name="findoctor/index" options={{ title: "findoctor" }} />
      <Stack.Screen name="events/index" options={{ title: "events" }} />
      <Stack.Screen name="emergency/index" options={{ title: "emergency" }} />
      <Stack.Screen name="doctorlist/index" options={{ title: "doctorlist" }} />
      <Stack.Screen name="gym/index" options={{ title: "gym" }} />
      <Stack.Screen
        name="changepassword/index"
        options={{ title: "changepassword" }}
      />
      <Stack.Screen
        name="articles/index"
        options={{ title: "articles" }}
      />
    </Stack>
  );
}
