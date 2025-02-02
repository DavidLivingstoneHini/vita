import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  MapView,
} from "react-native";

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
      {/* <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {gymsNearYou.map((gym) => (
          <Marker
            key={gym.id}
            coordinate={{
              latitude: 37.78825 + gym.id * 0.001,
              longitude: -122.4324 + gym.id * 0.001,
            }}
            title={gym.name}
            description={gym.location}
          />
        ))}
      </MapView> */}
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  backArrow: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: 800,
  },
  readyToFitTitle: {
    fontSize: 18,
    fontWeight: 800,
    marginHorizontal: 20,
    marginTop: 20,
  },
  readyToFitSubtitle: {
    fontSize: 16,
    fontWeight: 200,
    color: "#666",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginHorizontal: 20,
    marginTop: 20,
  },
  trainingTypeList: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  trainingTypeCard: {
    width: 130,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
    padding: 10,
  },
  trainingTypeName: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
  },
  trainingTypeImage: {
    width: "80%",
    height: "80%",
    borderRadius: 10,
    marginLeft: 20,
  },
  map: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  gymListitem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  gymInfo: {
    flex: 1,
  },
  gymName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  gymLocation: {
    fontSize: 14,
    color: "#666",
  },
  gymWorkingHours: {
    fontSize: 14,
    color: "#666",
  },
});

export default FindAGymScreen;
