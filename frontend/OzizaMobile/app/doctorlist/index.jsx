import React, { useState, useEffect, useCallback } from "react";
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
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

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

const DoctorListScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedSpecializationId, setSelectedSpecializationId] = useState(null);
  const [selectedSpecializationText, setSelectedSpecializationText] = useState("");
  const [filteredRecommendedDoctors, setFilteredRecommendedDoctors] = useState([]);
  const [filteredNearYouDoctors, setFilteredNearYouDoctors] = useState([]);

  const SELECTED_COLOR = "#3C53EC";
  const NOT_SELECTED_COLOR = "#20736C";

  const specializations = [
    { id: 1, text: "Physiotherapy" },
    { id: 2, text: "Dentist" },
    { id: 3, text: "Cardiologist" },
    { id: 4, text: "Pediatrician" },
    { id: 5, text: "Optometrist" },
    { id: 6, text: "Herbal Doctor" },
  ];

  const recommendedDoctors = [
    {
      id: 1,
      name: "Dr. John Doe",
      specialization: "Physiotherapy",
      image: require("../../assets/images/doctor1.png"),
      location: "2.5 km away",
    },
    {
      id: 2,
      name: "Dr. John Smith",
      specialization: "Physiotherapy",
      image: require("../../assets/images/doctor2.png"),
      location: "5.1 km away",
    },
    {
      id: 3,
      name: "Dr. Bob Johnson",
      specialization: "Dentist",
      image: require("../../assets/images/doctor3.png"),
      location: "1.2 km away",
    },
    {
      id: 4,
      name: "Dr. Alice Brown",
      specialization: "Cardiologist",
      image: require("../../assets/images/doctor4.png"),
      location: "3.8 km away",
    },
    {
      id: 5,
      name: "Dr. Mike Davis",
      specialization: "Pediatrician",
      image: require("../../assets/images/doctor5.png"),
      location: "4.5 km away",
    },
  ];

  const nearYouDoctors = [
    {
      id: 6,
      name: "Dr. Sarah Wilson",
      specialization: "Optometrist",
      image: require("../../assets/images/doctor4.png"),
      location: "0.8 km away",
    },
    {
      id: 7,
      name: "Dr. James Miller",
      specialization: "Herbal Doctor",
      image: require("../../assets/images/doctor3.png"),
      location: "2.1 km away",
    },
  ];

  const getSpecializationIcon = (specializationText) => {
    switch (specializationText.toLowerCase()) {
      case "physiotherapy":
        return require("../../assets/images/physiotherapy.png");
      case "dentist":
        return require("../../assets/images/dentist.png");
      case "cardiologist":
        return require("../../assets/images/cardiologist.png");
      case "pediatrician":
        return require("../../assets/images/pediatrician.png");
      case "optometrist":
        return require("../../assets/images/optometrist.png");
      case "herbal doctor":
        return require("../../assets/images/herbal-doctor.png");
      default:
        return require("../../assets/images/dentist.png");
    }
  };

  const filterDoctors = useCallback((id) => {
    if (id) {
      const specialization = specializations.find((spec) => spec.id === id);
      const filteredRecommended = recommendedDoctors.filter(
        (doctor) => doctor.specialization.toLowerCase() === specialization.text.toLowerCase()
      );
      const filteredNearYou = nearYouDoctors.filter(
        (doctor) => doctor.specialization.toLowerCase() === specialization.text.toLowerCase()
      );
      setFilteredRecommendedDoctors(filteredRecommended);
      setFilteredNearYouDoctors(filteredNearYou);
    } else {
      setFilteredRecommendedDoctors(recommendedDoctors);
      setFilteredNearYouDoctors(nearYouDoctors);
    }
  }, [recommendedDoctors, nearYouDoctors, specializations]);

  useEffect(() => {
    if (params.specializationId) {
      const id = Number(params.specializationId);
      const text = params.specializationText || "";
      setSelectedSpecializationId(id);
      setSelectedSpecializationText(text);
      filterDoctors(id);
    } else {
      setFilteredRecommendedDoctors(recommendedDoctors);
      setFilteredNearYouDoctors(nearYouDoctors);
    }
  }, [params.specializationId]);

  const handleSpecializationPress = useCallback((id, text) => {
    setSelectedSpecializationId(id);
    setSelectedSpecializationText(text);
    filterDoctors(id);
  }, [filterDoctors]);

  const renderDoctorCard = (doctor) => (
    <TouchableOpacity
      key={doctor.id}
      style={styles.doctorCard}
      onPress={() => console.log(`Doctor ${doctor.name} pressed`)}
    >
      <Image source={doctor.image} style={styles.doctorImage} />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.doctorSpecialization}>{doctor.specialization}</Text>
        <View style={styles.locationContainer}>
          <AntDesign
            name="enviromento"
            size={Math.round(width * 0.04)}
            color="#666"
          />
          <Text style={styles.locationText}>{doctor.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/findoctor")}
          >
            <Image
              source={require("../../assets/images/back-arrow.png")}
              style={styles.backArrow}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Find a Doctor</Text>
        </View>

        <Text style={styles.filterTitle}>Filter by Specialization</Text>
        <ScrollView
          horizontal
          style={styles.specializationList}
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity
            style={[
              styles.specializationButton,
              {
                backgroundColor:
                  selectedSpecializationId === null
                    ? SELECTED_COLOR
                    : NOT_SELECTED_COLOR,
                paddingHorizontal: width * 0.05,
              },
            ]}
            onPress={() => handleSpecializationPress(null, "All")}
          >
            <Text style={styles.specializationText}>All</Text>
          </TouchableOpacity>

          {specializations.map((specialization) => (
            <TouchableOpacity
              key={specialization.id}
              style={[
                styles.specializationButton,
                {
                  backgroundColor:
                    selectedSpecializationId === specialization.id
                      ? SELECTED_COLOR
                      : NOT_SELECTED_COLOR,
                },
              ]}
              onPress={() => handleSpecializationPress(specialization.id, specialization.text)}
            >
              <View style={styles.specializationIconTextContainer}>
                <Image
                  source={getSpecializationIcon(specialization.text)}
                  style={styles.specializationIcon}
                />
                <Text style={styles.specializationText}>
                  {specialization.text}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          <View>
            {filteredRecommendedDoctors.map(renderDoctorCard)}
          </View>
        </View>

        <View style={[styles.sectionContainer, { marginBottom: height * 0.03 }]}>
          <Text style={styles.sectionTitle}>Doctors Near You</Text>
          <View>
            {filteredNearYouDoctors.map(renderDoctorCard)}
          </View>
        </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E2E4EA',
  },
  backButton: {
    padding: width * 0.02,
  },
  backArrow: {
    width: width * 0.05,
    height: width * 0.05,
    marginRight: width * 0.02,
  },
  title: {
    fontSize: responsiveFontSize(17),
    fontWeight: "bold",
    marginLeft: width * 0.03,
  },
  filterTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: "bold",
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
  },
  specializationList: {
    marginTop: height * 0.01,
    paddingHorizontal: width * 0.05,
  },
  specializationButton: {
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.02,
    marginRight: width * 0.03,
    height: height * 0.06,
    justifyContent: "center",
  },
  specializationIconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  specializationIcon: {
    width: width * 0.06,
    height: width * 0.06,
    marginRight: width * 0.02,
  },
  specializationText: {
    fontSize: responsiveFontSize(15),
    fontWeight: "800",
    color: "#FFFFFF",
  },
  sectionContainer: {
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.02,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: "bold",
    marginBottom: height * 0.02,
  },
  doctorCard: {
    flexDirection: "row",
    backgroundColor: "#E2E4EA",
    padding: width * 0.04,
    borderRadius: width * 0.02,
    marginBottom: height * 0.015,
    alignItems: "center",
  },
  doctorImage: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.02,
    marginRight: width * 0.04,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: responsiveFontSize(16),
    fontWeight: "bold",
    marginBottom: height * 0.005,
  },
  doctorSpecialization: {
    fontSize: responsiveFontSize(14),
    color: "#666",
    marginBottom: height * 0.005,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: responsiveFontSize(14),
    color: "#666",
    marginLeft: width * 0.02,
  },
});

export default DoctorListScreen;