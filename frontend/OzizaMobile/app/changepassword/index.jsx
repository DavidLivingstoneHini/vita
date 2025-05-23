import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
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
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    general: ""
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      general: ""
    };

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
      isValid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!confirmNewPassword) {
      newErrors.confirmNewPassword = "Please confirm your new password";
      isValid = false;
    } else if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords don't match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdatePassword = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({ ...errors, general: "" });

    try {
      // Retrieve the access token from SecureStore
      const accessToken = await SecureStore.getItemAsync("access_token");

      if (!accessToken) {
        throw new Error("Authentication required. Please login again.");
      }

      const response = await fetch(
        "https://www.ozizabackapp.in/api/v1/users/password/change/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            old_password: currentPassword,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle API validation errors
        if (data.old_password) {
          throw new Error(data.old_password[0] || "Current password is incorrect");
        } else if (data.new_password) {
          throw new Error(data.new_password[0] || "Invalid new password");
        } else if (data.detail) {
          throw new Error(data.detail);
        } else {
          throw new Error("Failed to update password");
        }
      }

      // Success case
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password updated successfully!',
        position: 'bottom',
        visibilityTime: 4000,
      });

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

    } catch (error) {
      console.error("Update error:", error);

      // Handle specific error cases
      if (error.message.includes("Authentication")) {
        // Token expired or invalid
        Toast.show({
          type: 'error',
          text1: 'Session Expired',
          text2: 'Please login again',
          position: 'top',
          visibilityTime: 4000,
        });
        // Optionally redirect to login
        router.push("/login");
      } else {
        // Show other errors
        setErrors({ ...errors, general: error.message });
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message || 'Failed to update password',
          position: 'top',
          visibilityTime: 4000,
        });
      }
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
        <TouchableOpacity onPress={() => router.back()}>
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

      {/* Error Message */}
      {errors.general && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errors.general}</Text>
        </View>
      )}

      {/* Form Container */}
      <View style={styles.formContainer}>
        {/* Current Password Field */}
        <View style={styles.formField}>
          <Text style={[styles.fieldTitle, { fontSize: responsiveFontSize(14) }]}>
            Current Password
          </Text>
          <TextInput
            style={[
              styles.textInput,
              { height: height * 0.06 },
              errors.currentPassword && styles.inputError
            ]}
            secureTextEntry={true}
            textContentType="password"
            autoComplete="password"
            autoCorrect={false}
            spellCheck={false}
            underlineColorAndroid="transparent"
            value={currentPassword}
            onChangeText={(text) => {
              setCurrentPassword(text);
              setErrors({ ...errors, currentPassword: "" });
            }}
            placeholder="Enter your current password"
            placeholderTextColor="#828282"
          />
          {errors.currentPassword && (
            <Text style={styles.fieldError}>{errors.currentPassword}</Text>
          )}
        </View>

        {/* New Password Field */}
        <View style={styles.formField}>
          <Text style={[styles.fieldTitle, { fontSize: responsiveFontSize(14) }]}>
            New Password
          </Text>
          <TextInput
            style={[
              styles.textInput,
              { height: height * 0.06 },
              errors.newPassword && styles.inputError
            ]}
            secureTextEntry={true}
            textContentType="password"
            autoComplete="password"
            autoCorrect={false}
            spellCheck={false}
            underlineColorAndroid="transparent"
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              setErrors({ ...errors, newPassword: "" });
            }}
            placeholder="Enter your new password (min 8 characters)"
            placeholderTextColor="#828282"
          />
          {errors.newPassword && (
            <Text style={styles.fieldError}>{errors.newPassword}</Text>
          )}
        </View>

        {/* Confirm New Password Field */}
        <View style={styles.formField}>
          <Text style={[styles.fieldTitle, { fontSize: responsiveFontSize(14) }]}>
            Confirm New Password
          </Text>
          <TextInput
            style={[
              styles.textInput,
              { height: height * 0.06 },
              errors.confirmNewPassword && styles.inputError
            ]}
            secureTextEntry={true}
            textContentType="password"
            autoComplete="password"
            autoCorrect={false}
            spellCheck={false}
            underlineColorAndroid="transparent"
            value={confirmNewPassword}
            onChangeText={(text) => {
              setConfirmNewPassword(text);
              setErrors({ ...errors, confirmNewPassword: "" });
            }}
            placeholder="Re-enter your new password"
            placeholderTextColor="#828282"
          />
          {errors.confirmNewPassword && (
            <Text style={styles.fieldError}>{errors.confirmNewPassword}</Text>
          )}
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
    paddingHorizontal: width * 0.05,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.02,
  },
  title: {
    fontWeight: "700",
    marginLeft: width * 0.04,
  },
  formContainer: {
    marginTop: height * 0.02,
  },
  formField: {
    marginBottom: height * 0.03,
  },
  fieldTitle: {
    fontWeight: "500",
    color: "#0A0A0A",
    marginBottom: height * 0.01,
  },
  textInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: width * 0.04,
    backgroundColor: "#F5F5F5",
  },
  inputError: {
    borderColor: "#C92035",
    backgroundColor: "#FFF5F6",
  },
  fieldError: {
    color: "#C92035",
    fontSize: responsiveFontSize(12),
    marginTop: 5,
  },
  errorContainer: {
    backgroundColor: "#FFF5F6",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  errorText: {
    color: "#C92035",
    fontSize: responsiveFontSize(14),
  },
  updateButton: {
    backgroundColor: "#000",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
});

export default ChangePasswordScreen;