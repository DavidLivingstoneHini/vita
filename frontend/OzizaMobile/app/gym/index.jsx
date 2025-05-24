import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';

// Get screen dimensions
const { width, height } = Dimensions.get("window");

// API Configuration
const API_URL = "https://www.ozizabackapp.in/api/v1";

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

const FindAGymScreen = () => {
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <Text>Map is not supported on web.</Text>
      </View>
    );
  }

  const MapView = require("react-native-maps").default;
  const Marker = require("react-native-maps").Marker;

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [gyms, setGyms] = useState([]);
  const [selectedTrainingType, setSelectedTrainingType] = useState(null);
  const router = useRouter();

  // Default coordinates (Accra, Ghana)
  const defaultCoords = {
    latitude: 5.644838188539504,
    longitude: -0.15150580326782948,
  };

  // Fetch nearby gyms from your backend
  const fetchNearbyGyms = async (latitude, longitude) => {
    try {
      setIsLoading(true);
      const accessToken = await SecureStore.getItemAsync("access_token");
      const response = await axios.get(`${API_URL}/gyms/`, {
        params: {
          lat: latitude,
          lng: longitude,
          radius: 10 // 10km radius
        },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      setGyms(response.data);
    } catch (error) {
      console.error("Error fetching gyms:", error);
      setGyms([]);
      Alert.alert("Error", "Could not fetch gyms. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get user location
  const getUserLocation = async () => {
    setIsLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setPermissionDenied(true);
        setErrorMsg("Permission to access location was denied");
        // Use default coordinates if permission denied
        setLocation({ coords: defaultCoords });
        fetchNearbyGyms(defaultCoords.latitude, defaultCoords.longitude);
        setIsLoading(false);
        return;
      }

      setPermissionDenied(false);

      // Get current position with high accuracy
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);
      fetchNearbyGyms(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
    } catch (error) {
      console.error("Error getting location:", error);
      setErrorMsg("Error getting location");
      // Fallback to default coordinates
      setLocation({ coords: defaultCoords });
      fetchNearbyGyms(defaultCoords.latitude, defaultCoords.longitude);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const handleRetryLocation = () => {
    getUserLocation();
  };

  const openSettings = () => {
    Linking.openSettings().catch(() => {
      Alert.alert("Unable to open settings");
    });
  };

  const trainingTypes = [
    {
      id: 1,
      name: "Lifting",
      image: require("../../assets/images/lifting.png"),
      backgroundColor: "#FFC080",
      type: "weight_training"
    },
    {
      id: 2,
      name: "Cardio",
      image: require("../../assets/images/cardio.png"),
      backgroundColor: "#C9E4CA",
      type: "cardio"
    },
    {
      id: 3,
      name: "Yoga",
      image: require("../../assets/images/yoga.png"),
      backgroundColor: "#FF99CC",
      type: "yoga"
    },
    {
      id: 4,
      name: "Pilates",
      image: require("../../assets/images/yoga.png"),
      backgroundColor: "#CCCCFF",
      type: "pilates"
    },
  ];

  const handleTrainingTypeSelect = (type) => {
    setSelectedTrainingType(type);
    // Filter gyms by type if your backend supports it
    // You would need to add a 'type' field to your Gym model
  };

  const initialRegion = {
    latitude: location?.coords?.latitude || defaultCoords.latitude,
    longitude: location?.coords?.longitude || defaultCoords.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const renderItem = (gym) => (
    <TouchableOpacity
      style={styles.gymListitem}
      key={gym.id}
      onPress={() => {
        router.push({
          pathname: "/gymdetails",
          params: { gymId: gym.id }
        });
      }}
    >
      <View style={styles.gymInfo}>
        <Text style={styles.gymName}>{gym.name}</Text>
        <Text style={styles.gymLocation}>{gym.address}</Text>
        {gym.distance && (
          <Text style={styles.gymDistance}>
            {gym.distance.toFixed(1)} km away
          </Text>
        )}
      </View>
      <View>
        <Text style={styles.gymWorkingHours}>Open until {gym.opening_hours[0]?.close || "10:00pm"}</Text>
        <View style={styles.ratingContainer}>
          <Image
            source={require("../../assets/images/star.jpg")}
            style={styles.starIcon}
          />
          <Text style={styles.ratingText}>{gym.rating.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Finding gyms near you...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("../../assets/images/back-arrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Find a Gym</Text>
      </View>

      {/* ScrollView for content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Ready to get fit */}
        <Text style={styles.readyToFitTitle}>Ready to get fit</Text>
        <Text style={styles.readyToFitSubtitle}>
          Let's find you a place to workout
        </Text>

        {permissionDenied && (
          <View style={styles.permissionDeniedContainer}>
            <Text style={styles.permissionDeniedText}>
              Location permission is required to find gyms near you.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={openSettings}
              >
                <Text style={styles.buttonText}>Open Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRetryLocation}
              >
                <Text style={styles.buttonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Explore by Training Type */}
        <Text style={styles.sectionTitle}>Explore by Training Type</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trainingTypeList}
        >
          {trainingTypes.map((trainingType) => (
            <TouchableOpacity
              key={trainingType.id}
              style={[
                styles.trainingTypeCard,
                {
                  backgroundColor: trainingType.backgroundColor,
                  borderWidth: selectedTrainingType === trainingType.type ? 2 : 0,
                  borderColor: "#000",
                }
              ]}
              onPress={() => handleTrainingTypeSelect(trainingType.type)}
            >
              <Text style={styles.trainingTypeName}>{trainingType.name}</Text>
              <Image
                source={trainingType.image}
                style={styles.trainingTypeImage}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Gyms near you */}
        <Text style={styles.sectionTitle}>Gyms near you</Text>

        {/* Map View */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={!permissionDenied}
            showsMyLocationButton={true}
          >
            {/* User location marker */}
            {!permissionDenied && location && (
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Your Location"
                pinColor="blue"
              />
            )}

            {/* Gym markers */}
            {gyms.map((gym) => (
              <Marker
                key={gym.id}
                coordinate={{
                  latitude: gym.latitude,
                  longitude: gym.longitude,
                }}
                title={gym.name}
                description={gym.address}
                onPress={() => {
                  router.push({
                    pathname: "/gym-details",
                    params: { gymId: gym.id }
                  });
                }}
              >
                <View style={styles.markerContainer}>
                  <View style={styles.markerBubble}>
                    <Text style={styles.markerText}>{gym.name}</Text>
                  </View>
                  <View style={styles.markerArrow} />
                </View>
              </Marker>
            ))}
          </MapView>
        </View>

        {/* ScrollView for Gym list */}
        <ScrollView style={styles.gymList}>
          {gyms.length > 0 ? (
            gyms.map(renderItem)
          ) : (
            <View style={styles.noGymsContainer}>
              <Image
                source={require("../../assets/images/no-gyms.jpg")}
                style={styles.noGymsImage}
              />
              <Text style={styles.noGymsText}>
                No gyms found in your area. Try zooming out on the map.
              </Text>
            </View>
          )}
        </ScrollView>
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: responsiveFontSize(16),
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
  permissionDeniedContainer: {
    backgroundColor: "#FFF3F3",
    padding: 15,
    marginHorizontal: width * 0.04,
    borderRadius: 8,
    marginBottom: 10,
  },
  permissionDeniedText: {
    color: "#D32F2F",
    fontSize: responsiveFontSize(14),
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  settingsButton: {
    backgroundColor: "#D32F2F",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  retryButton: {
    backgroundColor: "#1976D2",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: "700",
    marginHorizontal: width * 0.04,
    marginTop: height * 0.02,
  },
  trainingTypeList: {
    flexDirection: "row",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
  },
  trainingTypeCard: {
    width: width * 0.35,
    height: width * 0.4,
    marginRight: width * 0.04,
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
    alignSelf: "center",
  },
  mapContainer: {
    height: height * 0.3,
    marginHorizontal: width * 0.04,
    marginVertical: height * 0.02,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  gymList: {
    flex: 1,
    paddingHorizontal: width * 0.04,
  },
  gymListitem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  gymInfo: {
    flex: 1,
    marginRight: 10,
  },
  gymName: {
    fontSize: responsiveFontSize(16),
    fontWeight: "bold",
  },
  gymLocation: {
    fontSize: responsiveFontSize(14),
    color: "#666",
    marginVertical: 4,
  },
  gymDistance: {
    fontSize: responsiveFontSize(12),
    color: "#999",
  },
  gymWorkingHours: {
    fontSize: responsiveFontSize(14),
    color: "#666",
    textAlign: "right",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  starIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  ratingText: {
    fontSize: responsiveFontSize(14),
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: 50,
  },
  noGymsContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  noGymsImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  noGymsText: {
    textAlign: "center",
    fontSize: responsiveFontSize(16),
    color: "#666",
    paddingHorizontal: 20,
  },
  markerContainer: {
    alignItems: "center",
  },
  markerBubble: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  markerText: {
    fontSize: responsiveFontSize(12),
    fontWeight: "bold",
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "white",
    transform: [{ rotate: "180deg" }],
    marginTop: -2,
  },
});

export default FindAGymScreen;