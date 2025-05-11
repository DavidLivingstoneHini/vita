import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
} from "react-native";
import { Link, useRouter } from "expo-router";

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Calculate responsive dimensions
const scale = SCREEN_WIDTH / 375; // Using 375 as base width (iPhone X)
const normalize = (size) => Math.round(scale * size);

const PolicyScreen = ({ navigation }) => {
  const router = useRouter();
  const eventsYouMightLike = [
    {
      id: 1,
      image: require("../../assets/images/event1.png"),
      title: "NHIS Conference 2025",
      subtitle:
        "Get to know the heroes who are making big impacts on the communities through health innovation and projects",
    },
    {
      id: 2,
      image: require("../../assets/images/event2.png"),
      title: "NHIS Conference 2025",
      subtitle:
        "Get to know the heroes who are making big impacts on the communities through health innovation and projects",
    },
    {
      id: 3,
      image: require("../../assets/images/event1.png"),
      title: "NHIS Conference 2025",
      subtitle:
        "Get to know the heroes who are making big impacts on the communities through health innovation and projects",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      image: require("../../assets/images/event3.png"),
      title: "DigiHealth Global 2025",
      subtitle:
        "Get to know the heroes who are making big impacts on the communities through health innovation and projects",
    },
    {
      id: 2,
      image: require("../../assets/images/event3.png"),
      title: "DigiHealth Global 2025",
      subtitle:
        "Get to know the heroes who are making big impacts on the communities through health innovation and projects",
    },
    {
      id: 3,
      image: require("../../assets/images/event3.png"),
      title: "DigiHealth Global 2025",
      subtitle:
        "Get to know the heroes who are making big impacts on the communities through health innovation and projects",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Image
            source={require("../../assets/images/back-arrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.eventTitle}>Policies & Insurances</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Recommended</Text>
        <ScrollView
          horizontal
          style={styles.horizontalList}
          showsHorizontalScrollIndicator={false}
        >
          {eventsYouMightLike.map((event) => (
            <View key={event.id} style={styles.imageCardContainerHorizontal}>
              <Image
                source={event.image}
                style={styles.imageCardHorizontal}
                resizeMode="cover"
              />
              <View style={styles.textContainerHorizontal}>
                <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
                <Text style={styles.subtitle} numberOfLines={2}>
                  {event.subtitle}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>International</Text>
        <View style={styles.verticalList}>
          {upcomingEvents.map((event) => (
            <View key={event.id} style={styles.imageCardContainerVertical}>
              <Image
                source={event.image}
                style={styles.imageCardVertical}
                resizeMode="cover"
              />
              <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
                <Text style={styles.subtitle} numberOfLines={2}>{event.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    minHeight: normalize(50),
  },
  backButton: {
    padding: normalize(5),
  },
  backArrow: {
    width: normalize(18),
    height: normalize(18),
    marginRight: normalize(10),
  },
  eventTitle: {
    fontSize: normalize(17),
    fontWeight: "bold",
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: "bold",
    marginHorizontal: normalize(20),
    marginTop: normalize(20),
    marginBottom: normalize(10),
  },
  horizontalList: {
    paddingHorizontal: normalize(20),
  },
  imageCardContainerHorizontal: {
    marginRight: normalize(20),
    width: SCREEN_WIDTH * 0.75, // 75% of screen width
    maxWidth: normalize(320),
    marginBottom: normalize(10),
  },
  imageCardHorizontal: {
    width: "100%",
    height: SCREEN_WIDTH * 0.4, // 40% of screen width
    borderTopLeftRadius: normalize(10),
    borderTopRightRadius: normalize(10),
  },
  textContainerHorizontal: {
    backgroundColor: "#F5F5F5",
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(10),
    borderBottomLeftRadius: normalize(10),
    borderBottomRightRadius: normalize(10),
  },
  title: {
    fontSize: normalize(12),
    fontWeight: "800",
    marginBottom: normalize(4),
  },
  subtitle: {
    fontSize: normalize(10),
    color: "#666",
    lineHeight: normalize(14),
  },
  verticalList: {
    paddingHorizontal: normalize(20),
    paddingBottom: normalize(20),
  },
  imageCardContainerVertical: {
    marginBottom: normalize(20),
    width: "100%",
  },
  imageCardVertical: {
    width: "100%",
    height: SCREEN_WIDTH * 0.6, // 60% of screen width
    borderTopLeftRadius: normalize(10),
    borderTopRightRadius: normalize(10),
  },
  textContainer: {
    backgroundColor: "#F5F5F5",
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(10),
    borderBottomLeftRadius: normalize(10),
    borderBottomRightRadius: normalize(10),
  },
});

export default PolicyScreen;