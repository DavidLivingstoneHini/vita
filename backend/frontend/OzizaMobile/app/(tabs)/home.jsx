import React from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import Swiper from "react-native-swiper";

// Image Sources
const BackgroundImage = require("../../assets/images/background3.jpg");
const images = [
  require("../../assets/images/background3.jpg"),
  require("../../assets/images/background3.jpg"),
  require("../../assets/images/background3.jpg"),
];
const ItemImage1 = require("../../assets/images/bleach.png");
const ItemImage2 = require("../../assets/images/hypertension.png");
const ItemImage3 = require("../../assets/images/phobia.png");
const ItemImage4 = require("../../assets/images/bmi.png");
const ItemImage5 = require("../../assets/images/period.png");
const ItemImage6 = require("../../assets/images/eclipse.png");
const LogoImage = require("../../assets/images/oziza.png");

const searchIcon = require("../../assets/images/search-icon-unfocused.png");
const notificationsIcon = require("../../assets/images/notification.png");
const chevronIcon = require("../../assets/images/chevron.png");

const Home = () => {
  const healthListItems = [
    { id: 1, image: ItemImage1, title: "Skin Bleaching" },
    { id: 2, image: ItemImage2, title: "Hypertension" },
    { id: 3, image: ItemImage3, title: "Phobia" },
    { id: 4, image: ItemImage1, title: "Skin Bleaching" },
    { id: 5, image: ItemImage2, title: "Skin Bleaching" },
    { id: 6, image: ItemImage3, title: "Skin Bleaching" },
  ];

  const lifestyleListItems = [
    { id: 1, image: ItemImage4, title: "BMI Checker" },
    { id: 2, image: ItemImage5, title: "Period Tracker" },
    { id: 3, image: ItemImage6, title: "Symptom" },
    { id: 4, image: ItemImage4, title: "BMI Checker" },
    { id: 5, image: ItemImage5, title: "BMI Checker" },
    { id: 6, image: ItemImage6, title: "BMI Checker" },
  ];

  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={searchIcon}
          style={{ width: 25, height: 25, color: "#03053D", marginLeft: 8 }}
        />
        {/* **Logo Image** */}
        <Image source={LogoImage} style={styles.logo} resizeMode="contain" />
        <Image
          source={notificationsIcon}
          style={{ width: 25, height: 25, color: "#03053D", marginRight: 8 }}
        />
      </View>

      <ScrollView vertical showsVerticalScrollIndicator={false}>
        {/* Title and Text with Image Background */}
        <Swiper
          style={styles.swiper}
          showsPagination={false} // We'll render custom pagination
          onScroll={(e) => setActiveIndex(e.nativeEvent.index)}
          autoplay={true} // Auto-slide
          autoplayTimeout={3} // Slide every 3 seconds
        >
          {images.map((image, index) => (
            <View key={index} style={styles.slide}>
              <ImageBackground source={image} style={styles.backgroundImage}>
                <View style={styles.overlay}>
                  <Text style={styles.title}>
                    Ghana launches “PharmaDrones”...
                  </Text>
                  <Text style={styles.description}>
                    Ghana has launched a drone system that seeks to facilitate
                    the delivery of prescriptions, nationwide.
                  </Text>
                </View>
              </ImageBackground>
            </View>
          ))}
        </Swiper>

        {/* Custom Pagination (Slider Circles) */}
        <View style={styles.pagination}>
          {images.map((image, index) => (
            <View
              key={index}
              style={[
                styles.paginationCircle,
                activeIndex === index && styles.activeCircle,
              ]}
            />
          ))}
        </View>

        {/* Health List Section */}
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Health Conditions</Text>
            <TouchableOpacity>
              <View style={styles.seeMoreContainer}>
                <Text style={styles.seeMoreText}>SEE MORE</Text>F
                <Image
                  source={chevronIcon}
                  style={{
                    width: 13,
                    height: 13,
                    marginLeft: 5,
                    color: "#03053D",
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
          <FlatList
            data={healthListItems}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Image source={item.image} style={styles.listItemImage} />
                <Text style={styles.listItemTitle}>{item.title}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Lifestyle List Section */}
        <View style={[styles.listContainer, { marginTop: 20 }]}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Lifestyle Tools</Text>
            <TouchableOpacity>
              <View style={styles.seeMoreContainer}>
                <Text style={styles.seeMoreText}>SEE MORE</Text>
                <Image
                  source={chevronIcon}
                  style={{
                    width: 13,
                    height: 13,
                    marginLeft: 5,
                    color: "#03053D",
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
          <FlatList
            data={lifestyleListItems}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Image source={item.image} style={styles.listItemImage} />
                <Text style={styles.listItemTitle}>{item.title}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  logo: {
    width: 98,
    height: 39,
  },
  backgroundImage: {
    width: "100%",
    height: 200,
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(226, 213, 213, 0.5)",
    padding: 10,
    margin: 10,
    width: "95%",
  },
  title: {
    color: "black",
    fontSize: 16,
    fontWeight: 700,
  },
  description: {
    color: "black",
    fontSize: 14,
  },
  listContainer: {
    padding: 10,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#0C1549",
  },
  seeMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeMoreText: {
    fontSize: 8,
    fontWeight: 700,
    color: "black",
  },
  listItem: {
    width: 120,
    marginRight: 10,
  },
  listItemImage: {
    width: 115,
    height: 130,
    borderRadius: 6,
  },
  listItemTitle: {
    fontSize: 12,
    fontWeight: 600,
    textAlign: "center",
    color: "#0C1549",
  },
  swiper: {
    height: 200,
  },
  slide: {
    flex: 1,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  paginationCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 3,
  },
  activeCircle: {
    backgroundColor: "#333",
  },
});

export default Home;
