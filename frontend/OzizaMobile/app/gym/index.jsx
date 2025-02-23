import React, { useState, useEffect } from "react";
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
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

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
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

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

  const gymsWithCoordinates = [
    {
      id: 1,
      name: "Gym 1",
      location: "Accra Ghana",
      workingHours: "7:00am - 10:00pm",
      coordinate: {
        latitude: 37.78825,
        longitude: -122.4324,
      }
    },
    {
      id: 2,
      name: "Gym 2",
      location: "Accra Ghana",
      workingHours: "8:00am - 9:00pm",
      coordinate: {
        latitude: 37.78925,
        longitude: -122.4344,
      }
    },
    {
      id: 3,
      name: "Gym 3",
      location: "Accra Ghana",
      workingHours: "6:00am - 11:00pm",
      coordinate: {
        latitude: 37.79025,
        longitude: -122.4364,
      }
    },
  ];

  const initialRegion = {
    latitude: location?.coords?.latitude || 37.78825,
    longitude: location?.coords?.longitude || -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

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
        Let's find you a place to workout{" "}
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

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
        >
          {gymsWithCoordinates.map((gym) => (
            <Marker
              key={gym.id}
              coordinate={gym.coordinate}
              title={gym.name}
              description={gym.location}
            />
          ))}
        </MapView>
      </View>

      {/* Gyms List */}
      <FlatList
        data={gymsWithCoordinates}
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
    paddingTop: getSafeAreaTop(),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
  },
  backArrow: {
    width: width * 0.05,
    height: width * 0.05,
    marginRight: width * 0.02,
  },
  title: {
    fontSize: responsiveFontSize(20),
    fontWeight: "800",
  },
  readyToFitTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: "800",
    marginHorizontal: width * 0.04,
    marginTop: height * 0.02,
  },
  readyToFitSubtitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: "200",
    color: "#666",
    marginHorizontal: width * 0.04,
    marginBottom: height * 0.02,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: "700",
    marginHorizontal: width * 0.04,
    marginTop: height * 0.02,
  },
  trainingTypeList: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
  },
  trainingTypeCard: {
    width: width * 0.35,
    height: width * 0.4,
    marginRight: width * 0.02,
    borderRadius: 10,
    padding: width * 0.02,
  },
  trainingTypeName: {
    fontSize: responsiveFontSize(14),
    fontWeight: "700",
    marginBottom: height * 0.01,
  },
  trainingTypeImage: {
    width: "80%",
    height: "80%",
    borderRadius: 10,
    marginLeft: width * 0.02,
  },
  mapContainer: {
    height: height * 0.3,
    marginHorizontal: width * 0.04,
    marginVertical: height * 0.02,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  gymListitem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  gymInfo: {
    flex: 1,
  },
  gymName: {
    fontSize: responsiveFontSize(16),
    fontWeight: "bold",
  },
  gymLocation: {
    fontSize: responsiveFontSize(14),
    color: "#666",
  },
  gymWorkingHours: {
    fontSize: responsiveFontSize(14),
    color: "#666",
  },
});

export default FindAGymScreen;