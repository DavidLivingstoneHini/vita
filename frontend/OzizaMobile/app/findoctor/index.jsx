import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

const FindDoctorScreen = ({ navigation }) => {
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);

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
      navigation.navigate("DoctorList", {
        specializationId: selectedSpecialization,
      });
    } else {
      alert("Please select a specialization");
    }
  };

  return (
    <View style={styles.container}>
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
          Pick the the type of specialist you need for us to recommend you the
          right doctor{" "}
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
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
  },
  scrollView: {
    padding: 20,
  },
  specializationTitle: {
    fontSize: 17,
    fontWeight: 800,
    marginTop: 18,
    marginBottom: 5,
  },
  specializationSubtitle: {
    fontSize: 14,
    fontWeight: 400,
    color: "#000000",
    marginBottom: 30,
  },
  specializationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
    height: 72,
  },
  iconContainer: {
    width: 32,
    height: 32,
    backgroundColor: "#fff",
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  specializationIcon: {
    width: 24,
    height: 22,
  },
  specializationText: {
    fontSize: 15,
    fontWeight: 700,
  },
  findDoctorButton: {
    backgroundColor: "#032825",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    height: 45,
    fontWeight: 400,
  },
  findDoctorText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  backArrow: {
    width: 18,
    height: 18,
    marginRight: 5,
  },
});

export default FindDoctorScreen;
