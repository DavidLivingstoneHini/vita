import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Calculate dynamic sizes based on screen width
const getResponsiveFontSize = (size) => {
  const standardScreenWidth = 375;
  const scaleFactor = width / standardScreenWidth;
  return Math.round(size * scaleFactor);
};

const InspirationScreen = ({ navigation }) => {
  const dummyData = [
    {
      id: 1,
      image: require("../../assets/images/inspiration1.png"),
      title: "I survived Breast Cancer",
      subtitle:
        "Get to know the heroes who are making big impacts on the communities through health innovation and projects",
    },
    {
      id: 2,
      image: require("../../assets/images/inspiration2.jpg"),
      title: "How to deal with stigmatization",
      subtitle:
        "Get to know the heroes who are making big impacts on the communities through health innovation and projects",
    },
    {
      id: 3,
      image: require("../../assets/images/inspiration3.jpg"),
      title: "Staying sober after rehabilitation",
      subtitle:
        "Get to know the heroes who are making big impacts on the communities through health innovation and projects",
    },
  ];

  const handleCardPress = (id) => {
    navigation.navigate("InspirationDetails", { id });
  };

  const navigation1 = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation1.navigate("Home")}
            style={styles.backButton}
          >
            <Image
              source={require("../../assets/images/back-arrow.png")}
              style={styles.backArrow}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Inspiration</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          {dummyData.map((card) => (
            <TouchableOpacity
              key={card.id}
              onPress={() => handleCardPress(card.id)}
              style={styles.cardContainer}
            >
              <Image 
                source={card.image} 
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 10,
    marginRight: width * 0.02,
  },
  title: {
    fontSize: getResponsiveFontSize(17),
    fontWeight: "bold",
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: width * 0.05,
  },
  cardContainer: {
    marginBottom: height * 0.025,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardImage: {
    width: "100%",
    height: height * 0.25,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: width * 0.04,
  },
  cardTitle: {
    fontSize: getResponsiveFontSize(13),
    fontWeight: "800",
    marginBottom: height * 0.01,
  },
  cardSubtitle: {
    fontSize: getResponsiveFontSize(11),
    fontWeight: "400",
    color: "#666",
  },
  backArrow: {
    width: width * 0.045,
    height: width * 0.045,
  },
});

export default InspirationScreen;