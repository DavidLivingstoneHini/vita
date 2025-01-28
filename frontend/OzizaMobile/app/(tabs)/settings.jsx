import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import * as SecureStore from "expo-secure-store";

const SettingsPage = () => {
  const [userName, setUserName] = useState("John Doe");
  const [userEmail, setUserEmail] = useState("johndoe@example.com");
  const [userProfilePicture, setUserProfilePicture] = useState(
    "https://picsum.photos/60"
  );

  // Function to get user initials
  const getUserInitials = (name) => {
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase());
    return initials.join("");
  };

  // Mock function to retrieve user data from secure store
  const retrieveUserData = async () => {
    try {
      const storedUserName = await SecureStore.getItemAsync("userName");
      const storedUserEmail = await SecureStore.getItemAsync("userEmail");
      const storedUserProfilePicture = await SecureStore.getItemAsync(
        "userProfilePicture"
      );

      if (storedUserName) setUserName(storedUserName);
      if (storedUserEmail) setUserEmail(storedUserEmail);
      if (storedUserProfilePicture)
        setUserProfilePicture(storedUserProfilePicture);
    } catch (error) {
      console.log("Error retrieving user data:", error);
      // Dummy data will be displayed if retrieval fails
    }
  };

  useEffect(() => {
    retrieveUserData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.settingsLabelContainer}>
        <Text style={styles.settingsLabel}>Settings</Text>
        <TouchableOpacity style={styles.iconContainer}>
          <Image
            source={require("../../assets/images/three-dot.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* User Profile Section with Custom Initials Image */}
      <View style={styles.profileContainer}>
        <View style={styles.customProfilePicture}>
          <Text style={styles.initials}>{getUserInitials(userName)}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileEmail}>{userEmail}</Text>
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => console.log("Edit Profile Pressed")}
        >
          <Text style={styles.listItemText}>Edit Profile</Text>
          <Image
            source={require("../../assets/images/arrow-right.png")}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <View style={styles.listItemSeparator} />
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => console.log("")}
        >
          <Text style={styles.listItemText}>Change Password</Text>
          <Image
            source={require("../../assets/images/arrow-right.png")}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <View style={styles.listItemSeparator} />
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => console.log("")}
        >
          <Text style={styles.listItemText}>Account Deactivation</Text>
          <Image
            source={require("../../assets/images/arrow-right.png")}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Privacy & Security Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => console.log("Privacy Preferences Pressed")}
        >
          <Text style={styles.listItemText}>Privacy Preferences</Text>
          <Image
            source={require("../../assets/images/arrow-right.png")}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <View style={styles.listItemSeparator} />
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => console.log("Security Settings Pressed")}
        >
          <Text style={styles.listItemText}>Security Settings</Text>
          <Image
            source={require("../../assets/images/arrow-right.png")}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <View style={styles.listItemSeparator} />
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => console.log("Manage Permissions Pressed")}
        >
          <Text style={styles.listItemText}>Manage Permissions</Text>
          <Image
            source={require("../../assets/images/arrow-right.png")}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => console.log("Logout Pressed")}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  settingsLabelContainer: {
    padding: 15,
    backgroundColor: "#f7f7f7",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingsLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  iconContainer: {
    padding: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
  profileContainer: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  customProfilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  initials: {
    fontSize: 24,
    color: "#fff",
  },
  profileInfo: {
    justifyContent: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 15,
  },
  sectionContainer: {
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  listItemText: {
    fontSize: 16,
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  listItemSeparator: {
    height: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 15,
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: 18,
    color: "#fff",
  },
});

export default SettingsPage;
