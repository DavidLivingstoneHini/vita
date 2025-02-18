import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  Dimensions,
  Platform,
  PixelRatio,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Dummy data for "For You" section
const forYouData = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  image: `https://picsum.photos/200/300?random=${i}`,
  descriptionTitle: `Image ${i} Description Title`,
  text: `Image ${i} Description`,
}));

// Dummy data for "Editor's Pick"
const editorsPick = {
  image: "https://picsum.photos/200/300?random=800",
  descriptionTitle: "Local Heroes of Health care  in Africa",
  text: "Get to know the heroes who are making big impacts on the communities through health innovation and projects",
};

// Dummy data for buttons
const buttonsData = Array.from({ length: 21 }, (_, i) => ({
  id: i,
  text: i === 0 ? "For You" : `Button ${i}`,
}));


// Normalize font size across different screen sizes
const normalizeFont = (size) => {
  const scale = Dimensions.get('window').width / 375; // 375 is standard iPhone width
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Get dynamic dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const vw = screenWidth / 100;
const vh = screenHeight / 100;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const HEADER_HEIGHT = Platform.OS === 'ios' ? vh * 5.5 : vh * 7;

const News = () => {
  const [selectedButton, setSelectedButton] = useState(buttonsData[0]);
  const [refreshing, setRefreshing] = useState(false);
  const [dimensions, setDimensions] = useState({ screenWidth, screenHeight });

  // Handle screen rotation and dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        screenWidth: window.width,
        screenHeight: window.height,
      });
    });

    return () => subscription?.remove();
  }, []);

  const renderContent = () => {
    if (selectedButton.id === 0) {
      return <ForYouContent selectedButton={selectedButton} />;
    } else {
      return (
        <View>
          <Text>Content for Button {selectedButton.id}</Text>
        </View>
      );
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // TO DO: Implement your refresh logic here (e.g., API calls, data updates)
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Simulate refresh delay
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={[styles.title, { fontSize: normalizeFont(18) }]}>
              News
            </Text>
          </View>
        </View>

        <View
          style={styles.mainContent}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
        >
          <View style={[styles.buttonsContainer, { height: vh * 20 }]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.multiRowScrollView}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <View style={styles.buttonRowsContainer}>
            {Array.from({ length: 3 }, (_, rowIndex) => (
              <View key={rowIndex} style={styles.buttonRow}>
                {buttonsData
                  .slice(rowIndex * 7, (rowIndex + 1) * 7)
                  .map((button) => (
                    <TouchableOpacity
                      key={button.id}
                      style={[
                        styles.smallButton,
                        selectedButton.id === button.id && styles.selectedSmallButton,
                        { minWidth: vw * 20 }, // Ensure buttons aren't too small
                      ]}
                      onPress={() => setSelectedButton(button)}
                    >
                      <Text
                        style={[
                          styles.smallButtonText,
                          selectedButton.id === button.id && { color: "#fff" },
                          { fontSize: normalizeFont(12) },
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {button.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      <View style={styles.contentContainer}>{renderContent()}</View>
      </View>
    </View>
    </SafeAreaView>
 );
};

const ForYouContent = ({ selectedButton }) => {
  const navigation = useNavigation();
  
  return (
    <ScrollView style={forYouStyles.forYouContainer}>
      <View style={forYouStyles.editorsPickContainer}>
        <Text style={[forYouStyles.editorsPickTitle, { fontSize: normalizeFont(20) }]}>
          Editor's Pick
        </Text>
        <Image
          source={{ uri: editorsPick.image }}
          style={[forYouStyles.editorsPickImage, { height: vh * 25 }]}
          resizeMode="cover"
        />
        <Text style={[forYouStyles.descriptionTitle, { fontSize: normalizeFont(14) }]}>
          {editorsPick.descriptionTitle}
        </Text>
        <Text style={[forYouStyles.forYouText, { fontSize: normalizeFont(13) }]}>
          {editorsPick.text}
        </Text>
      </View>

      <View style={forYouStyles.listTitleContainer}>
        <Text style={[forYouStyles.listTitle, { fontSize: normalizeFont(18) }]}>
          {selectedButton.text}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("events/index")}>
          <Text style={[forYouStyles.seeAll, { fontSize: normalizeFont(12) }]}>
            See All
          </Text>
        </TouchableOpacity>
      </View>

      {forYouData.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={forYouStyles.forYouItem}
          onPress={() => console.log(`Image ${item.id} pressed`)}
        >
          <Image
            source={{ uri: item.image }}
            style={[forYouStyles.forYouImage, { height: vh * 20 }]}
            resizeMode="cover"
          />
          <Text style={[forYouStyles.descriptionTitle, { fontSize: normalizeFont(14) }]}>
            {item.descriptionTitle}
          </Text>
          <Text style={[forYouStyles.forYouText, { fontSize: normalizeFont(13) }]}>
            {item.text}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : 0,
  },
  header: {
    height: HEADER_HEIGHT,
    paddingHorizontal: vw * 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: vw * 4,
    paddingVertical: vh * 1.5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontWeight: '700',
  },
  buttonsContainer: {
    paddingVertical: vh * 1.5,
    paddingHorizontal: vw * 4,
    marginBottom: vh * 1,
  },
  buttonRowsContainer: {
    flexDirection: "column",
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: vh * 1,
  },
  multiRowScrollView: {
    width: "100%",
  },
  smallButton: {
    marginRight: vw * 2,
    marginBottom: vh * 1,
    paddingHorizontal: vw * 4,
    paddingVertical: vh * 1,
    borderRadius: 8,
    backgroundColor: "#828282",
  },
  selectedSmallButton: {
    backgroundColor: "#1C3612",
  },
  smallButtonText: {
    color: "#FFFFFF",
  },
  contentContainer: {
    flex: 1,
    padding: vw * 4,
  },
});

const forYouStyles = StyleSheet.create({
  forYouContainer: {
    flex: 1,
  },
  editorsPickContainer: {
    marginBottom: vh * 2,
    marginTop: vh * 1, 
  },
  editorsPickTitle: {
    fontWeight: "bold",
    marginBottom: vh * 1.5,
  },
  editorsPickImage: {
    width: "100%",
    borderRadius: 8,
  },
  forYouItem: {
    marginBottom: vh * 2,
  },
  forYouImage: {
    width: "100%",
    borderRadius: 8,
  },
  descriptionTitle: {
    fontWeight: '800',
    marginTop: vh * 1,
    color: "#000000",
  },
  forYouText: {
    marginTop: vh * 0.4,
  },
  listTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vh * 1.5,
  },
  listTitle: {
    fontWeight: "bold",
  },
  seeAll: {
    color: "#000000",
    fontWeight: '500',
  },
});

export default News;