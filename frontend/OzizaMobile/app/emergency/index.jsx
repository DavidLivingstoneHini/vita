import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Scaling function for responsive design
const scale = (size) => (width / 375) * size; // 375 is the base width (iPhone 6/7/8)

export default function EmergencyServicesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
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
  },
  header: {
    backgroundColor: "#C92035",
    borderBottomLeftRadius: scale(170), // Responsive border radius
    borderBottomRightRadius: scale(170), // Responsive border radius
    paddingVertical: scale(30), // Responsive padding
    paddingHorizontal: scale(20), // Responsive padding
    flexDirection: "column",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(10), // Responsive margin
  },
  headerText: {
    fontSize: scale(17), // Responsive font size
    color: "#fff",
    fontWeight: "bold",
    marginLeft: scale(10), // Responsive margin
    marginBottom: scale(40), // Responsive margin
  },
  headerCenter: {
    alignItems: "center",
    marginTop: scale(-5), // Responsive margin
    marginBottom: scale(10), // Responsive margin
  },
  subHeaderText: {
    fontSize: scale(20), // Responsive font size
    color: "#fff",
    fontWeight: "700",
    paddingHorizontal: scale(30), // Responsive padding
    marginBottom: scale(10), // Responsive margin
    textAlign: "center", // Center text
  },
  subSubHeaderText: {
    fontSize: scale(12), // Responsive font size
    fontWeight: "500",
    color: "#fff",
    marginBottom: scale(20), // Responsive margin
    paddingHorizontal: scale(30), // Responsive padding
    textAlign: "center", // Center text
  },
  buttonsContainer: {
    marginTop: scale(50), // Responsive margin
    paddingHorizontal: scale(20), // Responsive padding
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(15), // Responsive padding
    height: scale(88), // Responsive height
    paddingHorizontal: scale(14), // Responsive padding
    borderWidth: 1,
    borderColor: "#C92035",
    borderRadius: scale(5), // Responsive border radius
    marginBottom: scale(10), // Responsive margin
  },
  buttonIcon: {
    width: scale(24), // Responsive width
    height: scale(24), // Responsive height
    marginRight: scale(10), // Responsive margin
  },
  emergencyButtonText: {
    fontSize: scale(21), // Responsive font size
    marginLeft: scale(20), // Responsive margin
    fontWeight: "700",
    flex: 1,
    color: "#000000",
  },
  emergencyButtonNumber: {
    fontSize: scale(24), // Responsive font size
    color: "#C92035",
    fontWeight: "700",
  },
  footerText: {
    fontSize: scale(12), // Responsive font size
    color: "#C92035",
    textAlign: "center",
    marginTop: scale(30), // Responsive margin
    paddingHorizontal: scale(18), // Responsive padding
  },
  backArrow: {
    width: scale(18), // Responsive width
    height: scale(18), // Responsive height
    marginRight: scale(5), // Responsive margin
    marginTop: scale(-26.5), // Responsive margin
  },
});
