import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function EmergencyServicesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Home</Text>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.subHeaderText}>Emergency Services</Text>
          <Text style={styles.subSubHeaderText}>
            Quickly get help in emergency situations
          </Text>
        </View>
      </View>

      {/* Emergency Services Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.emergencyButton}>
          <Image
            source={require("../../../assets/images/ambulance-icon.png")}
            style={styles.buttonIcon}
          />
          <Text style={styles.emergencyButtonText}>Ambulance</Text>
          <Text style={styles.emergencyButtonNumber}>112</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emergencyButton}>
          <Image
            source={require("../../../assets/images/firetruck.png")}
            style={styles.buttonIcon}
          />{" "}
          <Text style={styles.emergencyButtonText}>Fire Service</Text>
          <Text style={styles.emergencyButtonNumber}>101</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emergencyButton}>
          <Image
            source={require("../../../assets/images/police-icon.png")}
            style={styles.buttonIcon}
          />
          <Text style={styles.emergencyButtonText}>Police</Text>
          <Text style={styles.emergencyButtonNumber}>911</Text>
        </TouchableOpacity>
      </View>

      {/* Red Text at the Bottom */}
      <Text style={styles.footerText}>
        In case of emergency, call the numbers above.
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
    backgroundColor: "red",
    borderBottomLeftRadius: "100%",
    borderBottomRightRadius: "100%",
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
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
  headerCenter: {
    alignItems: "center",
    marginTop: -5,
  },
  subHeaderText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
  subSubHeaderText: {
    fontSize: 12,
    color: "#fff",
  },
  buttonsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  emergencyButtonText: {
    fontSize: 16,
    flex: 1,
    color: "red",
  },
  emergencyButtonNumber: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 14,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
