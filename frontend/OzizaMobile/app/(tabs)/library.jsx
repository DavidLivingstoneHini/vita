import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
} from "react-native";

// Screen Dimensions
const { width } = Dimensions.get("window");

// Scaling function
const scale = (size) => (width / 375) * size;

// Function to get safe area top padding
const getSafeAreaTop = () => {
  return Platform.OS === "ios" ? 40 : 20;
};

export default function Library() {
  const [selectedAlphabet, setSelectedAlphabet] = useState(null);
  const glossaryListRef = useRef(null);
  const alphabetRefs = useRef({});

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
      U: ["Umbrella", "Unicorn", "Universe"],
      V: ["Vase", "Violet", "Vulture"],
      W: ["Water", "Whale", "Wizard"],
      X: ["X-ray", "Xylophone", "Xerox"],
      Y: ["Yellow", "Yogurt", "Yacht"],
      Z: ["Zebra", "Zoo", "Zip"],
    },
  };

  const handleItemPress = (item) => {
    console.log(`Selected item: ${item}`);
    // You can add navigation here:
    // navigation.navigate('ItemDetails', { item });
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
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => handleItemPress(category.title)}
              >
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
          <View style={styles.alphabetButtonsContainer}>
            {glossary.alphabets.map((alphabet) => (
              <TouchableOpacity
                key={alphabet}
                style={[
                  styles.alphabetButton,
                  selectedAlphabet === alphabet && styles.selectedAlphabetButton,
                ]}
                onPress={() => scrollToAlphabet(alphabet)}
              >
                <Text
                  style={[
                    styles.alphabetButtonText,
                    selectedAlphabet === alphabet && styles.selectedAlphabetText,
                  ]}
                >
                  {alphabet}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Vertical List of Alphabets and their corresponding lists */}
          {glossary.alphabets.map((alphabet) => (
            <View
              key={alphabet}
              ref={(el) => (alphabetRefs.current[alphabet] = el)}
              style={styles.alphabetSection}
            >
              <Text style={styles.alphabetTitle}>{alphabet}</Text>
              <View style={styles.listContainer}>
                {glossary.lists[alphabet]?.map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => handleItemPress(item)}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.listItemText}>{item}</Text>
                  </TouchableOpacity>
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
    paddingTop: getSafeAreaTop(),
  },
  libraryTitle: {
    fontSize: scale(19),
    fontWeight: "800",
    marginBottom: scale(16),
    textAlign: "left",
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(8),
  },
  alphabetButton: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(10),
    borderRadius: scale(14),
    backgroundColor: "#DEE5DB",
    minWidth: scale(28),
    height: scale(28),
    alignItems: "center",
    justifyContent: "center",
  },
  selectedAlphabetButton: {
    backgroundColor: "#000000",
  },
  alphabetButtonText: {
    fontSize: scale(13),
    color: "#000000",
    fontWeight: "700",
    textAlign: "center",
  },
  selectedAlphabetText: {
    color: "#FFFFFF",
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