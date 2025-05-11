import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import YoutubePlayer from "react-native-youtube-iframe";
import Header from "../../components/Header";
import { mythsItems } from "../../utils/mythsData";
import Carousel from "react-native-reanimated-carousel";

// Image Sources
const images = [
  {
    image: require("../../assets/images/background3.jpg"),
    title: "Ghana launches 'PharmaDrones'...",
    description: "Ghana has launched a drone system that seeks to facilitate the delivery of prescriptions, nationwide.",
  },
  {
    image: require("../../assets/images/background.png"),
    title: "New Health Initiative",
    description: "A new health initiative aims to improve access to healthcare in rural areas.",
  },
  {
    image: require("../../assets/images/background2.png"),
    title: "Digital Health Transformation",
    description: "Digital health technologies are transforming the way healthcare is delivered.",
  },
];
const ItemImage1 = require("../../assets/images/bleach.png");
const ItemImage2 = require("../../assets/images/hypertension.jpg");
const ItemImage3 = require("../../assets/images/Phobia.jpg");
const ItemImage4 = require("../../assets/images/female-doc.png");
const ItemImage5 = require("../../assets/images/female-doc2.png");
const ItemImage6 = require("../../assets/images/eclipse.png");
const ItemImage7 = require("../../assets/images/bmicheck.png");
const ItemImage8 = require("../../assets/images/periodtracker.png");
const ItemImage9 = require("../../assets/images/symcheck.png");
const ItemImage10 = require("../../assets/images/findoc.png");
const ItemImage11 = require("../../assets/images/penis.jpg");
const ItemImage12 = require("../../assets/images/spice1.png");
const ItemImage13 = require("../../assets/images/spice2.png");
const ItemImage14 = require("../../assets/images/spice3.png");
const ItemImage15 = require("../../assets/images/contra.jpg");
const ItemImage16 = require("../../assets/images/vax.jpg");
const ItemImage17 = require("../../assets/images/event1.png");
const ItemImage18 = require("../../assets/images/event2.png");
const ItemImage19 = require("../../assets/images/event3.png");
const ItemImage20 = require("../../assets/images/gym.png");
const ItemImage21 = require("../../assets/images/fitness.png");
const ItemImage22 = require("../../assets/images/sleep.png");
const ItemImage23 = require("../../assets/images/exercise.png");
const ItemImage24 = require("../../assets/images/eye.jpg");
const ItemImage25 = require("../../assets/images/headache.jpg");
const ItemImage26 = require("../../assets/images/anxiety.jpg");
const ItemImage27 = require("../../assets/images/eczema.jpg");


const featuredImage1 = require("../../assets/images/bgblue.png");
const featuredImage2 = require("../../assets/images/black_nurse.png");

const searchIcon = require("../../assets/images/search.png");
const notificationsIcon = require("../../assets/images/notification.png");
const chevronIcon = require("../../assets/images/chevron.png");

const Home = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [isRefreshing, setIsRefreshing] = useState(false); // Renamed from refreshing for clarity
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      if (!initialLoadComplete) {
        setIsLoading(true);
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (error) {
          console.error("Initial load error:", error);
        } finally {
          setIsLoading(false);
          setInitialLoadComplete(true);
        }
      }
    };

    loadInitialData();
  }, [initialLoadComplete]);

  const healthListItems = [
    { id: 1, image: ItemImage25, title: "Headache" },
    // { id: 2, image: ItemImage27, title: "Eczema" },
    { id: 2, image: ItemImage3, title: "Phobia" },
    { id: 3, image: ItemImage2, title: "Hypertension" },
    { id: 4, image: ItemImage1, title: "Skin Bleaching" },
    { id: 5, image: ItemImage26, title: "Anxiety" },
  ];

  const healthListItems1 = [
    { id: 1, image: ItemImage21, title: "Weight Loss" },
    { id: 2, image: ItemImage22, title: "Sleep" },
    { id: 3, image: ItemImage23, title: "Physical Exercise" },
    { id: 4, image: ItemImage24, title: "Eye Health" },
  ];

  const newSectionItems = [
    { id: 1, image: ItemImage7, title: "BMI Checker", screen: "bmi/index" },
    { id: 2, image: ItemImage8, title: "Period Tracker", screen: "period/index" },
    { id: 3, image: ItemImage9, title: "Symptom Checker", screen: "symptom1/index" },
  ];

  const lifestyleListItems = [
    {
      id: 1,
      image: ItemImage4,
      title: "Tomi recovers from Column Cancer",
      description: "Get to know the heroes who are making big impacts on the communities through health innovation and projects",
      category: "Health & Wellness",
      readTime: "5 min read"
    },
    {
      id: 2,
      image: ItemImage5,
      title: "“I lost 30 pounds in 2 weeks, you can too” - AJ Koal",
      description: "Get to know the heroes who are making big impacts on the communities through health innovation and projects",
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

  const lifestyleListItems2 = [
    {
      id: 1,
      image: ItemImage17,
      title: "NHIS Conference 2025",
      description: "Get to know the heroes who are making big impacts on the communities through health innovation and projects",
    },
    {
      id: 2,
      image: ItemImage18,
      title: "DigiHealth Global 2025",
      description: "Get to know the heroes who are making big impacts on the communities through health innovation and projects",
    },
    {
      id: 3,
      image: ItemImage19,
      title: "NHIS Conference 2025",
      description: "Get to know the heroes who are making big impacts on the communities through health innovation and projects",
    },
    {
      id: 4,
      image: ItemImage17,
      title: "DigiHealth Global 2025",
      description: "Get to know the heroes who are making big impacts on the communities through health innovation and projects",
    },
  ];

  const exposingMythsListItems = [
    { id: 1, image: ItemImage11, title: "Penis size doesn’t matter" },
    { id: 2, image: ItemImage12, title: "Spicy foods don't induce labour" },
    { id: 3, image: ItemImage15, title: "Contraceptives don't cause infertility" },
    { id: 4, image: ItemImage16, title: "Vaccines do not cause autism" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <ImageBackground source={item.image} style={styles.backgroundImage}>
          <View style={styles.overlay}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </ImageBackground>
      </View>
    );
  };

  // Add this useEffect to handle initial load
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Simulate data loading (replace with actual data fetching)
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
      } catch (error) {
        console.error("Initial load error:", error);
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Modify your onRefresh function
  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate refresh (replace with actual refresh logic)
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const navigateToDetail = (item) => {
    // Create a mapping between health condition titles and article IDs
    const conditionToArticleMap = {
      // Map specific health conditions to article IDs
      "Headache": 7,
      "Hypertension": 9,
      "Anxiety": 4,
      "Skin Bleaching": 10,
      "Phobia": 11,
      "Diabetes": 2,
      "Mental Health": 4,
      "General Ailments": 1,
      "Weight Loss": 12,
      "Sleep": 13,
      "Physical Exercise": 15,
      "Eye Health": 14,
    };

    // Default to article ID 1 if no match found
    let articleId = conditionToArticleMap[item] || 1;

    // Navigate to the article detail screen
    navigation.navigate("articles/index", { articleId });
  };

  const navigateToMythDetail = (item) => {
    let id;

    // If item is a string (title), find the corresponding myth
    if (typeof item === 'string') {
      const matchingMyth = mythsItems.find((myth) =>
        myth.title.toLowerCase().includes(item.toLowerCase())
      );

      if (matchingMyth) {
        id = matchingMyth.id;
      } else {
        id = 1; // Default to first myth if no match found
      }
    } else {
      id = item.id;
    }

    navigation.navigate("mythdetail/index", { id });
  };

  const renderInspirationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.inspirationCard}
      onPress={() => navigation.navigate("inspiration/index")}
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

  const renderInspirationItem2 = ({ item }) => (
    <TouchableOpacity
      style={styles.inspirationCard}
      onPress={() => navigation.navigate("events/index")}
    >
      <Image
        source={item.image}
        style={styles.inspirationImage}
        resizeMode="cover"
      />
      <View style={styles.inspirationCardContent}>
        <Text style={styles.inspirationCardTitle}>{item.title}</Text>
        <Text style={styles.inspirationCardDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const LoadingIndicator = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#000" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        isSearchVisible={isSearchVisible}
        onSearchPress={() => setIsSearchVisible(true)}
        onSearchClose={() => setIsSearchVisible(false)}
      />

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ScrollView
          vertical
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, width: "100%" }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Swiper Section */}
          <Carousel
            data={images}
            renderItem={renderItem}
            width={screenWidth}
            style={styles.swiper}
            autoPlay={true}
            autoPlayInterval={3000}
            loop={true}
            onSnapToItem={(index) => setActiveIndex(index)}
          />
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
              <TouchableOpacity onPress={() => navigation.navigate("Library")}>
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
                <TouchableOpacity onPress={() => navigateToDetail(item.title)}>
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
              <TouchableOpacity onPress={() => navigation.navigate("Library")}>
                <View style={styles.seeMoreContainer}>
                  <Text style={styles.seeMoreText}>SEE MORE</Text>
                  <Image source={chevronIcon} style={styles.chevronIcon} />
                </View>
              </TouchableOpacity>
            </View>
            <FlatList
              data={healthListItems1}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigateToDetail(item.title)}>
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
              <TouchableOpacity onPress={() => navigation.navigate("myths/index")}>
                <View style={styles.seeMoreContainer}>
                  <Text style={styles.seeMoreText}>SEE MORE</Text>
                  <Image source={chevronIcon} style={styles.chevronIcon} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.mythsGrid}>
              {exposingMythsListItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.mythsGridItem, { width: (screenWidth - 40) / 3 }]}
                  onPress={() => navigateToMythDetail(item.title)}
                >
                  <Image source={item.image} style={styles.mythsGridImage} />
                  <Text style={styles.mythsGridTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
                onPress={() => navigateToDetail("Talk to an Expert")}
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
                <TouchableOpacity onPress={() => navigation.navigate(item.screen)}>
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

          {/* Find a doctor Section */}
          <View style={styles.lifestyleSection}>
            <View style={styles.lifestyleContent}>
              <Text style={styles.lifestyleTitle}>Find a Doctor or a Hospital</Text>
              <Text style={styles.lifestyleDescription}>
                Are you in an emergency or just need to find a doctor or hospital for your health needs?
              </Text>
              <TouchableOpacity
                style={styles.lifestyleButton}
                onPress={() => navigation.navigate('findoctor/index')}
              >
                <Text style={styles.lifestyleButtonText}>Tap Here</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={ItemImage10}
              style={styles.lifestyleImage}
              resizeMode="cover"
            />
          </View>

          {/* Events Section */}
          <View style={[styles.listContainer, { marginTop: screenHeight * 0.025 }]}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Events Lineup</Text>
              <TouchableOpacity onPress={() => navigation.navigate("events/index")}>
                <View style={styles.seeMoreContainer}>
                  <Text style={styles.seeMoreText}>SEE MORE</Text>
                  <Image source={chevronIcon} style={styles.chevronIcon} />
                </View>
              </TouchableOpacity>
            </View>
            <FlatList
              data={lifestyleListItems2}
              renderItem={renderInspirationItem2}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
              contentContainerStyle={styles.inspirationList}
            />
          </View>

          {/* Gym Section */}
          <View style={styles.lifestyleSection1}>
            <Image
              source={ItemImage20}
              style={styles.lifestyleImage1}
              resizeMode="cover"
            />
            <View style={styles.lifestyleContent1}>
              <Text style={styles.lifestyleTitle1}>Map out a Gym</Text>
              <Text style={styles.lifestyleDescription1}>
                Trying to get fit?
                Use this feature to locate a gym nearby.
              </Text>
              <TouchableOpacity
                style={styles.lifestyleButton1}
                onPress={() => navigation.navigate('gym/index')}
              >
                <Text style={styles.lifestyleButtonText1}>Let's go!</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Agencies Section */}
          <View style={[styles.listContainer, { marginTop: screenHeight * 0.025 }]}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Agencies & Organizations</Text>
              <TouchableOpacity onPress={() => navigation.navigate("organizations/index")}>
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

          {/* Policies Section */}
          <View style={[styles.listContainer, { marginTop: screenHeight * 0.025 }]}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Policies & Insurances</Text>
              <TouchableOpacity onPress={() => navigation.navigate("policies/index")}>
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
        </ScrollView>
      )}
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // paddingTop: Platform.OS === 'ios' ? 2 : StatusBar.currentHeight, // Add paddingTop to shift content down
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
    borderRadius: 8,
    shadowColor: "#adadad",
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
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
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
    color: '#000000',
    marginBottom: 4,
  },
  inspirationCardDescription: {
    fontSize: Dimensions.get('window').width * 0.032,
    color: '#666',
    lineHeight: 14,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
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
    borderRadius: 2,
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
    paddingVertical: Dimensions.get('window').width * 0.030,
    paddingHorizontal: Dimensions.get('window').width * 0.060,
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
  lifestyleSection: {
    flexDirection: 'row',
    padding: Dimensions.get('window').width * 0.04,
    marginHorizontal: Dimensions.get('window').width * 0.025,
    marginVertical: Dimensions.get('window').height * 0.02,
    backgroundColor: '#F5F7FF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lifestyleContent: {
    flex: 1,
    paddingRight: Dimensions.get('window').width * 0.04,
  },
  lifestyleTitle: {
    fontSize: Dimensions.get('window').width * 0.041,
    fontWeight: '700',
    color: '#000000',
    marginBottom: Dimensions.get('window').height * 0.01,
  },
  lifestyleDescription: {
    fontSize: Dimensions.get('window').width * 0.034,
    color: '#666',
    lineHeight: 16,
    marginBottom: Dimensions.get('window').height * 0.02,
  },
  lifestyleButton: {
    backgroundColor: '#000000',
    paddingVertical: Dimensions.get('window').width * 0.033,
    paddingHorizontal: Dimensions.get('window').width * 0.10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  lifestyleButtonText: {
    color: 'white',
    fontSize: Dimensions.get('window').width * 0.035,
    fontWeight: '600',
  },
  lifestyleImage: {
    width: Dimensions.get('window').width * 0.43,
    height: Dimensions.get('window').width * 0.59,
    borderRadius: 4,
  },
  lifestyleSection1: {
    flexDirection: 'row',
    padding: Dimensions.get('window').width * 0.04,
    marginHorizontal: Dimensions.get('window').width * 0.025,
    marginVertical: Dimensions.get('window').height * 0.02,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lifestyleContent1: {
    flex: 1,
    paddingLeft: Dimensions.get('window').width * 0.06,
  },
  lifestyleTitle1: {
    fontSize: Dimensions.get('window').width * 0.042,
    fontWeight: '700',
    color: '#000000',
    marginBottom: Dimensions.get('window').height * 0.01,
  },
  lifestyleDescription1: {
    fontSize: Dimensions.get('window').width * 0.034,
    color: '#666',
    lineHeight: 18,
    marginBottom: Dimensions.get('window').height * 0.02,
  },
  lifestyleButton1: {
    backgroundColor: '#000000',
    paddingVertical: Dimensions.get('window').width * 0.033,
    paddingHorizontal: Dimensions.get('window').width * 0.10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  lifestyleButtonText1: {
    color: 'white',
    fontSize: Dimensions.get('window').width * 0.035,
    fontWeight: '600',
  },
  lifestyleImage1: {
    width: Dimensions.get('window').width * 0.43,
    height: Dimensions.get('window').width * 0.59,
    borderRadius: 4,
  },
  mythsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Dimensions.get('window').width * 0.003, // 2.5% padding
  },
  mythsGridItem: {
    marginBottom: Dimensions.get('window').height * 0.02, // Space between rows
    alignItems: 'center',
  },
  mythsGridImage: {
    width: '100%',
    height: Dimensions.get('window').width * 0.25, // Adjust height based on screen width
    borderRadius: 6,
    marginBottom: 8,
  },
  mythsGridTitle: {
    fontSize: Dimensions.get('window').width * 0.032,
    fontWeight: "600",
    textAlign: "center",
    color: "#0C1549",
    paddingHorizontal: 4,
  },
});

export default Home;