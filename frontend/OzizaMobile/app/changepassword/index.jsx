import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

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
      Alert.alert("Error", "update password failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.formField}>
          <Text style={styles.fieldTitle}>Current Password</Text>
          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            value={currentPassword}
            onChangeText={(text) => setCurrentPassword(text)}
            placeholder="Enter your current password"
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldTitle}>New Password</Text>
          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            placeholder="Enter your new password"
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldTitle}>Confirm New Password</Text>
          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            value={confirmNewPassword}
            onChangeText={(text) => setConfirmNewPassword(text)}
            placeholder="Re-enter your new password"
          />
        </View>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdatePassword}
        >
          <Text style={styles.updateButtonText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  formContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  formField: {
    marginBottom: 25,
  },
  fieldTitle: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 5,
  },
  textInput: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#D9D9D9",
  },
  updateButton: {
    backgroundColor: "#061102",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: 500,
    textAlign: "center",
  },
});

export default ChangePasswordScreen;
