import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get("window");

// Responsive Font Size Function
const responsiveFontSize = (size) => {
  const scaleFactor = width / 375;
  const newSize = size * scaleFactor;
  return Math.round(newSize);
};

// Get safe area padding
const getSafeAreaTop = () => {
  return Platform.OS === "ios" ? 44 : 20;
};

export default function EmergencyServicesScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const emergencyServices = [
    {
      id: 1,
      name: "Ambulance",
      number: "112",
      icon: "ambulance",
      color: "#FF3B30",
      gradient: ["#FF5E3A", "#FF2A68"],
    },
    {
      id: 2,
      name: "Fire Service",
      number: "101",
      icon: "fire-extinguisher",
      color: "#FF9500",
      gradient: ["#FF9500", "#FF5E3A"],
    },
    {
      id: 3,
      name: "Police",
      number: "911",
      icon: "shield-alt",
      color: "#007AFF",
      gradient: ["#5AC8FA", "#007AFF"],
    },
  ];

  const additionalContacts = [
    {
      id: 1,
      name: "Poison Control",
      number: "1-800-222-1222",
      icon: "medkit",
      color: "#4CD964",
      iconFamily: "Ionicons",
    },
    {
      id: 2,
      name: "Nearest Hospital",
      number: "1-800-HOSPITAL",
      icon: "hospital",
      color: "#5856D6",
      iconFamily: "FontAwesome5",
    },
  ];

  // Function to handle phone calls
  const handleCall = async (number) => {
    setIsLoading(true);

    try {
      const phoneUrl = `tel:${number}`;
      const canOpen = await Linking.canOpenURL(phoneUrl);

      if (canOpen) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert(
          "Call Error",
          "Unable to initialize call function. Please dial manually: " + number,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error making call:", error);
      Alert.alert(
        "Call Error",
        "There was a problem making the call. Please try again or dial manually: " + number,
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm before making emergency calls
  const confirmCall = (service) => {
    Alert.alert(
      "Confirm Emergency Call",
      `Are you sure you want to call ${service.name} (${service.number})?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Call Now",
          style: "destructive",
          onPress: () => handleCall(service.number)
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#C92035" />

      <ScrollView style={styles.container} bounces={false}>
        {/* Header with gradient */}
        <LinearGradient
          colors={["#D82747", "#C92035"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push("/home")}
              disabled={isLoading}
            >
              <Ionicons name="arrow-back" size={responsiveFontSize(24)} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Emergency Services</Text>
          </View>

          <View style={styles.headerContent}>
            <View style={styles.emergencyIconContainer}>
              <Ionicons name="warning" size={responsiveFontSize(32)} color="#FFF" />
            </View>
            <Text style={styles.headerMainText}>
              Are you in an Emergency?
            </Text>
            <Text style={styles.headerSubText}>
              Tap any emergency service below to call for immediate assistance
            </Text>
          </View>
        </LinearGradient>

        {/* Emergency Services Buttons */}
        <View style={styles.servicesContainer}>
          {emergencyServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={() => confirmCall(service)}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <LinearGradient
                colors={service.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.serviceIconContainer}
              >
                <FontAwesome5 name={service.icon} size={responsiveFontSize(24)} color="#FFF" />
              </LinearGradient>

              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>
                  {service.name === "Ambulance"
                    ? "Medical emergencies & accidents"
                    : service.name === "Fire Service"
                      ? "Fire incidents & rescues"
                      : "Security & urgent assistance"}
                </Text>
              </View>

              <View style={styles.serviceNumberContainer}>
                <Text style={[styles.serviceNumber, { color: service.color }]}>
                  {service.number}
                </Text>
                <TouchableOpacity
                  style={[styles.callButton, { backgroundColor: service.color }]}
                  onPress={() => confirmCall(service)}
                  disabled={isLoading}
                >
                  <Ionicons name="call" size={responsiveFontSize(16)} color="#FFF" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Additional Information Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="information-circle" size={responsiveFontSize(24)} color="#C92035" />
          </View>
          <Text style={styles.infoTitle}>When you call</Text>
          <Text style={styles.infoText}>
            Please be specific about your emergency and provide clear location details to help emergency services reach you quickly.
          </Text>
        </View>

        {/* Additional Emergency Contacts */}
        <View style={styles.additionalContactsContainer}>
          <Text style={styles.contactsTitle}>Additional Emergency Contacts</Text>

          <View style={styles.contactsGrid}>
            {additionalContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={styles.contactItem}
                onPress={() => confirmCall(contact)}
                disabled={isLoading}
              >
                <View style={[styles.contactIcon, { backgroundColor: contact.color }]}>
                  {contact.iconFamily === "Ionicons" ? (
                    <Ionicons name={contact.icon} size={responsiveFontSize(20)} color="#FFF" />
                  ) : (
                    <FontAwesome5 name={contact.icon} size={responsiveFontSize(18)} color="#FFF" />
                  )}
                </View>
                <Text style={styles.contactText}>{contact.name}</Text>
                <Text style={styles.contactNumberText}>{contact.number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            In case of emergency, if this app fails to connect you, please directly dial the emergency number on your phone.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#C92035",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FC",
  },
  header: {
    paddingTop: Platform.OS === "android" ? getSafeAreaTop() : 0,
    paddingBottom: height * 0.06,
    borderBottomLeftRadius: width * 0.08,
    borderBottomRightRadius: width * 0.08,
    paddingHorizontal: width * 0.05,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  backButton: {
    padding: width * 0.02,
    borderRadius: width * 0.04,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: "700",
    color: "#FFF",
    marginLeft: width * 0.03,
  },
  headerContent: {
    alignItems: "center",
    paddingTop: height * 0.02,
    paddingBottom: height * 0.02,
  },
  emergencyIconContainer: {
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: width * 0.09,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  headerMainText: {
    fontSize: responsiveFontSize(24),
    fontWeight: "800",
    color: "#FFF",
    marginBottom: height * 0.01,
    textAlign: "center",
  },
  headerSubText: {
    fontSize: responsiveFontSize(14),
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    paddingHorizontal: width * 0.05,
  },
  servicesContainer: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.02,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: width * 0.04,
    marginBottom: height * 0.02,
    padding: width * 0.04,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  serviceIconContainer: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 0.04,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: responsiveFontSize(18),
    fontWeight: "700",
    color: "#333333",
    marginBottom: height * 0.005,
  },
  serviceDescription: {
    fontSize: responsiveFontSize(12),
    color: "#666666",
  },
  serviceNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceNumber: {
    fontSize: responsiveFontSize(22),
    fontWeight: "800",
    marginRight: width * 0.03,
  },
  callButton: {
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: width * 0.04,
    justifyContent: "center",
    alignItems: "center",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: width * 0.05,
    borderRadius: width * 0.04,
    padding: width * 0.05,
    marginBottom: height * 0.03,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.22,
    elevation: 2,
  },
  infoIconContainer: {
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  infoTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: "700",
    color: "#333333",
    textAlign: "center",
    marginBottom: height * 0.01,
  },
  infoText: {
    fontSize: responsiveFontSize(14),
    color: "#555555",
    textAlign: "center",
    lineHeight: responsiveFontSize(20),
  },
  additionalContactsContainer: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.02,
  },
  contactsTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: "700",
    color: "#333333",
    marginBottom: height * 0.02,
  },
  contactsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contactItem: {
    width: width * 0.43,
    backgroundColor: "#FFFFFF",
    borderRadius: width * 0.04,
    padding: width * 0.04,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.22,
    elevation: 2,
  },
  contactIcon: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  contactText: {
    fontSize: responsiveFontSize(14),
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
    marginBottom: height * 0.005,
  },
  contactNumberText: {
    fontSize: responsiveFontSize(12),
    color: "#666666",
    textAlign: "center",
  },
  disclaimerContainer: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.04,
    marginTop: height * 0.01,
  },
  disclaimerText: {
    fontSize: responsiveFontSize(12),
    color: "#777777",
    textAlign: "center",
    fontStyle: "italic",
  },
});