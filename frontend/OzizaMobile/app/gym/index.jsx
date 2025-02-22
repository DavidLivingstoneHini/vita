import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
} from "react-native";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

// Responsive Font Size Function
const responsiveFontSize = (size) => {
  const scaleFactor = width / 375; // Base width of 375 (iPhone SE)
  const newSize = size * scaleFactor;
  return Math.ceil(newSize); // Round to nearest whole number
};

// Function to get safe area top padding
const getSafeAreaTop = () => {
  if (Platform.OS === "ios") {
    return 40; // Adjust for iOS
  }
  return 20; // Default for Android
};

const FindAGymScreen = ({ navigation }) => {
  const trainingTypes = [
    {
      id: 1,
      name: "Lifting",
      image: require("../../assets/images/lifting.png"),
      backgroundColor: "#FFC080",
    },
    {
      id: 2,
      name: "Cardio",
      image: require("../../assets/images/cardio.png"),
      backgroundColor: "#C9E4CA",
    },
    {
      id: 3,
      name: "Yoga",
      image: require("../../assets/images/yoga.png"),
      backgroundColor: "#FF99CC",
    },
    {
      id: 4,
      name: "Pilates",
      image: require("../../assets/images/yoga.png"),
      backgroundColor: "#CCCCFF",
    },
  ];

  const gymsNearYou = [
    {
      id: 1,
      name: "Gym 1",
      location: "123 Main St, Anytown USA",
      workingHours: "7:00am - 10:00pm",
    },
    {
      id: 2,
      name: "Gym 2",
      location: "456 Elm St, Anytown USA",
      workingHours: "8:00am - 9:00pm",
    },
    {
      id: 3,
      name: "Gym 3",
      location: "789 Oak St, Anytown USA",
      workingHours: "6:00am - 11:00pm",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../../assets/images/back-arrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Find a Gym</Text>
      </View>

      {/* Ready to get fit */}
      <Text style={styles.readyToFitTitle}>Ready to get fit</Text>
      <Text style={styles.readyToFitSubtitle}>
        Let’s find you a place to workout{" "}
      </Text>

      {/* Explore by Training Type */}
      <Text style={styles.sectionTitle}>Explore by Training Type</Text>
      <ScrollView
        horizontal
        style={styles.trainingTypeList}
        showsHorizontalScrollIndicator={false}
      >
        {trainingTypes.map((trainingType) => (
          <View
            key={trainingType.id}
            style={[
              styles.trainingTypeCard,
              { backgroundColor: trainingType.backgroundColor },
            ]}
          >
            <Text style={styles.trainingTypeName}>{trainingType.name}</Text>
            <Image
              source={trainingType.image}
              style={styles.trainingTypeImage}
            />
          </View>
        ))}
      </ScrollView>

      {/* Gyms near you */}
      <Text style={styles.sectionTitle}>Gyms near you</Text>
      <FlatList
        data={gymsNearYou}
        renderItem={({ item }) => (
          <View style={styles.gymListitem}>
            <View style={styles.gymInfo}>
              <Text style={styles.gymName}>{item.name}</Text>
              <Text style={styles.gymLocation}>{item.location}</Text>
            </View>
            <Text style={styles.gymWorkingHours}>{item.workingHours}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: getSafeAreaTop(), // Add safe area padding
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.02, // 2% of screen height for vertical padding
    paddingHorizontal: width * 0.04, // 4% of screen width for horizontal padding
  },
  backArrow: {
    width: width * 0.05, // Responsive width (5% of screen width)
    height: width * 0.05, // Responsive height (5% of screen width)
    marginRight: width * 0.02, // Responsive margin (2% of screen width)
  },
  title: {
    fontSize: responsiveFontSize(20), // Use responsive font size
    fontWeight: "800",
  },
  readyToFitTitle: {
    fontSize: responsiveFontSize(18), // Use responsive font size
    fontWeight: "800",
    marginHorizontal: width * 0.04, // Responsive margin
    marginTop: height * 0.02, // Responsive margin
  },
  readyToFitSubtitle: {
    fontSize: responsiveFontSize(16), // Use responsive font size
    fontWeight: "200",
    color: "#666",
    marginHorizontal: width * 0.04, // Responsive margin
    marginBottom: height * 0.02, // Responsive margin
  },
  sectionTitle: {
    fontSize: responsiveFontSize(18), // Use responsive font size
    fontWeight: "700",
    marginHorizontal: width * 0.04, // Responsive margin
    marginTop: height * 0.02, // Responsive margin
  },
  trainingTypeList: {
    paddingVertical: height * 0.02, // Responsive padding
    paddingHorizontal: width * 0.04, // Responsive padding
  },
  trainingTypeCard: {
    width: width * 0.35, // Responsive width (35% of screen width)
    height: width * 0.4, // Responsive height (40% of screen width)
    marginRight: width * 0.02, // Responsive margin
    borderRadius: 10,
    padding: width * 0.02, // Responsive padding
  },
  trainingTypeName: {
    fontSize: responsiveFontSize(14), // Use responsive font size
    fontWeight: "700",
    marginBottom: height * 0.01, // Responsive margin
  },
  trainingTypeImage: {
    width: "80%",
    height: "80%",
    borderRadius: 10,
    marginLeft: width * 0.02, // Responsive margin
  },
  gymListitem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.02, // Responsive padding
    paddingHorizontal: width * 0.04, // Responsive padding
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  gymInfo: {
    flex: 1,
  },
  gymName: {
    fontSize: responsiveFontSize(16), // Use responsive font size
    fontWeight: "bold",
  },
  gymLocation: {
    fontSize: responsiveFontSize(14), // Use responsive font size
    color: "#666",
  },
  gymWorkingHours: {
    fontSize: responsiveFontSize(14), // Use responsive font size
    color: "#666",
  },
});

export default FindAGymScreen;
