import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  PixelRatio,
  Platform,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import api from "../../services/api";
import Toast from 'react-native-toast-message';

// Get screen dimensions
const { width, height } = Dimensions.get("window");

// Responsive Font Size Function
const responsiveFontSize = (size) => {
  const scaleFactor = width / 375; // Base width of 375
  const newSize = size * scaleFactor;
  return Math.ceil(newSize); // Round to nearest whole number
};

// Function to get safe area top padding
const getSafeAreaTop = () => {
  if (Platform.OS === "ios") {
    return 40; // Adjust for iOS
  }
  return 20; // Default for Android
};

const ChangePasswordScreen = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleUpdatePassword = async () => {
    setLoading(true);
    try {
      // Retrieve the access token from SecureStore
      const accessToken = await SecureStore.getItemAsync("access_token");

      // Ensure the access token is a string
      if (!accessToken || typeof accessToken !== "string") {
        throw new Error("Invalid access token");
      }

      const response = await api.apiRequest(
        "https://djbackend-9d8q.onrender.com/api/v1/users/password/change/",
        {
          method: "POST",
          body: JSON.stringify({
            old_password: currentPassword,
            new_password: newPassword,
          }),
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Response from server:", response);

      // Show success message using Toast
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password updated successfully.',
        position: 'bottom',
        visibilityTime: 4000,
      });
    } catch (error) {
      console.error("Update error:", error?.message || "Unknown error");

      // Extract the error message from the API response
      let errorMessage = "An unknown error occurred. Please try again.";
      if (error.response && error.response.data) {
        // Check if the error is in the "old_password" field
        if (error.response.data.old_password && error.response.data.old_password.length > 0) {
          errorMessage = error.response.data.old_password[0]; // Get the first error message
        } else if (error.response.data.new_password && error.response.data.new_password.length > 0) {
          errorMessage = error.response.data.new_password[0]; // Get the first error message
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail; // Get the detail error message
        }
      }

      // Show the error message using Toast
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingTop: getSafeAreaTop() }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <AntDesign
            name="arrowleft"
            size={responsiveFontSize(24)}
            color="#000"
          />
        </TouchableOpacity>
        <Text style={[styles.title, { fontSize: responsiveFontSize(18) }]}>
          Change Password
        </Text>
      </View>

      {/* Form Container */}
      <View style={styles.formContainer}>
        {/* Current Password Field */}
        <View style={styles.formField}>
          <Text style={[styles.fieldTitle, { fontSize: responsiveFontSize(14) }]}>
            Current Password
          </Text>
          <TextInput
            style={[styles.textInput, { height: height * 0.06 }]}
            secureTextEntry={true}
            value={currentPassword}
            onChangeText={(text) => setCurrentPassword(text)}
            placeholder="Enter your current password"
            placeholderTextColor="#828282"
          />
        </View>

        {/* New Password Field */}
        <View style={styles.formField}>
          <Text style={[styles.fieldTitle, { fontSize: responsiveFontSize(14) }]}>
            New Password
          </Text>
          <TextInput
            style={[styles.textInput, { height: height * 0.06 }]}
            secureTextEntry={true}
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            placeholder="Enter your new password"
            placeholderTextColor="#828282"
          />
        </View>

        {/* Confirm New Password Field */}
        <View style={styles.formField}>
          <Text style={[styles.fieldTitle, { fontSize: responsiveFontSize(14) }]}>
            Confirm New Password
          </Text>
          <TextInput
            style={[styles.textInput, { height: height * 0.06 }]}
            secureTextEntry={true}
            value={confirmNewPassword}
            onChangeText={(text) => setConfirmNewPassword(text)}
            placeholder="Re-enter your new password"
            placeholderTextColor="#828282"
          />
        </View>

        {/* Update Password Button */}
        <TouchableOpacity
          style={[styles.updateButton, { paddingVertical: height * 0.02 }]}
          onPress={handleUpdatePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text
              style={[styles.updateButtonText, { fontSize: responsiveFontSize(16) }]}
            >
              Update Password
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: width * 0.05, // Responsive padding (5% of screen width)
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.02, // Responsive padding (2% of screen height)
  },
  title: {
    fontWeight: "700",
    marginLeft: width * 0.04, // Responsive margin (4% of screen width)
  },
  formContainer: {
    marginTop: height * 0.02, // Responsive margin (2% of screen height)
  },
  formField: {
    marginBottom: height * 0.03, // Responsive margin (3% of screen height)
  },
  fieldTitle: {
    fontWeight: "500",
    color: "#0A0A0A",
    marginBottom: height * 0.01, // Responsive margin (1% of screen height)
  },
  textInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: width * 0.04, // Responsive padding (4% of screen width)
    backgroundColor: "#F5F5F5",
  },
  updateButton: {
    backgroundColor: "#000",
    borderRadius: 5,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
});

export default ChangePasswordScreen;