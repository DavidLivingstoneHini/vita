import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

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
            Are you in an Emergency Do you need help
          </Text>
          <Text style={styles.subSubHeaderText}>
            Tap the required emergency service to call them or use their
            official help numbers{" "}
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
          />{" "}
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
        locate you{" "}
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
    borderBottomLeftRadius: 170,
    borderBottomRightRadius: 170,
    paddingVertical: 30,
    paddingHorizontal: 20,
    flexDirection: "column",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
    marginBottom: 40,
  },
  headerCenter: {
    alignItems: "center",
    marginTop: -5,
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: 700,
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  subSubHeaderText: {
    fontSize: 10,
    fontWeight: 500,
    color: "#fff",
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  buttonsContainer: {
    marginTop: 50,
    paddingHorizontal: 20,
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    height: 88,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#C92035",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  emergencyButtonText: {
    fontSize: 21,
    marginLeft: 20,
    fontWeight: 700,
    flex: 1,
    color: "#000000",
  },
  emergencyButtonNumber: {
    fontSize: 24,
    color: "#C92035",
    fontWeight: 700,
  },
  footerText: {
    fontSize: 12,
    color: "#C92035",
    textAlign: "center",
    marginTop: 30,
    paddingHorizontal: 18,
  },
  backArrow: {
    width: 18,
    height: 18,
    marginRight: 5,
    marginTop: -26.5,
  },
});
