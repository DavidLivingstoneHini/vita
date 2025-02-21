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
import YoutubePlayer from "react-native-youtube-iframe";
import Header from "../../components/Header";

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
const ItemImage7 = require("../../assets/images/bmicheck.png");
const ItemImage8 = require("../../assets/images/periodtracker.png");
const ItemImage9 = require("../../assets/images/symcheck.png");
const LogoImage = require("../../assets/images/ozizawhite.png");

const featuredImage1 = require("../../assets/images/bgblue.png");
const featuredImage2 = require("../../assets/images/black_nurse.png");

const searchIcon = require("../../assets/images/search.png");
const notificationsIcon = require("../../assets/images/notification.png");
const chevronIcon = require("../../assets/images/chevron.png");

const Home = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const navigation = useNavigation();

  const healthListItems = [
    { id: 1, image: ItemImage1, title: "Skin Bleaching" },
    { id: 2, image: ItemImage2, title: "Hypertension" },
    { id: 3, image: ItemImage3, title: "Phobia" },
    { id: 4, image: ItemImage1, title: "Skin Bleaching" },
    { id: 5, image: ItemImage2, title: "Skin Bleaching" },
    { id: 6, image: ItemImage3, title: "Skin Bleaching" },
  ];

  const newSectionItems = [
    { id: 1, image: ItemImage7, title: "BMI Checker" },
    { id: 2, image: ItemImage8, title: "Period Tracker" },
    { id: 3, image: ItemImage9, title: "Symptom Checker" },
  ];

  const lifestyleListItems = [
    {
      id: 1,
      image: ItemImage4,
      title: "Inspiration 1",
      description: "Description for Inspiration 1",
      category: "Health & Wellness",
      readTime: "5 min read"
    },
    {
      id: 2,
      image: ItemImage5,
      title: "Inspiration 2",
      description: "Description for Inspiration 2",
      category: "Mental Health",
      readTime: "3 min read"
    },
    {
      id: 3,
      image: ItemImage4,
      title: "Inspiration 3",
      description: "Description for Inspiration 3",
      category: "Lifestyle",
      readTime: "4 min read"
    },
    {
      id: 4,
      image: ItemImage5,
      title: "Inspiration 4",
      description: "Description for Inspiration 4",
      category: "Wellness",
      readTime: "6 min read"
    },
  ];

  const exposingMythsListItems = [
    { id: 1, image: ItemImage1, title: "Myth 1" },
    { id: 2, image: ItemImage2, title: "Myth 2" },
    { id: 3, image: ItemImage3, title: "Myth 3" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const navigateToDetail = (id) => {
    navigation.navigate("DetailScreen", { itemId: id });
  };

  const renderInspirationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.inspirationCard}
      onPress={() => navigation.navigate(`inspiration/${item.id}`)}
    >
      <Image
        source={item.image}
        style={styles.inspirationImage}
        resizeMode="cover"
      />
      <View style={styles.inspirationCardContent}>
        <View style={styles.inspirationMetadata}>
          <Text style={styles.inspirationCategory}>{item.category}</Text>
          <Text style={styles.inspirationReadTime}>{item.readTime}</Text>
        </View>
        <Text style={styles.inspirationCardTitle}>{item.title}</Text>
        <Text style={styles.inspirationCardDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        isSearchVisible={isSearchVisible}
        onSearchPress={() => setIsSearchVisible(true)}
        onSearchClose={() => setIsSearchVisible(false)}
      />

      <ScrollView
        vertical
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: "100%" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Swiper Section */}
        <Swiper
          style={styles.swiper}
          showsPagination={false}
          onIndexChanged={setActiveIndex}
          autoplay={true}
          autoplayTimeout={3}
        >
          {images.map((image, index) => (
            <View key={`slide-${index}`} style={styles.slide}>
              <ImageBackground source={image} style={styles.backgroundImage}>
                <View style={styles.overlay}>
                  <Text style={styles.title}>Ghana launches "PharmaDrones"...</Text>
                  <Text style={styles.description}>
                    Ghana has launched a drone system that seeks to facilitate
                    the delivery of prescriptions, nationwide.
                  </Text>
                </View>
              </ImageBackground>
            </View>
          ))}
        </Swiper>

        {/* Pagination */}
        <View style={styles.pagination}>
          {images.map((_, index) => (
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
                  style={styles.chevronIcon}
                />
              </View>
            </TouchableOpacity>
          </View>
          <FlatList
            data={healthListItems}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigateToDetail(item.id)}>
                <View style={styles.listItem}>
                  <Image source={item.image} style={styles.listItemImage} />
                  <Text style={styles.listItemTitle}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Inspirations Section */}
        <View style={[styles.listContainer, { marginTop: screenHeight * 0.025 }]}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Inspirations</Text>
            <TouchableOpacity onPress={() => navigation.navigate("inspiration/index")}>
              <View style={styles.seeMoreContainer}>
                <Text style={styles.seeMoreText}>SEE MORE</Text>
                <Image source={chevronIcon} style={styles.chevronIcon} />
              </View>
            </TouchableOpacity>
          </View>
          <FlatList
            data={lifestyleListItems}
            renderItem={renderInspirationItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
            contentContainerStyle={styles.inspirationList}
          />
        </View>

        {/* Health Tips Section */}
        <View style={[styles.listContainer, { marginTop: screenHeight * 0.02 }]}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Health Tips</Text>
            <TouchableOpacity>
              <View style={styles.seeMoreContainer}>
                <Text style={styles.seeMoreText}>SEE MORE</Text>
                <Image source={chevronIcon} style={styles.chevronIcon} />
              </View>
            </TouchableOpacity>
          </View>
          <FlatList
            data={healthListItems}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigateToDetail(item.id)}>
                <View style={styles.listItem}>
                  <Image source={item.image} style={styles.listItemImage} />
                  <Text style={styles.listItemTitle}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Exposing Myths Section */}
        <View style={[styles.listContainer, { marginTop: screenHeight * 0.02 }]}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Exposing Myths</Text>
            <TouchableOpacity>
              <View style={styles.seeMoreContainer}>
                <Text style={styles.seeMoreText}>SEE MORE</Text>
                <Image source={chevronIcon} style={styles.chevronIcon} />
              </View>
            </TouchableOpacity>
          </View>
          <FlatList
            data={exposingMythsListItems}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigateToDetail(item.id)}>
                <View style={styles.listItem}>
                  <Image source={item.image} style={styles.listItemImage} />
                  <Text style={styles.listItemTitle}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Emergency Section */}
        <View style={styles.emergencyContainer}>
          <Text style={styles.emergencyHeading}>Are you in an emergency?</Text>
          <Text style={styles.emergencySubText}>Do you need help?</Text>
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => navigation.navigate("emergency/index")}
          >
            <Text style={styles.emergencyButtonText}>Contact Emergency Services</Text>
          </TouchableOpacity>
        </View>

        {/* Video Section */}
        <View style={styles.videoContainer}>
          <Text style={styles.videoTitle}>Highlights on MedWeek ‘24</Text>
          <View style={styles.videoWrapper}>
            <YoutubePlayer
              height={220}
              videoId="YOUR_YOUTUBE_VIDEO_ID"
              play={false}
              onChangeState={state => console.log(state)}
            />
          </View>
        </View>

        {/* Featured Article Section */}
        <View style={styles.featuredArticleContainer}>
          <View style={styles.featuredImageStack}>
            <Image
              source={featuredImage1}
              style={styles.featuredImageBack}
              resizeMode="cover"
            />
            <Image
              source={featuredImage2}
              style={styles.featuredImageFront}
              resizeMode="cover"
            />
          </View>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>
              Talk to an Expert            </Text>
            <Text style={styles.featuredDescription}>
              Your Mental Health matters. Are you feeling? Depressed or Anxious?
              Are you having Mental Breakdowns?
            </Text>
            <TouchableOpacity
              style={styles.learnMoreButton}
              onPress={() => navigation.navigate("ArticleDetail")}
            >
              <Text style={styles.learnMoreText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tools Section */}
        <View style={[styles.listContainer, { marginTop: screenHeight * 0.02 }]}>
          <Text style={[styles.listTitle, { textAlign: 'center', marginBottom: screenHeight * 0.02 }]}>
            Lifestyle Tools
          </Text>
          <FlatList
            data={newSectionItems}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate(`tool/${item.id}`)}>
                <View style={styles.newSectionItem}>
                  <Image source={item.image} style={styles.newSectionImage} />
                  <Text style={styles.newSectionText}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.newSectionList}
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
  swiper: {
    height: Dimensions.get('window').height * 0.25,
  },
  slide: {
    flex: 1,
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
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Dimensions.get('window').height * 0.012,
  },
  paginationCircle: {
    width: Dimensions.get('window').width * 0.02,
    height: Dimensions.get('window').width * 0.02,
    borderRadius: Dimensions.get('window').width * 0.01,
    borderWidth: 1,
    marginHorizontal: 3,
  },
  activeCircle: {
    backgroundColor: "#000000",
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
    fontSize: Dimensions.get('window').width * 0.025,
    fontWeight: "700",
    color: "#03053D",
  },
  chevronIcon: {
    width: Dimensions.get('window').width * 0.03,
    height: Dimensions.get('window').width * 0.03,
    marginLeft: 5,
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
    marginTop: 8,
  },
  inspirationList: {
    paddingHorizontal: Dimensions.get('window').width * 0.02,
  },
  inspirationCard: {
    width: Dimensions.get('window').width * 0.8,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  inspirationImage: {
    width: '100%',
    height: Dimensions.get('window').width * 0.4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  inspirationCardContent: {
    padding: Dimensions.get('window').width * 0.03,
  },
  inspirationMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  inspirationCategory: {
    fontSize: Dimensions.get('window').width * 0.028,
    color: '#666',
    fontWeight: '500',
  },
  inspirationReadTime: {
    fontSize: Dimensions.get('window').width * 0.028,
    color: '#666',
    fontWeight: '500',
  },
  inspirationCardTitle: {
    fontSize: Dimensions.get('window').width * 0.04,
    fontWeight: '700',
    color: '#0C1549',
    marginBottom: 4,
  },
  inspirationCardDescription: {
    fontSize: Dimensions.get('window').width * 0.032,
    color: '#666',
    lineHeight: 20,
  },
  emergencyContainer: {
    backgroundColor: "#C92035",
    padding: Dimensions.get('window').width * 0.06,
    marginTop: Dimensions.get('window').height * 0.025,
  },
  emergencyHeading: {
    fontSize: Dimensions.get('window').width * 0.05,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },
  emergencySubText: {
    fontSize: Dimensions.get('window').width * 0.04,
    color: "white",
    textAlign: "center",
    marginTop: Dimensions.get('window').height * 0.01,
  },
  emergencyButton: {
    backgroundColor: "black",
    padding: Dimensions.get('window').width * 0.04,
    borderRadius: 8,
    marginTop: Dimensions.get('window').height * 0.02,
    alignItems: "center",
  },
  emergencyButtonText: {
    color: "white",
    fontSize: Dimensions.get('window').width * 0.04,
    fontWeight: "700",
  },
  videoContainer: {
    padding: Dimensions.get('window').width * 0.025,
    marginTop: Dimensions.get('window').height * 0.02,
    marginBottom: Dimensions.get('window').height * 0.04,
  },
  videoTitle: {
    fontSize: Dimensions.get('window').width * 0.04,
    fontWeight: "700",
    color: "#0C1549",
    marginBottom: Dimensions.get('window').height * 0.020,
    textAlign: "center"
  },
  videoWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    marginHorizontal: Dimensions.get('window').width * 0.025,
  },
  featuredArticleContainer: {
    flexDirection: 'row',
    padding: Dimensions.get('window').width * 0.030,
    marginTop: Dimensions.get('window').height * 0.008,
    marginBottom: Dimensions.get('window').height * 0.02,
    marginHorizontal: Dimensions.get('window').width * 0.025,
    backgroundColor: '#fff',
  },
  featuredImageStack: {
    width: Dimensions.get('window').width * 0.35,
    height: Dimensions.get('window').width * 0.45,
    position: 'relative',
  },
  featuredImageBack: {
    width: Dimensions.get('window').width * 0.28,
    height: Dimensions.get('window').width * 0.55,
    position: 'absolute',
    bottom: -10,
    left: 0,
  },
  featuredImageFront: {
    width: Dimensions.get('window').width * 0.4,
    height: Dimensions.get('window').width * 0.47,
    position: 'absolute',
    top: -8,
    right: -28,
    zIndex: 1,
  },
  featuredContent: {
    flex: 1,
    paddingLeft: Dimensions.get('window').width * 0.16,
    justifyContent: 'space-between',
  },
  featuredTitle: {
    fontSize: Dimensions.get('window').width * 0.04,
    fontWeight: '700',
    color: '#0C1549',
  },
  featuredDescription: {
    fontSize: Dimensions.get('window').width * 0.032,
    color: '#666',
    lineHeight: 14,
  },
  learnMoreButton: {
    backgroundColor: 'black',
    padding: Dimensions.get('window').width * 0.030,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    color: 'white',
    fontSize: Dimensions.get('window').width * 0.035,
    fontWeight: '600',
  },
  newSectionList: {
    paddingHorizontal: Dimensions.get('window').width * 0.01,
  },
  newSectionItem: {
    width: Dimensions.get('window').width * 0.3,
    marginRight: Dimensions.get('window').width * 0.025,
    alignItems: 'center',
  },
  newSectionImage: {
    width: Dimensions.get('window').width * 0.25,
    height: Dimensions.get('window').width * 0.25,
    borderRadius: Dimensions.get('window').width * 0.125,
    marginBottom: 8,
  },
  newSectionText: {
    fontSize: Dimensions.get('window').width * 0.032,
    fontWeight: '600',
    color: '#0C1549',
    textAlign: 'center',
  },
});

export default Home;