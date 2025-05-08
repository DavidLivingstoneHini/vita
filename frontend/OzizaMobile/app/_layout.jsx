import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState, useEffect } from "react";
import Toast from 'react-native-toast-message';
import { toastConfig } from "../utils/toastConfig";
import TabLayout from "../app/(tabs)/_layout";

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
            <Stack.Screen name="tabs" component={TabLayout} />
            <Stack.Screen name="inspiration/index" />
            <Stack.Screen name="findoctor/index" />
            <Stack.Screen name="events/index" />
            <Stack.Screen name="organizations/index" />
            <Stack.Screen name="policies/index" />
            <Stack.Screen name="emergency/index" />
            <Stack.Screen name="doctorlist/index" />
            <Stack.Screen name="gym/index" />
            <Stack.Screen name="changepassword/index" />
            <Stack.Screen name="articles/index" />
            <Stack.Screen name="bmi/index" />
            <Stack.Screen name="period/index" />
            <Stack.Screen name="symptom1/index" />
            <Stack.Screen name="symptom2/index" />
            <Stack.Screen name="symptom3/index" />
            <Stack.Screen name="symptom4/index" />
            <Stack.Screen name="symptom5/index" />
            <Stack.Screen name="notification/index" />
            <Stack.Screen name="notificationdetail/index" />
            <Stack.Screen name="emailnotif/index" />
            <Stack.Screen name="smsnotif/index" />
            <Stack.Screen name="pushnotif/index" />
            <Stack.Screen name="timezone/index" />
            <Stack.Screen name="language/index" />
            <Stack.Screen name="bookmark/index" />
            <Stack.Screen name="myths/index" />
            <Stack.Screen name="mythdetail/index" />
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
      <Toast config={toastConfig} />
    </>
  );
}
