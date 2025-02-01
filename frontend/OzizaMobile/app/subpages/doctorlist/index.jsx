import React from "react";
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
  const { specializationId, specializationText } = route.params;

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

  return (
    <View style={styles.container}>
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
                  specialization.id === specializationId
                    ? "#ADD8E6"
                    : "#F5F5F5",
              },
            ]}
          >
            <Text
              style={[
                styles.specializationText,
                {
                  color:
                    specialization.id === specializationId ? "#000" : "#666",
                },
              ]}
            >
              {specialization.text}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.recommendationsTitle}>Recommendations</Text>
      <ScrollView style={styles.doctorList}>
        {recommendedDoctors.map((doctor) => (
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
        {nearYouDoctors.map((doctor) => (
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
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  specializationText: {
    fontSize: 14,
    color: "#666",
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
