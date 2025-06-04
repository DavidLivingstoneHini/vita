import React, { useState, useEffect, useCallback } from "react";
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
  BackHandler,
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
  const scaleFactor = width / 375;
  const newSize = size * scaleFactor;
  return Math.ceil(newSize);
};

// Function to get safe area top padding
const getSafeAreaTop = () => {
  if (Platform.OS === "ios") {
    return 40;
  }
  return 20;
};

const FindAGymScreen = () => {
  // State management
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [gyms, setGyms] = useState([]);
  const [selectedTrainingType, setSelectedTrainingType] = useState(null);
  const [mapsAvailable, setMapsAvailable] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [appCrashPrevention, setAppCrashPrevention] = useState(false);
  const [initializationComplete, setInitializationComplete] = useState(false);

  const router = useRouter();

  // Default coordinates (Accra, Ghana)
  const defaultCoords = {
    latitude: 5.644838188539504,
    longitude: -0.15150580326782948,
  };

  // Error boundary for preventing crashes
  const handleCriticalError = useCallback((error, context) => {
    console.error(`Critical error in ${context}:`, error);
    setAppCrashPrevention(true);
    setIsLoading(false);

    // Show user-friendly error without crashing
    Alert.alert(
      "Service Temporarily Unavailable",
      "We're having trouble loading the gym finder. Please try again later or contact support.",
      [
        { text: "Go Back", onPress: () => router.back() },
        { text: "Retry", onPress: () => handleRetry() }
      ]
    );
  }, [router]);

  // Safe map component loading
  const loadMapComponent = useCallback(() => {
    try {
      // Only load maps if platform supports it
      if (Platform.OS === "web") {
        setMapsAvailable(false);
        return { MapView: null, Marker: null };
      }

      const maps = require("react-native-maps");
      setMapsAvailable(true);
      return {
        MapView: maps.default,
        Marker: maps.Marker
      };
    } catch (error) {
      console.warn("react-native-maps not available:", error);
      setMapsAvailable(false);
      return { MapView: null, Marker: null };
    }
  }, []);

  // Enhanced gym fetching with better error handling
  const fetchNearbyGyms = useCallback(async (latitude, longitude) => {
    try {
      setIsLoading(true);

      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 15000)
      );

      const accessToken = await SecureStore.getItemAsync("access_token");

      if (!accessToken) {
        throw new Error("Authentication required");
      }

      const apiCall = axios.get(`${API_URL}/users/gyms/`, {
        params: {
          lat: latitude,
          lng: longitude,
          radius: 10
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      const response = await Promise.race([apiCall, timeoutPromise]);

      // Validate response data
      if (response.data && Array.isArray(response.data)) {
        setGyms(response.data);
      } else {
        console.warn("Invalid gym data received:", response.data);
        setGyms([]);
      }

    } catch (error) {
      console.error("Error fetching gyms:", error);
      setGyms([]);

      // Don't show error alert if we're in crash prevention mode
      if (!appCrashPrevention) {
        const errorMessage = error.response?.status === 401
          ? "Please log in again to view gyms"
          : "Could not fetch gyms. Using cached data.";

        // For Android, be more gentle with error handling
        if (Platform.OS === 'android') {
          console.warn("Gym fetch failed:", errorMessage);
        } else {
          Alert.alert("Notice", errorMessage);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [appCrashPrevention]);

  // Enhanced location permission handling for Android
  const checkLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error("Error checking location permission:", error);
      return false;
    }
  }, []);

  // Android-specific permission request
  const requestLocationPermission = useCallback(async () => {
    try {
      // For Android, check if location services are enabled
      if (Platform.OS === 'android') {
        const serviceEnabled = await Location.hasServicesEnabledAsync();
        if (!serviceEnabled) {
          Alert.alert(
            "Location Services Disabled",
            "Please enable location services in your device settings to find nearby gyms.",
            [
              { text: "Open Settings", onPress: openSettings },
              { text: "Use Default Location", onPress: useDefaultLocation }
            ]
          );
          return false;
        }
      }

      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        return true;
      } else if (status === 'denied' && !canAskAgain) {
        setPermissionDenied(true);
        setShowLocationPrompt(true);
        return false;
      } else {
        setPermissionDenied(true);
        return false;
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
      setPermissionDenied(true);
      return false;
    }
  }, []);

  // Safe location retrieval
  const getUserLocation = useCallback(async () => {
    if (appCrashPrevention) {
      useDefaultLocation();
      return;
    }

    setIsLoading(true);
    setLocationError(false);
    setErrorMsg(null);

    try {
      const hasPermission = await checkLocationPermission();

      if (!hasPermission) {
        const permissionGranted = await requestLocationPermission();
        if (!permissionGranted) {
          console.log("Location permission denied, using default coordinates");
          setLocation({ coords: defaultCoords });
          await fetchNearbyGyms(defaultCoords.latitude, defaultCoords.longitude);
          return;
        }
      }

      setPermissionDenied(false);
      let currentLocation = null;

      try {
        // Android-specific location options
        const locationOptions = Platform.OS === 'android'
          ? {
            accuracy: Location.Accuracy.Balanced,
            maximumAge: 60000, // 1 minute cache for Android
            timeout: 8000 // Shorter timeout for Android
          }
          : {
            accuracy: Location.Accuracy.Balanced,
            maximumAge: 30000,
            timeout: 10000
          };

        currentLocation = await Promise.race([
          Location.getCurrentPositionAsync(locationOptions),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Location timeout')), locationOptions.timeout)
          )
        ]);
      } catch (currentLocationError) {
        console.warn("Error getting current location:", currentLocationError.message);

        try {
          currentLocation = await Location.getLastKnownPositionAsync({
            maxAge: 600000, // 10 minutes for Android
          });
        } catch (lastKnownError) {
          console.warn("Error getting last known location:", lastKnownError.message);
          throw new Error("Could not retrieve location data");
        }
      }

      if (!currentLocation || !currentLocation.coords) {
        throw new Error("No location data available");
      }

      const { latitude, longitude } = currentLocation.coords;
      if (typeof latitude !== 'number' || typeof longitude !== 'number' ||
        Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
        throw new Error("Invalid location coordinates");
      }

      setLocation(currentLocation);
      await fetchNearbyGyms(latitude, longitude);

    } catch (error) {
      console.error("Error in getUserLocation:", error.message);
      setLocationError(true);
      setErrorMsg(`Location error: ${error.message}`);

      // Fallback to default coordinates
      setLocation({ coords: defaultCoords });
      await fetchNearbyGyms(defaultCoords.latitude, defaultCoords.longitude);

      // Gentle notification for Android
      if (Platform.OS === 'android') {
        console.warn("Using default location due to error:", error.message);
      } else {
        Alert.alert(
          "Location Unavailable",
          "Using default location (Accra). You can search for gyms in your area.",
          [{ text: "OK" }]
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [appCrashPrevention, checkLocationPermission, requestLocationPermission, fetchNearbyGyms]);

  // Safe initialization
  const initializeScreen = useCallback(async () => {
    try {
      setInitializationComplete(false);

      // Load map component safely
      const { MapView, Marker } = loadMapComponent();

      // Set up Android back handler
      if (Platform.OS === 'android') {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
          router.back();
          return true;
        });

        // Cleanup function will be called when component unmounts
        return () => backHandler.remove();
      }

      // Get user location
      await getUserLocation();

    } catch (error) {
      handleCriticalError(error, 'initialization');
    } finally {
      setInitializationComplete(true);
    }
  }, [loadMapComponent, getUserLocation, handleCriticalError, router]);

  // Retry functionality
  const handleRetry = useCallback(() => {
    setAppCrashPrevention(false);
    setShowLocationPrompt(false);
    initializeScreen();
  }, [initializeScreen]);

  // Helper functions
  const handleRetryLocation = useCallback(async () => {
    setShowLocationPrompt(false);
    await getUserLocation();
  }, [getUserLocation]);

  const openSettings = useCallback(async () => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');
      } else {
        await Linking.openSettings();
      }
    } catch (error) {
      Alert.alert(
        "Unable to open settings",
        "Please manually enable location permissions in your device settings."
      );
    }
  }, []);

  const useDefaultLocation = useCallback(() => {
    setShowLocationPrompt(false);
    setPermissionDenied(false);
    setLocation({ coords: defaultCoords });
    fetchNearbyGyms(defaultCoords.latitude, defaultCoords.longitude);
  }, [fetchNearbyGyms]);

  // Initialize screen on mount
  useEffect(() => {
    let cleanup;
    const init = async () => {
      cleanup = await initializeScreen();
    };
    init();

    return () => {
      if (cleanup) cleanup();
    };
  }, [initializeScreen]);

  // Training types data
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

  const handleTrainingTypeSelect = useCallback((type) => {
    setSelectedTrainingType(type);
  }, []);

  // Safe navigation to gym details
  const navigateToGymDetails = useCallback((gymId) => {
    try {
      router.push({
        pathname: "/gymdetails",
        params: { gymId: gymId }
      });
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Error", "Could not open gym details. Please try again.");
    }
  }, [router]);

  // Render functions
  const renderMapView = useCallback(() => {
    if (!mapsAvailable) {
      return (
        <View style={styles.mapFallback}>
          <Text style={styles.mapFallbackText}>
            {Platform.OS === 'web' ? 'Maps not supported on web' : 'Maps not available on this device'}
          </Text>
        </View>
      );
    }

    try {
      const maps = require("react-native-maps");
      const MapView = maps.default;
      const Marker = maps.Marker;

      const initialRegion = {
        latitude: location?.coords?.latitude || defaultCoords.latitude,
        longitude: location?.coords?.longitude || defaultCoords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      return (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={!permissionDenied && !locationError}
            showsMyLocationButton={true}
            onError={(error) => {
              console.warn("Map error:", error);
              setMapsAvailable(false);
            }}
          >
            {/* User location marker */}
            {!permissionDenied && !locationError && location && (
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
                onPress={() => navigateToGymDetails(gym.id)}
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
      );
    } catch (error) {
      console.error("Map rendering error:", error);
      return (
        <View style={styles.mapFallback}>
          <Text style={styles.mapFallbackText}>Map temporarily unavailable</Text>
        </View>
      );
    }
  }, [mapsAvailable, location, permissionDenied, locationError, gyms, navigateToGymDetails]);

  const renderItem = useCallback((gym) => (
    <TouchableOpacity
      style={styles.gymListitem}
      key={gym.id}
      onPress={() => navigateToGymDetails(gym.id)}
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
        <Text style={styles.gymWorkingHours}>
          Open until {gym.opening_hours?.[0]?.close || "10:00pm"}
        </Text>
        <View style={styles.ratingContainer}>
          <Image
            source={require("../../assets/images/star.jpg")}
            style={styles.starIcon}
          />
          <Text style={styles.ratingText}>{gym.rating?.toFixed(1) || "N/A"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  ), [navigateToGymDetails]);

  // Crash prevention fallback
  if (appCrashPrevention) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorTitle}>Service Temporarily Unavailable</Text>
        <Text style={styles.errorMessage}>
          We're having trouble loading the gym finder. This might be due to:
        </Text>
        <Text style={styles.errorList}>
          • Network connectivity issues{'\n'}
          • Location services problems{'\n'}
          • App permissions{'\n'}
          • Server maintenance
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Loading state
  if (isLoading || !initializationComplete) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>
          {Platform.OS === 'android' ? 'Loading gyms...' : 'Finding gyms near you...'}
        </Text>
      </View>
    );
  }

  // Location prompt modal
  if (showLocationPrompt) {
    return (
      <View style={[styles.container, styles.modalContainer]}>
        <View style={styles.modalContent}>
          <Image
            source={require("../../assets/images/location-icon.png")}
            style={styles.locationIcon}
          />
          <Text style={styles.modalTitle}>Enable Location Access</Text>
          <Text style={styles.modalDescription}>
            To find gyms near you, we need access to your location. You can enable this in your device settings.
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={openSettings}
            >
              <Text style={styles.buttonText}>Open Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={useDefaultLocation}
            >
              <Text style={styles.skipButtonText}>Skip & Use Default</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Main render
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

        {/* Location status indicator */}
        {(permissionDenied || locationError) && (
          <View style={styles.locationStatusContainer}>
            <Text style={styles.locationStatusText}>
              {permissionDenied
                ? "📍 Using default location (Accra)"
                : "📍 Showing nearby gyms"
              }
            </Text>
            <TouchableOpacity
              style={styles.retryLocationButton}
              onPress={handleRetryLocation}
            >
              <Text style={styles.retryLocationText}>Retry Location</Text>
            </TouchableOpacity>
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
        <Text style={styles.sectionTitle}>
          {permissionDenied ? "Gyms in Accra" : "Gyms near you"}
        </Text>

        {/* Map View */}
        {renderMapView()}

        {/* Gym list */}
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
                No gyms found in your area. Try adjusting your location or check back later.
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
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: responsiveFontSize(16),
    textAlign: "center",
    marginBottom: 15,
    color: "#666",
  },
  errorList: {
    fontSize: responsiveFontSize(14),
    textAlign: "left",
    marginBottom: 20,
    color: "#666",
  },
  retryButton: {
    backgroundColor: "#1976D2",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    minWidth: 200,
  },
  retryButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: responsiveFontSize(16),
  },
  backButton: {
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1976D2",
    minWidth: 200,
  },
  backButtonText: {
    color: "#1976D2",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: responsiveFontSize(16),
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    marginHorizontal: 30,
  },
  locationIcon: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: responsiveFontSize(16),
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButtons: {
    width: "100%",
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
  locationStatusContainer: {
    backgroundColor: "#E3F2FD",
    padding: 15,
    marginHorizontal: width * 0.04,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationStatusText: {
    color: "#1976D2",
    fontSize: responsiveFontSize(14),
    flex: 1,
  },
  retryLocationButton: {
    backgroundColor: "#1976D2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  retryLocationText: {
    color: "white",
    fontSize: responsiveFontSize(12),
    fontWeight: "bold",
  },
  settingsButton: {
    backgroundColor: "#1976D2",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  skipButton: {
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1976D2",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: responsiveFontSize(16),
  },
  skipButtonText: {
    color: "#1976D2",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: responsiveFontSize(16),
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
  mapFallback: {
    height: height * 0.3,
    marginHorizontal: width * 0.04,
    marginVertical: height * 0.02,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  mapFallbackText: {
    fontSize: responsiveFontSize(16),
    color: "#666",
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