import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  PixelRatio,
  Platform,
} from "react-native";
import * as SecureStore from "expo-secure-store"; // Correct import
import { Link, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

// Responsive Font Size Function
const responsiveFontSize = (size) => {
  const scaleFactor = width / 375; // Base width of 375 (iPhone SE)
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

  // Retrieve user data from secure store
  const retrieveUserData = async () => {
    try {
      const storedUserName = await SecureStore.getItemAsync("full_name"); // Correct method
      const storedUserEmail = await SecureStore.getItemAsync("email"); // Correct method
      const storedUserProfilePicture = await SecureStore.getItemAsync(
        "userProfilePicture"
      ); // Correct method

      if (storedUserName) setUserName(storedUserName);
      if (storedUserEmail) setUserEmail(storedUserEmail);
      if (storedUserProfilePicture)
        setUserProfilePicture(storedUserProfilePicture);
    } catch (error) {
      console.log("Error retrieving user data:", error);
      // Fallback to default data if retrieval fails
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

        {/* Language & Regional Settings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>LANGUAGE & REGIONAL SETTINGS</Text>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => console.log("Privacy Preferences Pressed")}
          >
            <Text style={styles.listItemText}>Language Preferences</Text>
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
            <Text style={styles.listItemText}>Regional Settings</Text>
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
            <Text style={styles.listItemText}>Time Zone Selections</Text>
            <Image
              source={require("../../assets/images/arrow-right.png")}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>SUPPORT & FEEDBACK</Text>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => console.log("Privacy Preferences Pressed")}
          >
            <Text style={styles.listItemText}>FAQs</Text>
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
            <Text style={styles.listItemText}>Contact Support</Text>
            <Image
              source={require("../../assets/images/arrow-right.png")}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>LEGAL</Text>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => console.log("Privacy Preferences Pressed")}
          >
            <Text style={styles.listItemText}>Terms of Service</Text>
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
            <Text style={styles.listItemText}>Privacy Policy</Text>
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
            <Text style={styles.listItemText}>Data Retention Policy</Text>
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
    paddingTop: getSafeAreaTop(), // Add safe area padding
  },
  settingsLabelContainer: {
    paddingVertical: height * 0.02, // 2% of screen height for vertical padding
    paddingHorizontal: width * 0.04, // 4% of screen width for horizontal padding
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingsLabel: {
    fontSize: responsiveFontSize(20), // Use responsive font size
    fontWeight: "700",
    // Add minimum and maximum font size constraints
    fontSize: Math.max(Math.min(responsiveFontSize(20), 24), 18),
  },
  iconContainer: {
    padding: width * 0.02, // Responsive padding (2% of screen width)
  },
  icon: {
    width: width * 0.05, // Responsive width (5% of screen width)
    height: width * 0.05, // Responsive height (5% of screen width)
  },
  profileContainer: {
    flexDirection: "row",
    padding: width * 0.05, // Responsive padding (5% of screen width)
    alignItems: "center",
  },
  customProfilePicture: {
    width: width * 0.2, // Responsive width (20% of screen width)
    height: width * 0.2, // Responsive height (20% of screen width)
    borderRadius: width * 0.1, // Responsive border radius (10% of screen width)
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 0.04, // Responsive margin (4% of screen width)
  },
  initials: {
    fontSize: responsiveFontSize(14), // Use responsive font size
    color: "#fff",
  },
  profileInfo: {
    justifyContent: "center",
  },
  profileName: {
    fontSize: responsiveFontSize(16), // Use responsive font size
    fontWeight: "500",
    color: "#0A0A0A",
  },
  profileEmail: {
    fontSize: responsiveFontSize(12), // Use responsive font size
    fontWeight: "400",
    color: "#828282",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: height * 0.02, // Responsive margin (2% of screen height)
  },
  sectionContainer: {
    marginHorizontal: width * 0.05, // Responsive margin (5% of screen width)
    marginBottom: height * 0.02, // Responsive margin (2% of screen height)
  },
  sectionTitle: {
    fontSize: responsiveFontSize(12), // Use responsive font size
    fontWeight: "400",
    color: "#828282",
    marginBottom: height * 0.01, // Responsive margin (1% of screen height)
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.018, // Responsive padding (1% of screen height)
    paddingHorizontal: width * 0.01,
  },
  listItemText: {
    fontSize: responsiveFontSize(16), // Use responsive font size
    fontWeight: "500",
    color: "#0A0A0A",
  },
  arrowIcon: {
    width: width * 0.05, // Responsive width (5% of screen width)
    height: width * 0.05, // Responsive height (5% of screen width)
  },
  listItemSeparator: {
    height: 1,
    backgroundColor: "#ccc",
  },
  logoutButton: {
    margin: width * 0.05, // Responsive margin (5% of screen width)
    padding: width * 0.03, // Responsive padding (3% of screen width)
    backgroundColor: "#000",
    borderRadius: 5,
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: responsiveFontSize(16), // Use responsive font size
    color: "#fff",
  },
});

export default SettingsPage;