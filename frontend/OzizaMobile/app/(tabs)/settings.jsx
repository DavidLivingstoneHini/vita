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
import { Link, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";

const SettingsPage = () => {
  const [userName, setUserName] = useState("Swae Stone");
  const [userEmail, setUserEmail] = useState("kwamelivingstone77@icloud.com");
  const [userProfilePicture, setUserProfilePicture] = useState(
    "https://picsum.photos/60"
  );

  const navigation = useNavigation();

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
      const storedUserName = await SecureStore.getItemAsync("full_name");
      const storedUserEmail = await SecureStore.getItemAsync("email");
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

  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.settingsLabelContainer}>
        <Text style={styles.settingsLabel}>Settings</Text>
        <TouchableOpacity style={styles.iconContainer}>
          <Image
            source={require("../../assets/images/three-dot.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <ScrollView vertical showsVerticalScrollIndicator={false}>
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
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
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
            onPress={() => navigation.navigate("changepassword/index")}
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
          <Text style={styles.sectionTitle}>PRIVACY & SECURITY</Text>
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

        {/* Notifications */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => console.log("Privacy Preferences Pressed")}
          >
            <Text style={styles.listItemText}>Push Notifications</Text>
            <Image
              source={require("../../assets/images/arrow-right.png")}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          <View style={styles.listItemSeparator} />
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => console.log("Email Notifications")}
          >
            <Text style={styles.listItemText}>Email Notifications</Text>
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
            <Text style={styles.listItemText}>SMS Notifications</Text>
            <Image
              source={require("../../assets/images/arrow-right.png")}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>LANGUAGE & REGIONAL SETTINGS</Text>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => console.log("Privacy Preferences Pressed")}
          >
            <Text style={styles.listItemText}>Push Notifications</Text>
            <Image
              source={require("../../assets/images/arrow-right.png")}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          <View style={styles.listItemSeparator} />
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => console.log("Email Notifications")}
          >
            <Text style={styles.listItemText}>Email Notifications</Text>
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
            <Text style={styles.listItemText}>SMS Notifications</Text>
            <Image
              source={require("../../assets/images/arrow-right.png")}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
    fontWeight: 700,
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
    width: 75,
    height: 75,
    borderRadius: 100,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  initials: {
    fontSize: 14,
    color: "#fff",
  },
  profileInfo: {
    justifyContent: "center",
  },
  profileName: {
    fontSize: 16,
    fontWeight: 500,
    color: "#0A0A0A",
  },
  profileEmail: {
    fontSize: 12,
    fontWeight: 400,
    color: "#828282",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 15,
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 400,
    color: "#828282",
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
    fontWeight: 500,
    color: "#0A0A0A",
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
    padding: 12,
    backgroundColor: "#000",
    borderRadius: 5,
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default SettingsPage;
