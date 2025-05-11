import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get("window");

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
const API_BASE_URL = "http://192.168.100.34:8000/api/";

const responsiveFontSize = (size) => {
  const scaleFactor = width / 375;
  const newSize = size * scaleFactor;
  return Math.ceil(newSize);
};

const getSafeAreaTop = () => {
  if (Platform.OS === "ios") {
    return 40;
  }
  return 20;
};

const SettingsPage = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();

  const getUserInitials = (name) => {
    if (!name) return "";
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase());
    return initials.slice(0, 2).join("");
  };

  const retrieveUserData = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access_token");
      const response = await fetch(`${API_BASE_URL}v1/users/profile/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUserName(userData.full_name);
        setUserEmail(userData.email);
        setUserProfilePicture(userData.profile_picture || null);
      }
    } catch (error) {
      console.log("Error retrieving user data:", error);
      Toast.show({  
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load profile data',
      });
    }
  };

  useEffect(() => {
    retrieveUserData();
  }, []);

  const checkImageSize = async (uri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.size > MAX_IMAGE_SIZE) {
        throw new Error(`Image size exceeds ${MAX_IMAGE_SIZE / (1024 * 1024)}MB limit`);
      }
      return true;
    } catch (error) {
      console.error("Error checking image size:", error);
      throw error;
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your photos to upload a profile picture');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to pick image',
      });
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your camera to take a photo');
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Camera error:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to take photo',
      });
    }
  };

  const uploadImage = async (uri) => {
    setIsLoading(true);
    try {
      // First check the image size
      await checkImageSize(uri);

      const accessToken = await SecureStore.getItemAsync("access_token");

      // Create FormData
      const formData = new FormData();
      formData.append('profile_picture', {
        uri: uri,
        name: 'profile.jpg',
        type: 'image/jpeg'
      });

      const response = await fetch(`${API_BASE_URL}v1/users/profile/picture/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUserProfilePicture(data.profile_picture);
        Toast.show({
          type: 'success',
          text1: 'Profile Picture Updated',
          text2: 'Your profile picture has been updated successfully',
        });
      } else {
        throw new Error(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error("Image upload error:", error);
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: error.message.includes('exceeds')
          ? error.message
          : 'There was an issue updating your profile picture',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeProfilePicture = async () => {
    setIsLoading(true);
    try {
      const accessToken = await SecureStore.getItemAsync("access_token");
      const response = await fetch(`${API_BASE_URL}v1/users/profile/picture/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setUserProfilePicture(null);
        Toast.show({
          type: 'success',
          text1: 'Profile Picture Removed',
          text2: 'Your profile picture has been removed',
        });
      } else {
        throw new Error('Failed to remove profile picture');
      }
    } catch (error) {
      console.error("Remove image error:", error);
      Toast.show({
        type: 'error',
        text1: 'Remove Failed',
        text2: error.message || 'There was an issue removing your profile picture',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Profile Picture",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: () => takePhoto(),
        },
        {
          text: "Choose from Library",
          onPress: () => pickImage(),
        },
        ...(userProfilePicture ? [{
          text: "Remove Current Photo",
          onPress: () => removeProfilePicture(),
          style: "destructive",
        }] : []),
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const handleLogout = async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync("access_token"),
        SecureStore.deleteItemAsync("refresh_token"),
        SecureStore.deleteItemAsync("full_name"),
        SecureStore.deleteItemAsync("email"),
        SecureStore.deleteItemAsync("userProfilePicture"),
      ]);

      router.push("/login");
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'You have been successfully logged out',
      });
    } catch (error) {
      console.error("Logout error:", error);
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: 'There was an issue logging out. Please try again.',
      });
    }
  };

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
        <View style={styles.profileContainer}>
          <TouchableOpacity
            onPress={showImageOptions}
            style={styles.profilePictureContainer}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={[styles.profilePicture, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            ) : userProfilePicture ? (
              <Image
                source={{ uri: userProfilePicture }}
                style={styles.profilePicture}
              />
            ) : (
              <View style={styles.defaultProfilePicture}>
                <Text style={styles.initials}>{getUserInitials(userName)}</Text>
              </View>
            )}
            <View style={styles.uploadIconContainer}>
              <Icon
                name={userProfilePicture ? "edit" : "add-a-photo"}
                size={responsiveFontSize(16)}
                color="#fff"
              />
            </View>
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileEmail}>{userEmail}</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation.navigate("editprofile/index")}
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
            onPress={() => navigation.navigate("bookmark/index")}
          >
            <Text style={styles.listItemText}>Bookmarks</Text>
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

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation.navigate("pushnotif/index")}
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
            onPress={() => navigation.navigate("emailnotif/index")}
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
            onPress={() => navigation.navigate("smsnotif/index")}
          >
            <Text style={styles.listItemText}>SMS Notifications</Text>
            <Image
              source={require("../../assets/images/arrow-right.png")}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>LANGUAGE & REGIONAL SETTINGS</Text>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation.navigate("language/index")}
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
            onPress={() => navigation.navigate("timezone/index")}
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

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={isLoading}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: getSafeAreaTop(),
  },
  settingsLabelContainer: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingsLabel: {
    fontSize: Math.max(Math.min(responsiveFontSize(20), 24), 18),
    fontWeight: "700",
  },
  iconContainer: {
    padding: width * 0.02,
  },
  icon: {
    width: width * 0.05,
    height: width * 0.05,
  },
  profileContainer: {
    flexDirection: "row",
    padding: width * 0.05,
    alignItems: "center",
  },
  profilePictureContainer: {
    position: 'relative',
  },
  profilePicture: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    marginRight: width * 0.04,
  },
  loadingContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultProfilePicture: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 0.04,
  },
  initials: {
    fontSize: responsiveFontSize(14),
    color: "#fff",
    fontWeight: 'bold',
  },
  uploadIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: width * 0.04,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 5,
  },
  profileInfo: {
    justifyContent: "center",
  },
  profileName: {
    fontSize: responsiveFontSize(17),
    fontWeight: "500",
    color: "#0A0A0A",
  },
  profileEmail: {
    fontSize: responsiveFontSize(14),
    fontWeight: "400",
    color: "#828282",
  },
  sectionContainer: {
    marginHorizontal: width * 0.05,
    marginBottom: height * 0.02,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(12),
    fontWeight: "400",
    color: "#828282",
    marginBottom: height * 0.01,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.01,
  },
  listItemText: {
    fontSize: responsiveFontSize(16),
    fontWeight: "500",
    color: "#0A0A0A",
  },
  arrowIcon: {
    width: width * 0.05,
    height: width * 0.05,
  },
  listItemSeparator: {
    height: 1,
    backgroundColor: "#ccc",
  },
  logoutButton: {
    margin: width * 0.05,
    padding: width * 0.03,
    backgroundColor: "#000",
    borderRadius: 5,
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: responsiveFontSize(16),
    color: "#fff",
  },
});

export default SettingsPage;