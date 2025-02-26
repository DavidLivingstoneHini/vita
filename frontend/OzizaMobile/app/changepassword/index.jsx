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
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";

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
      const response = await api.apiRequest(
        "http://192.168.169.90:8000/api/v1/users/password/change/",
        {
          method: "POST",
          body: JSON.stringify({
            old_password: currentPassword,
            new_password: newPassword,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response from server:", response);
    } catch (error) {
      console.error("Update error:", error?.message || "Unknown error");
      Alert.alert("Error", "Update password failed. Please try again.");
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
        >
          <Text
            style={[styles.updateButtonText, { fontSize: responsiveFontSize(16) }]}
          >
            Update Password
          </Text>
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