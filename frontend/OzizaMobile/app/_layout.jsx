import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState, useEffect } from "react";
import Toast from 'react-native-toast-message';

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

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {authenticated ? (
          <>
            <Stack.Screen name="inspiration/index" />
            <Stack.Screen name="findoctor/index" />
            <Stack.Screen name="events/index" />
            <Stack.Screen name="emergency/index" />
            <Stack.Screen name="doctorlist/index" />
            <Stack.Screen name="gym/index" />
            <Stack.Screen name="changepassword/index" />
            <Stack.Screen name="articles/index" />
          </>
        ) : (
          <>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding1/index" />
            <Stack.Screen name="onboarding2/index" />
            <Stack.Screen name="login/index" />
            <Stack.Screen name="signup/index" />
          </>
        )}
      </Stack>
      <Toast />
    </>
  );
}
