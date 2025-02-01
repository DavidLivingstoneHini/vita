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

const InspirationScreen = ({ navigation }) => {
  const dummyData = [
    {
      id: 1,
      image: require("../../../assets/images/inspiration1.png"),
      title: "I survived Breast Cancer",
      subtitle:
        "Get to know the heroes who are making big impacts on the communities through health innovation and projects",
    },
    {
      id: 2,
      image: require("../../../assets/images/inspiration2.jpg"),
      title: "How to deal with stigmatization",
      subtitle:
        "Get to know the heroes who are making big impacts on the communities through health innovation and projects",
    },
    {
      id: 3,
      image: require("../../../assets/images/inspiration3.jpg"),
      title: "Staying sober after rehabilitation",
      subtitle:
        "Get to know the heroes who are making big impacts on the communities through health innovation and projects",
    },
  ];

  const handleCardPress = (id) => {
    // Handle card press logic here, e.g., navigate to a new screen
    console.log(`Card with ID ${id} pressed`);
    // Example navigation to a new screen
    navigation.navigate("InspirationDetails", { id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Inspiration</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {dummyData.map((card) => (
          <TouchableOpacity
            key={card.id}
            onPress={() => handleCardPress(card.id)}
            style={styles.carContainer}
          >
            <Image source={card.image} style={styles.carImage} />
            <Text style={styles.carTitle}>{card.title}</Text>
            <Text style={styles.carSubtitle}>{card.subtitle}</Text>
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
  scrollView: {
    padding: 20,
  },
  carContainer: {
    marginBottom: 20,
    backgroundColor: "#F5F5F5",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    width: "360px",
    height: "240px",
  },
  carImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  carTitle: {
    fontSize: 13,
    fontWeight: 800,
    marginTop: 10,
    marginLeft: 15,
  },
  carSubtitle: {
    fontSize: 11,
    fontWeight: 400,
    color: "#666",
    marginBottom: 15,
    marginLeft: 15,
  },
});

export default InspirationScreen;
