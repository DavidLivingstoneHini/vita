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
  Modal,
  Linking,
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
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
      phone: "+233554317356",
      experience: "10 years",
      rating: "4.8",
      fee: "Ghc 100",
      about: "Specialized in sports injuries and rehabilitation with extensive experience in treating athletes.",
    },
    {
      id: 2,
      name: "Dr. John Smith",
      specialization: "Physiotherapy",
      image: require("../../assets/images/doctor2.png"),
      location: "5.1 km away",
      phone: "+233554317356",
      experience: "8 years",
      rating: "4.6",
      fee: "Ghc 90",
      about: "Expert in post-surgical rehabilitation and chronic pain management.",
    },
    {
      id: 3,
      name: "Dr. Bob Johnson",
      specialization: "Dentist",
      image: require("../../assets/images/doctor3.png"),
      location: "1.2 km away",
      phone: "+233554317356",
      experience: "12 years",
      rating: "4.9",
      fee: "Ghc 120",
      about: "Specializes in cosmetic dentistry and dental implants with a gentle approach.",
    },
    {
      id: 4,
      name: "Dr. Alice Brown",
      specialization: "Cardiologist",
      image: require("../../assets/images/doctor4.png"),
      location: "3.8 km away",
      phone: "+233554317356",
      experience: "15 years",
      rating: "5.0",
      fee: "Ghc 150",
      about: "Cardiac specialist with expertise in preventive cardiology and heart failure management.",
    },
    {
      id: 5,
      name: "Dr. Mike Davis",
      specialization: "Pediatrician",
      image: require("../../assets/images/doctor5.png"),
      location: "4.5 km away",
      phone: "+233554317356",
      experience: "9 years",
      rating: "4.7",
      fee: "Ghc 110",
      about: "Caring and compassionate pediatrician specializing in newborn care and adolescent health.",
    },
  ];

  const nearYouDoctors = [
    {
      id: 6,
      name: "Dr. Sarah Wilson",
      specialization: "Optometrist",
      image: require("../../assets/images/doctor4.png"),
      location: "0.8 km away",
      phone: "+233554317356",
      experience: "7 years",
      rating: "4.5",
      fee: "Ghc 85",
      about: "Expert in comprehensive eye exams and contact lens fittings with a focus on myopia control.",
    },
    {
      id: 7,
      name: "Dr. James Miller",
      specialization: "Herbal Doctor",
      image: require("../../assets/images/doctor3.png"),
      location: "2.1 km away",
      phone: "+233554317356",
      experience: "11 years",
      rating: "4.9",
      fee: "Ghc 95",
      about: "Practitioner of traditional herbal medicine with a holistic approach to health and wellness.",
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

  const handleDoctorPress = (doctor) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

  const handleCallPress = () => {
    if (selectedDoctor?.phone) {
      Linking.openURL(`tel:${selectedDoctor.phone}`);
    }
  };

  const renderDoctorCard = (doctor) => (
    <TouchableOpacity
      key={doctor.id}
      style={styles.doctorCard}
      onPress={() => handleDoctorPress(doctor)}
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

      {/* Doctor Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedDoctor && (
              <>
                <View style={styles.modalTopBar}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <AntDesign
                      name="closecircle"
                      size={width * 0.07}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalHeader}>
                  <Image source={selectedDoctor.image} style={styles.modalDoctorImage} />
                  <View style={styles.modalHeaderText}>
                    <Text style={styles.modalDoctorName}>{selectedDoctor.name}</Text>
                    <Text style={styles.modalDoctorSpecialization}>{selectedDoctor.specialization}</Text>
                    <View style={styles.modalLocationContainer}>
                      <AntDesign
                        name="enviromento"
                        size={Math.round(width * 0.04)}
                        color="#666"
                      />
                      <Text style={styles.modalLocationText}>{selectedDoctor.location}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Experience:</Text>
                    <Text style={styles.detailValue}>{selectedDoctor.experience}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Rating:</Text>
                    <Text style={styles.detailValue}>{selectedDoctor.rating}/5</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Consultation Fee:</Text>
                    <Text style={styles.detailValue}>{selectedDoctor.fee}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phone:</Text>
                    <Text style={styles.detailValue}>{selectedDoctor.phone}</Text>
                  </View>

                  <View style={styles.aboutSection}>
                    <Text style={styles.aboutTitle}>About Doctor</Text>
                    <Text style={styles.aboutText}>{selectedDoctor.about}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.fullWidthButton}
                  onPress={handleCallPress}
                >
                  <Text style={styles.fullWidthButtonText}>Call to Book Appointment</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: "white",
    borderRadius: width * 0.05,
    padding: width * 0.05,
    maxHeight: height * 0.8,
  },
  modalTopBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: height * 0.01,
  },
  closeButton: {
    padding: width * 0.02,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  modalDoctorImage: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    marginRight: width * 0.04,
  },
  modalHeaderText: {
    flex: 1,
  },
  modalDoctorName: {
    fontSize: responsiveFontSize(18),
    fontWeight: "bold",
    marginBottom: height * 0.005,
  },
  modalDoctorSpecialization: {
    fontSize: responsiveFontSize(16),
    color: "#666",
    marginBottom: height * 0.005,
  },
  modalLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalLocationText: {
    fontSize: responsiveFontSize(14),
    color: "#666",
    marginLeft: width * 0.02,
  },
  modalDetails: {
    marginVertical: height * 0.02,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.01,
    paddingVertical: height * 0.005,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E4EA",
  },
  detailLabel: {
    fontSize: responsiveFontSize(15),
    fontWeight: "600",
    color: "#333",
  },
  detailValue: {
    fontSize: responsiveFontSize(15),
    color: "#666",
  },
  aboutSection: {
    marginTop: height * 0.02,
  },
  aboutTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: "bold",
    marginBottom: height * 0.01,
    color: "#333",
  },
  aboutText: {
    fontSize: responsiveFontSize(14),
    color: "#666",
    lineHeight: height * 0.025,
  },
  fullWidthButton: {
    width: '100%',
    backgroundColor: "#3C53EC",
    paddingVertical: height * 0.02,
    borderRadius: width * 0.02,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.02,
  },
  fullWidthButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: responsiveFontSize(15),
  },
});

export default DoctorListScreen;