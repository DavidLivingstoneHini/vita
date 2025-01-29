import { Stack } from "expo-router";
import { SecureStore } from "expo-secure-store";
import React, { useState, useEffect } from "react";

export default function RootLayout() {

  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="emergency/index" options={{ title: "emergency" }} />
    </Stack>
  );
}