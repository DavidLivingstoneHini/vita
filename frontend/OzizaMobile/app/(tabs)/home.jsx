import React, { useState } from "react";
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
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";
import SearchBox from "../../components/searchBox";
import { Feather } from "@expo/vector-icons";

// Image Sources
const images = [
  require("../../assets/images/background3.jpg"),
  require("../../assets/images/background.png"),
  require("../../assets/images/background2.png"),
];
const ItemImage1 = require("../../assets/images/bleach.png");
const ItemImage2 = require("../../assets/images/hypertension.png");
const ItemImage3 = require("../../assets/images/phobia.png");
const ItemImage4 = require("../../assets/images/female-doc.png");
const ItemImage5 = require("../../assets/images/female-doc2.png");
const ItemImage6 = require("../../assets/images/eclipse.png");
const LogoImage = require("../../assets/images/ozizawhite.png");

const searchIcon = require("../../assets/images/search.png");
const notificationsIcon = require("../../assets/images/notification.png");
const chevronIcon = require("../../assets/images/chevron.png");

const Home = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  
  const healthListItems = [
    { id: 1, image: ItemImage1, title: "Skin Bleaching" },
    { id: 2, image: ItemImage2, title: "Hypertension" },
    { id: 3, image: ItemImage3, title: "Phobia" },
    { id: 4, image: ItemImage1, title: "Skin Bleaching" },
    { id: 5, image: ItemImage2, title: "Skin Bleaching" },
    { id: 6, image: ItemImage3, title: "Skin Bleaching" },
  ];

  const lifestyleListItems = [
    { id: 1, image: ItemImage4, title: "" },
    { id: 2, image: ItemImage4, title: "" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation();
  const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleSearchSubmit = (query) => {
    console.log("Searching for:", query);
    setSearchQuery(query);
  };

  const handleSearchBoxClose = () => {
    setIsSearchBoxVisible(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View
        style={[
          styles.header,
          isSearchBoxVisible ? styles.headerSearchMode : null,
        ]}
      >
        {isSearchBoxVisible ? (
          <View style={styles.searchBoxContainer}>
            <SearchBox onClose={handleSearchBoxClose} style={styles.searchBox} />
            <View style={styles.closeIconContainer}>
              <TouchableOpacity onPress={handleSearchBoxClose}>
                <Feather name="x" size={screenWidth * 0.05} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <TouchableOpacity onPress={() => setIsSearchBoxVisible(true)}>
              <Image
                source={searchIcon}
                style={{
                  width: screenWidth * 0.06,
                  height: screenWidth * 0.06,
                  color: "#03053D",
                  marginLeft: screenWidth * 0.02,
                }}
              />
            </TouchableOpacity>

            <Image
              source={LogoImage}
              style={styles.logo}
              resizeMode="contain"
            />
            <Image
              source={notificationsIcon}
              style={{
                width: screenWidth * 0.06,
                height: screenWidth * 0.06,
                color: "#03053D",
                marginRight: screenWidth * 0.02,
              }}
            />
          </>
        )}
      </View>

      <ScrollView
        vertical
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: "100%" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Title and Text with Image Background */}
        <Swiper
          style={styles.swiper}
          showsPagination={false}
          onIndexChanged={(index) => {
            setActiveIndex(index);
          }}
          autoplay={true}
          autoplayTimeout={3}
        >
          {images.map((image, index) => (
            <View key={`slide-${index}`} style={styles.slide}>
              <ImageBackground
                source={image}
                style={styles.backgroundImage}
              >
                <View style={styles.overlay}>
                  <Text style={styles.title}>
                    Ghana launches "PharmaDrones"...
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

        {/* Custom Pagination */}
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
        <View style={[styles.listContainer, { marginTop: screenHeight * 0.02 }]}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Health Conditions</Text>
            <TouchableOpacity>
              <View style={styles.seeMoreContainer}>
                <Text style={styles.seeMoreText}>SEE MORE</Text>
                <Image
                  source={chevronIcon}
                  style={{
                    width: screenWidth * 0.03,
                    height: screenWidth * 0.03,
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
        <View style={[styles.listContainer, { marginTop: screenHeight * 0.025 }]}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Inspirations</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("inspiration/index")}
            >
              <View style={styles.seeMoreContainer}>
                <Text style={styles.seeMoreText}>SEE MORE</Text>
                <Image
                  source={chevronIcon}
                  style={{
                    width: screenWidth * 0.03,
                    height: screenWidth * 0.03,
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
              <View style={styles.listlifeItem}>
                <Image
                  source={item.image}
                  style={styles.listlifeItemImage}
                />
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
    padding: Dimensions.get('window').width * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    backgroundColor: "#000000",
  },
  headerSearchMode: {
    justifyContent: "center",
    alignItems: "center",
    padding: Dimensions.get('window').width * 0.025,
  },
  logo: {
    width: Dimensions.get('window').width * 0.25,
    height: Dimensions.get('window').height * 0.05,
    resizeMode: 'contain',
  },
  backgroundImage: {
    width: "100%",
    height: Dimensions.get('window').height * 0.25,
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(226, 213, 213, 0.5)",
    padding: Dimensions.get('window').width * 0.025,
    margin: Dimensions.get('window').width * 0.025,
    width: "95%",
  },
  title: {
    color: "black",
    fontSize: Dimensions.get('window').width * 0.04,
    fontWeight: "700",
  },
  description: {
    color: "black",
    fontSize: Dimensions.get('window').width * 0.035,
  },
  listContainer: {
    padding: Dimensions.get('window').width * 0.025,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Dimensions.get('window').height * 0.012,
  },
  listTitle: {
    fontSize: Dimensions.get('window').width * 0.04,
    fontWeight: "700",
    color: "#0C1549",
  },
  seeMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeMoreText: {
    fontSize: Dimensions.get('window').width * 0.02,
    fontWeight: "700",
    color: "black",
  },
  listItem: {
    width: Dimensions.get('window').width * 0.3,
    marginRight: Dimensions.get('window').width * 0.025,
  },
  listItemImage: {
    width: Dimensions.get('window').width * 0.28,
    height: Dimensions.get('window').width * 0.32,
    borderRadius: 6,
  },
  listItemTitle: {
    fontSize: Dimensions.get('window').width * 0.03,
    fontWeight: "600",
    textAlign: "center",
    color: "#0C1549",
  },
  listlifeItem: {
    width: Dimensions.get('window').width * 0.85,
    marginRight: Dimensions.get('window').width * 0.015,
  },
  listlifeItemImage: {
    width: Dimensions.get('window').width * 0.82,
    height: Dimensions.get('window').width * 0.6,
    borderRadius: 8,
  },
  swiper: {
    height: Dimensions.get('window').height * 0.25,
  },
  slide: {
    flex: 1,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Dimensions.get('window').height * 0.012,
  },
  paginationCircle: {
    width: Dimensions.get('window').width * 0.03,
    height: Dimensions.get('window').width * 0.03,
    borderRadius: Dimensions.get('window').width * 0.015,
    borderWidth: 2,
    borderColor: "#ccc",
    marginHorizontal: 3,
  },
  activeCircle: {
    backgroundColor: "#000000",
  },
  searchBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Dimensions.get('window').height * 0.01,
    paddingHorizontal: Dimensions.get('window').width * 0.04,
    marginRight: Dimensions.get('window').width * 0.05,
    width: "100%",
  },
  searchBox: {
    width: "55%",
  },
  closeIconContainer: {
    position: 'absolute',
    right: Dimensions.get('window').width * 0.03,
    top: Dimensions.get('window').height * 0.03,
    fontSize: Dimensions.get('window').width * 0.03,
  },
});

export default Home;