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

const DoctorListScreen = ({ route, navigation }) => {
  const { specializationId, specializationText } = route?.params || {};
  const [selectedSpecializationId, setSelectedSpecializationId] = useState(
    specializationId || null
  );
  const [filteredRecommendedDoctors, setFilteredRecommendedDoctors] = useState(
    []
  );
  const [filteredNearYouDoctors, setFilteredNearYouDoctors] = useState([]);

  const SELECTED_COLOR = "#3C53EC";
  const NOT_SELECTED_COLOR = "#20736C";
  const TEXT_COLOR = "#FFFFFF";

  const specializations = [
    {
      id: 1,
      text: "Physiotherapy",
    },
    {
      id: 2,
      text: "Dentist",
    },
    {
      id: 3,
      text: "Cardiologist",
    },
    {
      id: 4,
      text: "Pediatrician",
    },
    {
      id: 5,
      text: "Optometrist",
    },
    {
      id: 6,
      text: "Herbal Doctor",
    },
  ];

  const recommendedDoctors = [
    {
      id: 1,
      name: "Dr. John Doe",
      specialization: "Physiotherapy",
      image: require("../../../assets/images/doctor1.png"),
      location: "2.5 km away",
    },
    {
      id: 2,
      name: "Dr. Jane Smith",
      specialization: "Physiotherapy",
      image: require("../../../assets/images/doctor2.png"),
      location: "5.1 km away",
    },
  ];

  const nearYouDoctors = [
    {
      id: 3,
      name: "Dr. Bob Johnson",
      specialization: "Dentist",
      image: require("../../../assets/images/doctor3.png"),
      location: "1.2 km away",
    },
    {
      id: 4,
      name: "Dr. Alice Brown",
      specialization: "Cardiologist",
      image: require("../../../assets/images/doctor4.png"),
      location: "3.8 km away",
    },
    {
      id: 5,
      name: "Dr. Mike Davis",
      specialization: "Pediatrician",
      image: require("../../../assets/images/doctor5.png"),
      location: "4.5 km away",
    },
  ];

  const getSpecializationIcon = (specializationText) => {
    switch (specializationText.toLowerCase()) {
      case "physiotherapy":
        return require("../../../assets/images/physiotherapy.png");
      case "dentist":
        return require("../../../assets/images/dentist.png");
      case "cardiologist":
        return require("../../../assets/images/cardiologist.png");
      case "pediatrician":
        return require("../../../assets/images/pediatrician.png");
      case "optometrist":
        return require("../../../assets/images/optometrist.png");
      case "herbal doctor":
        return require("../../../assets/images/herbal-doctor.png");
      default:
        return require("../../../assets/images/dentist.png");
    }
  };

  const handleSpecializationPress = (id) => {
    setSelectedSpecializationId(id);
    filterDoctors(id);
  };

  const filterDoctors = (id) => {
    if (id) {
      const filteredRecommended = recommendedDoctors.filter((doctor) => {
        const specialization = specializations.find((spec) => spec.id === id);
        return (
          doctor.specialization.toLowerCase() ===
          specialization.text.toLowerCase()
        );
      });
      const filteredNearYou = nearYouDoctors.filter((doctor) => {
        const specialization = specializations.find((spec) => spec.id === id);
        return (
          doctor.specialization.toLowerCase() ===
          specialization.text.toLowerCase()
        );
      });
      setFilteredRecommendedDoctors(filteredRecommended);
      setFilteredNearYouDoctors(filteredNearYou);
    } else {
      setFilteredRecommendedDoctors(recommendedDoctors);
      setFilteredNearYouDoctors(nearYouDoctors);
    }
  };

  // Initialize filtered doctors on mount
  React.useEffect(() => {
    if (specializationId) {
      filterDoctors(specializationId);
    } else {
      setFilteredRecommendedDoctors(recommendedDoctors);
      setFilteredNearYouDoctors(nearYouDoctors);
    }
  }, [specializationId]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Find a Doctor</Text>
      </View>

      <Text style={styles.filterTitle}>Filter by Specialization</Text>
      <ScrollView horizontal style={styles.specializationList}>
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
            onPress={() => handleSpecializationPress(specialization.id)}
          >
            <View style={styles.specializationIconTextContainer}>
              <Image
                source={getSpecializationIcon(specialization.text)}
                style={styles.specializationIcon}
              />
              <Text
                style={[
                  styles.specializationText,
                  {
                    color:
                      selectedSpecializationId === specialization.id
                        ? TEXT_COLOR
                        : "#000",
                  },
                ]}
              >
                {specialization.text}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[
            styles.specializationButton,
            {
              backgroundColor:
                selectedSpecializationId === null
                  ? SELECTED_COLOR
                  : NOT_SELECTED_COLOR,
            },
          ]}
          onPress={() => handleSpecializationPress(null)}
        >
          <Text
            style={[
              styles.specializationText,
              {
                color: selectedSpecializationId === null ? TEXT_COLOR : "#000",
              },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Text style={styles.recommendationsTitle}>Recommendations</Text>
      <ScrollView style={styles.doctorList}>
        {filteredRecommendedDoctors.map((doctor) => (
          <TouchableOpacity key={doctor.id} style={styles.doctorButton}>
            <Image source={doctor.image} style={styles.doctorImage} />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.doctorSpecialization}>
                {doctor.specialization}
              </Text>
              <View style={styles.locationContainer}>
                <AntDesign name="enviromento" size={16} color="#666" />
                <Text style={styles.locationText}>{doctor.location}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.nearYouTitle}>Doctors Near You</Text>
      <ScrollView style={styles.doctorList}>
        {filteredNearYouDoctors.map((doctor) => (
          <TouchableOpacity key={doctor.id} style={styles.doctorButton}>
            <Image source={doctor.image} style={styles.doctorImage} />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.doctorSpecialization}>
                {doctor.specialization}
              </Text>
              <View style={styles.locationContainer}>
                <AntDesign name="enviromento" size={16} color="#666" />
                <Text style={styles.locationText}>{doctor.location}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 15,
  },
  specializationList: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  specializationButton: {
    paddingHorizontal: 10, // Adjusted for icon and text
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  specializationIconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10, // Adjust based on your icon size and button padding
  },
  specializationIcon: {
    width: 20, // Adjust the size based on your icon
    height: 20, // Adjust the size based on your icon
    marginRight: 8, // Space between icon and text
  },
  specializationText: {
    fontSize: 14,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 20,
  },
  doctorList: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  doctorButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  doctorSpecialization: {
    fontSize: 14,
    color: "#666",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  nearYouTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 25,
  },
});

export default DoctorListScreen;
