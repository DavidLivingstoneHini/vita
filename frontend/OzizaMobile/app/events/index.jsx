import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const EventScreen = ({ navigation }) => {
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../../assets/images/back-arrow.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.eventTitle}>Event</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Events you might like</Text>
        <ScrollView
          horizontal
          style={styles.horizontalList}
          showsHorizontalScrollIndicator={false}
        >
          {eventsYouMightLike.map((event) => (
            <View key={event.id} style={styles.imageCardContainerHorizontal}>
              <Image source={event.image} style={styles.imageCardHorizontal} />
              <View style={styles.textContainerHorizontalWrapper}>
                <View style={styles.textContainerHorizontal}>
                  <Text style={styles.title}>{event.title}</Text>
                  <Text style={[styles.subtitle, { flexWrap: "wrap" }]}>
                    {event.subtitle}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Upcoming events</Text>
        <ScrollView
          style={styles.verticalList}
          showsVerticalScrollIndicator={false}
        >
          {upcomingEvents.map((event) => (
            <View key={event.id} style={styles.imageCardContainerVertical}>
              <Image
                source={event.image}
                style={[
                  styles.imageCardVertical,
                  {
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  },
                ]}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{event.title}</Text>
                <Text style={styles.subtitle}>{event.subtitle}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
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
  eventTitle: {
    fontSize: 17,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 20,
  },
  horizontalList: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  imageCardContainerHorizontal: {
    marginRight: 20,
    width: 320,
  },
  imageCardHorizontal: {
    width: "100%",
    height: 198,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textContainerHorizontal: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: -10,
  },
  title: {
    fontSize: 12,
    fontWeight: 800,
  },
  subtitle: {
    fontSize: 10,
    color: "#666",
    flexWrap: "wrap",
  },
  imageCardContainerVertical: {
    marginBottom: 20,
  },
  imageCardVertical: {
    width: "100%",
    height: 240,
  },
  textContainer: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: -10,
  },
  verticalList: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default EventScreen;
