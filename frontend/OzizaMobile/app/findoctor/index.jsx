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
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

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

const FindDoctorScreen = () => {
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [selectedSpecializationText, setSelectedSpecializationText] = useState("");
  const router = useRouter();

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

  const handleSpecializationPress = (id, text) => {
    setSelectedSpecialization(id);
    setSelectedSpecializationText(text);
  };

  const handleFindDoctorPress = () => {
    if (selectedSpecialization) {
      router.push({
        pathname: "/doctorlist",
        params: {
          specializationId: selectedSpecialization,
          specializationText: selectedSpecializationText,
        },
      });
    } else {
      alert("Please select a specialization");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
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
            onPress={() => handleSpecializationPress(specialization.id, specialization.text)}
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
    paddingTop: getSafeAreaTop(),
  },
  header: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: responsiveFontSize(17),
    fontWeight: "bold",
    marginLeft: width * 0.03,
  },
  scrollView: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  specializationTitle: {
    fontSize: responsiveFontSize(17),
    fontWeight: "800",
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
  },
  specializationSubtitle: {
    fontSize: responsiveFontSize(14),
    fontWeight: "400",
    color: "#000000",
    marginBottom: height * 0.03,
  },
  specializationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.015,
    borderRadius: width * 0.02,
    height: height * 0.09,
  },
  iconContainer: {
    width: width * 0.08,
    height: width * 0.08,
    backgroundColor: "#fff",
    borderRadius: width * 0.01,
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 0.03,
  },
  specializationIcon: {
    width: width * 0.06,
    height: width * 0.055,
  },
  specializationText: {
    fontSize: responsiveFontSize(15),
    fontWeight: "700",
  },
  findDoctorButton: {
    backgroundColor: "#032825",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    borderRadius: width * 0.02,
    marginTop: height * 0.03,
    height: height * 0.06,
    justifyContent: "center",
    alignItems: "center",
  },
  findDoctorText: {
    fontSize: responsiveFontSize(16),
    color: "#fff",
    fontWeight: "400",
  },
  backArrow: {
    width: width * 0.05,
    height: width * 0.05,
    marginRight: width * 0.02,
  },
});

export default FindDoctorScreen;