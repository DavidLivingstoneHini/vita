import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  PixelRatio,
  Platform,
} from "react-native";

// Screen Dimensions
const { width, height } = Dimensions.get("window");

// Scaling function
const scale = (size) => (width / 375) * size; // Assuming a base width of 375 (iPhone X)

// Function to get safe area top padding
const getSafeAreaTop = () => {
  if (Platform.OS === "ios") {
    return 40; // Adjust this value as needed for iOS
  }
  return 20; // Default value for Android
};

export default function Library() {
  const [selectedAlphabet, setSelectedAlphabet] = useState(null);
  const glossaryListRef = useRef(null);
  const alphabetRefs = useRef({}); // Ref to store references to alphabet sections

  // Dummy data for categories
  const categories = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    image: `https://picsum.photos/200/300?random=${i}`,
    title: `Category ${i}`,
  }));

  // Dummy data for glossary
  const glossary = {
    alphabets: Array.from({ length: 26 }, (_, i) =>
      String.fromCharCode(65 + i)
    ),
    lists: {
      A: [
        "Abdominal Pain",
        "Acne",
        "Albinism",
        "Alcoholism",
        "Allergies",
        "Alzhemier's Disease",
        "Anaemia",
        "Anxiety",
        "Appendicitis",
        "Arthritis",
        "Asthma",
        "Autism",
      ],
      B: [
        "Abdominal Pain",
        "Acne",
        "Albinism",
        "Alcoholism",
        "Allergies",
        "Alzhemier's Disease",
        "Anaemia",
        "Anxiety",
        "Appendicitis",
        "Arthritis",
        "Asthma",
        "Autism",
      ],
      C: [
        "Abdominal Pain",
        "Acne",
        "Albinism",
        "Alcoholism",
        "Allergies",
        "Alzhemier's Disease",
        "Anaemia",
        "Anxiety",
        "Appendicitis",
        "Arthritis",
        "Asthma",
        "Autism",
      ],
      D: [
        "Abdominal Pain",
        "Acne",
        "Albinism",
        "Alcoholism",
        "Allergies",
        "Alzhemier's Disease",
        "Anaemia",
        "Anxiety",
        "Appendicitis",
        "Arthritis",
        "Asthma",
        "Autism",
      ],
      E: [
        "Abdominal Pain",
        "Acne",
        "Albinism",
        "Alcoholism",
        "Allergies",
        "Alzhemier's Disease",
        "Anaemia",
        "Anxiety",
        "Appendicitis",
        "Arthritis",
        "Asthma",
        "Autism",
      ],
      F: [
        "Abdominal Pain",
        "Acne",
        "Albinism",
        "Alcoholism",
        "Allergies",
        "Alzhemier's Disease",
        "Anaemia",
        "Anxiety",
        "Appendicitis",
        "Arthritis",
        "Asthma",
        "Autism",
      ],
      G: ["Game", "Ghost", "Giraffe"],
      H: ["House", "Happy", "Hockey"],
      I: ["Igloo", "Icecream", "Island"],
      J: ["Jackal", "Jelly", "Journal"],
      K: ["Kite", "Kangaroo", "Keyboard"],
      L: ["Lion", "Lake", "Lollipop"],
      M: ["Mouse", "Music", "Magic"],
      N: ["Nest", "Nutella", "Nation"],
      O: ["Ocean", "Owl", "Orange"],
      P: ["Penguin", "Pizza", "Piano"],
      Q: ["Queen", "Question", "Quiet"],
      R: ["Rabbit", "Rainbow", "Robot"],
      S: ["Sun", "Sea", "Space"],
      T: ["Tiger", "Telescope", "Turtle"],
      U: ["Umbrella", "Unicorn", " Universe"],
      V: ["Vase", "Violet", "Vulture"],
      W: ["Water", "Whale", "Wizard"],
      X: ["X-ray", "Xylophone", "Xerox"],
      Y: ["Yellow", "Yogurt", "Yacht"],
      Z: ["Zebra", "Zoo", "Zip"],
    },
  };

  const scrollToAlphabet = (alphabet) => {
    setSelectedAlphabet(alphabet);

    if (alphabetRefs.current[alphabet]) {
      alphabetRefs.current[alphabet].measureLayout(
        glossaryListRef.current,
        (x, y) => {
          glossaryListRef.current.scrollTo({
            x: 0,
            y: y,
            animated: true,
          });
        },
        (error) => {
          console.log("Error measuring layout: ", error);
        }
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Library Title */}
      <Text style={styles.libraryTitle}>Library</Text>

      <ScrollView
        ref={glossaryListRef}
        vertical
        showsVerticalScrollIndicator={false}
      >
        {/* Categories Section */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.categoriesTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryItem}>
                <Image
                  source={{ uri: category.image }}
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Glossary Section */}
        <View style={styles.glossaryContainer}>
          <Text style={styles.glossaryTitle}>Glossary</Text>

          {/* Alphabet Buttons */}
          <View
            style={[
              styles.alphabetButtonsContainer,
              {
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              },
            ]}
          >
            {glossary.alphabets.map((alphabet) => (
              <TouchableOpacity
                key={alphabet}
                style={[
                  styles.alphabetButton,
                  selectedAlphabet === alphabet && styles.selectedAlphabetButton,
                  { marginLeft: 0, marginRight: 8 },
                ]}
                onPress={() => scrollToAlphabet(alphabet)}
              >
                <Text
                  style={[
                    styles.alphabetButtonText,
                    selectedAlphabet === alphabet && { color: "#fff" },
                  ]}
                >
                  {alphabet}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Vertical List of Alphabets and their corresponding lists */}
          {glossary.alphabets.map((alphabet, index) => (
            <View
              key={alphabet}
              ref={(el) => (alphabetRefs.current[alphabet] = el)} // Store ref
              style={[styles.alphabetSection, { height: "auto" }]}
              onLayout={() => {}} // Force re-render and measure after layout
            >
              <Text style={styles.alphabetTitle}>{alphabet}</Text>
              <View style={styles.listContainer}>
                {glossary.lists[alphabet].map((item) => (
                  <Text key={item} style={styles.listItemText}>
                    {item}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: scale(16),
    paddingVertical: scale(24),
    paddingTop: getSafeAreaTop(), // Add safe area padding
  },
  libraryTitle: {
    fontSize: scale(19),
    fontWeight: "800",
    marginBottom: scale(16),
    textAlign: "left", // Align the title to the left
  },
  categoriesContainer: {
    marginBottom: scale(24),
  },
  categoriesTitle: {
    fontSize: scale(14),
    fontWeight: "800",
    marginBottom: scale(8),
  },
  categoryItem: {
    marginRight: scale(8),
    width: scale(120),
  },
  categoryImage: {
    height: scale(120),
    borderRadius: scale(8),
  },
  categoryTitle: {
    fontSize: scale(12),
    fontWeight: "500",
    marginTop: scale(4),
    textAlign: "center",
  },
  glossaryContainer: {
    flex: 1,
  },
  glossaryTitle: {
    fontSize: scale(14),
    fontWeight: "800",
    marginBottom: scale(16),
  },
  alphabetButtonsContainer: {
    marginBottom: scale(16),
    justifyContent: "flex-start", // Align items to the start
    flexDirection: "row",
    flexWrap: "wrap",
  },
  alphabetButton: {
    marginRight: scale(8),
    marginBottom: scale(8),
    paddingVertical: scale(8),
    paddingHorizontal: scale(10), // Adjusted padding
    borderRadius: scale(8),
    backgroundColor: "#ddd",
    minWidth: scale(28), // Adjusted width
    height: scale(28),
    borderRadius: scale(14), // Adjusted radius
    backgroundColor: "#DEE5DB",
    alignItems: "center", // Center text vertically
    justifyContent: "center", // Center text horizontally
  },
  selectedAlphabetButton: {
    backgroundColorr: "#000000",
  },
  alphabetButtonText: {
    fontSize: scale(13),
    color: "#000000",
    fontWeight: "700",
    textAlign: "center",
  },
  glossaryListContainer: {
    flex: 1,
  },
  alphabetSection: {
    marginBottom: scale(10),
    paddingHorizontal: scale(16),
  },
  alphabetTitle: {
    fontSize: scale(24),
    fontWeight: "700",
    marginBottom: scale(8),
  },
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(11),
  },
  listItemText: {
    fontSize: scale(13),
    marginBottom: scale(8),
  },
});

