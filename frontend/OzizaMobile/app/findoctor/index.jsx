import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

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

const FindDoctorScreen = () => {
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const navigation = useNavigation();

  const specializations = [
    {
      id: 1,
      icon: require("../../assets/images/physiotherapy.png"),
      text: "Physiotherapy",
    },
    {
      id: 2,
      icon: require("../../assets/images/dentist.png"),
      text: "Dentist",
    },
    {
      id: 3,
      icon: require("../../assets/images/cardiologist.png"),
      text: "Cardiologist",
    },
    {
      id: 4,
      icon: require("../../assets/images/pediatrician.png"),
      text: "Pediatrician",
    },
    {
      id: 5,
      icon: require("../../assets/images/optometrist.png"),
      text: "Optometrist",
    },
    {
      id: 6,
      icon: require("../../assets/images/herbal-doctor.png"),
      text: "Herbal Doctor",
    },
  ];

  const handleSpecializationPress = (id) => {
    setSelectedSpecialization(id);
  };

  const handleFindDoctorPress = () => {
    if (selectedSpecialization) {
      // Navigate to doctor list with selected specialization
      // navigation.navigate("doctorlist/index");
      navigation.navigate("doctorlist/index", {
        specializationId: selectedSpecialization,
      });
    } else {
      alert("Please select a specialization");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../../assets/images/back-arrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Find a Doctor</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.specializationTitle}>Select Specialization</Text>
        <Text style={styles.specializationSubtitle}>
          Pick the type of specialist you need for us to recommend you the right
          doctor
        </Text>

        {specializations.map((specialization) => (
          <TouchableOpacity
            key={specialization.id}
            onPress={() => handleSpecializationPress(specialization.id)}
            style={[
              styles.specializationButton,
              {
                backgroundColor:
                  selectedSpecialization === specialization.id
                    ? "#ADD8E6"
                    : "#F5F5F5",
              },
            ]}
          >
            <View style={styles.iconContainer}>
              <Image
                source={specialization.icon}
                style={styles.specializationIcon}
              />
            </View>
            <Text style={styles.specializationText}>{specialization.text}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.findDoctorButton}
          onPress={handleFindDoctorPress}
        >
          <Text style={styles.findDoctorText}>Find a Doctor</Text>
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
  header: {
    paddingVertical: height * 0.02, // Responsive padding (2% of screen height)
    paddingHorizontal: width * 0.05, // Responsive padding (5% of screen width)
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: responsiveFontSize(17), // Responsive font size
    fontWeight: "bold",
    marginLeft: width * 0.03, // Responsive margin (3% of screen width)
  },
  scrollView: {
    paddingHorizontal: width * 0.05, // Responsive padding (5% of screen width)
    paddingVertical: height * 0.02, // Responsive padding (2% of screen height)
  },
  specializationTitle: {
    fontSize: responsiveFontSize(17), // Responsive font size
    fontWeight: "800",
    marginTop: height * 0.02, // Responsive margin (2% of screen height)
    marginBottom: height * 0.01, // Responsive margin (1% of screen height)
  },
  specializationSubtitle: {
    fontSize: responsiveFontSize(14), // Responsive font size
    fontWeight: "400",
    color: "#000000",
    marginBottom: height * 0.03, // Responsive margin (3% of screen height)
  },
  specializationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.015, // Responsive padding (1.5% of screen height)
    paddingHorizontal: width * 0.04, // Responsive padding (4% of screen width)
    marginBottom: height * 0.015, // Responsive margin (1.5% of screen height)
    borderRadius: width * 0.02, // Responsive border radius (2% of screen width)
    height: height * 0.09, // Responsive height (9% of screen height)
  },
  iconContainer: {
    width: width * 0.08, // Responsive width (8% of screen width)
    height: width * 0.08, // Responsive height (8% of screen width)
    backgroundColor: "#fff",
    borderRadius: width * 0.01, // Responsive border radius (1% of screen width)
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 0.03, // Responsive margin (3% of screen width)
  },
  specializationIcon: {
    width: width * 0.06, // Responsive width (6% of screen width)
    height: width * 0.055, // Responsive height (5.5% of screen width)
  },
  specializationText: {
    fontSize: responsiveFontSize(15), // Responsive font size
    fontWeight: "700",
  },
  findDoctorButton: {
    backgroundColor: "#032825",
    paddingVertical: height * 0.015, // Responsive padding (1.5% of screen height)
    paddingHorizontal: width * 0.05, // Responsive padding (5% of screen width)
    borderRadius: width * 0.02, // Responsive border radius (2% of screen width)
    marginTop: height * 0.03, // Responsive margin (3% of screen height)
    height: height * 0.06, // Responsive height (6% of screen height)
    justifyContent: "center",
    alignItems: "center",
  },
  findDoctorText: {
    fontSize: responsiveFontSize(16), // Responsive font size
    color: "#fff",
    fontWeight: "400",
  },
  backArrow: {
    width: width * 0.05, // Responsive width (5% of screen width)
    height: width * 0.05, // Responsive height (5% of screen width)
    marginRight: width * 0.02, // Responsive margin (2% of screen width)
  },
});

export default FindDoctorScreen;