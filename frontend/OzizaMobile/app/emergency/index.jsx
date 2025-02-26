import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { Link, useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

// Responsive Font Size Function (same as in Settings Screen)
const responsiveFontSize = (size) => {
  const scaleFactor = width / 375; // Base width of 375 (iPhone SE)
  const newSize = size * scaleFactor;
  return Math.ceil(newSize); // Round to nearest whole number
};

// Function to get safe area top padding (same as in Settings Screen)
const getSafeAreaTop = () => {
  if (Platform.OS === "ios") {
    return 40; // Adjust for iOS
  }
  return 20; // Default for Android
};

export default function EmergencyServicesScreen({ }) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push("/home")}>
            <Image
              source={require("../../assets/images/back-arrow-white.png")}
              style={styles.backArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Home</Text>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.subHeaderText}>
            Are you in an Emergency? Do you need help?
          </Text>
          <Text style={styles.subSubHeaderText}>
            Tap the required emergency service to call them or use their official
            help numbers
          </Text>
        </View>
      </View>

      {/* Emergency Services Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.emergencyButton}>
          <Image
            source={require("../../assets/images/ambulance-icon.png")}
            style={styles.buttonIcon}
          />
          <Text style={styles.emergencyButtonText}>Ambulance</Text>
          <Text style={styles.emergencyButtonNumber}>112</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emergencyButton}>
          <Image
            source={require("../../assets/images/firetruck.png")}
            style={styles.buttonIcon}
          />
          <Text style={styles.emergencyButtonText}>Fire Service</Text>
          <Text style={styles.emergencyButtonNumber}>101</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emergencyButton}>
          <Image
            source={require("../../assets/images/police-icon.png")}
            style={styles.buttonIcon}
          />
          <Text style={styles.emergencyButtonText}>Police</Text>
          <Text style={styles.emergencyButtonNumber}>911</Text>
        </TouchableOpacity>
      </View>

      {/* Red Text at the Bottom */}
      <Text style={styles.footerText}>
        Please make sure to be specific on the type of emergency and also the
        location of the incident to make it easier for the emergency services to
        locate you
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: getSafeAreaTop(), // Add safe area padding
  },
  header: {
    backgroundColor: "#C92035",
    borderBottomLeftRadius: width * 0.45, // Responsive border radius
    borderBottomRightRadius: width * 0.45, // Responsive border radius
    paddingVertical: height * 0.02, // Responsive padding (3% of screen height)
    paddingHorizontal: width * 0.05, // Responsive padding (5% of screen width)
    flexDirection: "column",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02, // Responsive margin (2% of screen height)
  },
  headerText: {
    fontSize: responsiveFontSize(17), // Responsive font size
    color: "#fff",
    fontWeight: "bold",
    marginLeft: width * 0.03, // Responsive margin (3% of screen width)
    marginBottom: height * 0.05, // Responsive margin (5% of screen height)
  },
  headerCenter: {
    alignItems: "center",
    marginTop: height * -0.01, // Responsive margin (-1% of screen height)
    marginBottom: height * 0.02, // Responsive margin (2% of screen height)
  },
  subHeaderText: {
    fontSize: responsiveFontSize(20), // Responsive font size
    color: "#fff",
    fontWeight: "700",
    paddingHorizontal: width * 0.08, // Responsive padding (8% of screen width)
    marginBottom: height * 0.02, // Responsive margin (2% of screen height)
    textAlign: "center", // Center text
  },
  subSubHeaderText: {
    fontSize: responsiveFontSize(12), // Responsive font size
    fontWeight: "500",
    color: "#fff",
    marginBottom: height * 0.03, // Responsive margin (3% of screen height)
    paddingHorizontal: width * 0.08, // Responsive padding (8% of screen width)
    textAlign: "center", // Center text
  },
  buttonsContainer: {
    marginTop: height * 0.06, // Responsive margin (6% of screen height)
    paddingHorizontal: width * 0.05, // Responsive padding (5% of screen width)
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.02, // Responsive padding (2% of screen height)
    height: height * 0.1, // Responsive height (10% of screen height)
    paddingHorizontal: width * 0.04, // Responsive padding (4% of screen width)
    borderWidth: 1,
    borderColor: "#C92035",
    borderRadius: width * 0.02, // Responsive border radius (2% of screen width)
    marginBottom: height * 0.02, // Responsive margin (2% of screen height)
  },
  buttonIcon: {
    width: width * 0.06, // Responsive width (6% of screen width)
    height: width * 0.06, // Responsive height (6% of screen width)
    marginRight: width * 0.03, // Responsive margin (3% of screen width)
  },
  emergencyButtonText: {
    fontSize: responsiveFontSize(21), // Responsive font size
    marginLeft: width * 0.05, // Responsive margin (5% of screen width)
    fontWeight: "700",
    flex: 1,
    color: "#000000",
  },
  emergencyButtonNumber: {
    fontSize: responsiveFontSize(24), // Responsive font size
    color: "#C92035",
    fontWeight: "700",
  },
  footerText: {
    fontSize: responsiveFontSize(12), // Responsive font size
    color: "#C92035",
    textAlign: "center",
    marginTop: height * 0.04, // Responsive margin (4% of screen height)
    paddingHorizontal: width * 0.05, // Responsive padding (5% of screen width)
  },
  backArrow: {
    width: width * 0.05, // Responsive width (5% of screen width)
    height: width * 0.05, // Responsive height (5% of screen width)
    marginRight: width * 0.02, // Responsive margin (2% of screen width)
    marginTop: height * -0.03, // Responsive margin (-3% of screen height)
  },
});