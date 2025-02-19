import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  PixelRatio,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { width, height } = useWindowDimensions();

  // Function to scale font size based on screen width
  const scaleFontSize = (size) => {
    const scale = width / 375;
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  };

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
      contentContainerStyle={[styles.container, { paddingVertical: height * 0.02 }]}
    >
      <View style={[styles.header, { paddingHorizontal: width * 0.05 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={scaleFontSize(24)} color="#000" />
        </TouchableOpacity>
        <Text style={[styles.title, { fontSize: scaleFontSize(18) }]}>Settings</Text>
      </View>

      <View style={[styles.formContainer, { marginHorizontal: width * 0.05 }]}>
        <View style={styles.formField}>
          <Text style={[styles.fieldTitle, { fontSize: scaleFontSize(15) }]}>
            Current Password
          </Text>
          <TextInput
            style={[styles.textInput, { height: height * 0.06 }]}
            secureTextEntry={true}
            value={currentPassword}
            onChangeText={(text) => setCurrentPassword(text)}
            placeholder="Enter your current password"
          />
        </View>

        <View style={styles.formField}>
          <Text style={[styles.fieldTitle, { fontSize: scaleFontSize(15) }]}>
            New Password
          </Text>
          <TextInput
            style={[styles.textInput, { height: height * 0.06 }]}
            secureTextEntry={true}
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            placeholder="Enter your new password"
          />
        </View>

        <View style={styles.formField}>
          <Text style={[styles.fieldTitle, { fontSize: scaleFontSize(15) }]}>
            Confirm New Password
          </Text>
          <TextInput
            style={[styles.textInput, { height: height * 0.06 }]}
            secureTextEntry={true}
            value={confirmNewPassword}
            onChangeText={(text) => setConfirmNewPassword(text)}
            placeholder="Re-enter your new password"
          />
        </View>

        <TouchableOpacity
          style={[styles.updateButton, { paddingVertical: height * 0.02 }]}
          onPress={handleUpdatePassword}
        >
          <Text style={[styles.updateButtonText, { fontSize: scaleFontSize(13) }]}>
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
  },
  header: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    marginLeft: 10,
  },
  formContainer: {
    marginTop: 20,
  },
  formField: {
    marginBottom: 25,
  },
  fieldTitle: {
    fontWeight: "500",
    marginBottom: 5,
  },
  textInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: "#D9D9D9",
  },
  updateButton: {
    backgroundColor: "#061102",
    borderRadius: 5,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
});

export default ChangePasswordScreen;