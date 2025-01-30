import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import React, { useState, useRef } from "react";

export default function Library() {
  const [selectedAlphabet, setSelectedAlphabet] = useState(null);
  const glossaryListRef = useRef(null);

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
    if (glossaryListRef.current) {
      const alphabetIndex = glossary.alphabets.indexOf(alphabet);
      glossaryListRef.current.scrollTo({
        y: alphabetIndex * 120,
        animated: true,
      }); // updated height to 120
    }
  };

  return (
    <View style={styles.container}>
      {/* Library Title */}
      <Text style={styles.libraryTitle}>Library</Text>

      <ScrollView vertical showsVerticalScrollIndicator={false}>
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
                  selectedAlphabet === alphabet &&
                    styles.selectedAlphabetButton,
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
          <View ref={glossaryListRef} style={styles.glossaryListContainer}>
            {glossary.alphabets.map((alphabet, index) => (
              <View
                key={alphabet}
                style={[styles.alphabetSection, { height: "inherit" }]}
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
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  libraryTitle: {
    fontSize: 19,
    fontWeight: 800,
    marginBottom: 16,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesTitle: {
    fontSize: 14,
    fontWeight: 800,
    marginBottom: 8,
  },
  categoryItem: {
    marginRight: 8,
    width: 120,
  },
  categoryImage: {
    height: 120,
    borderRadius: 8,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: 500,
    marginTop: 4,
    textAlign: "center",
  },
  glossaryContainer: {
    flex: 1,
  },
  glossaryTitle: {
    fontSize: 14,
    fontWeight: 800,
    marginBottom: 16,
  },
  alphabetButtonsContainer: {
    marginBottom: 16,
    justifyContent: "center",
  },
  alphabetButton: {
    marginRight: 8,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#ddd",
    width: "24px",
    height: "24px",
    borderRadius: 11,
    backgroundColor: "#DEE5DB",
  },
  selectedAlphabetButton: {
    backgroundColorr: "#000000",
  },
  alphabetButtonText: {
    fontSize: 13,
    color: "#000000",
    fontWeight: 700,
  },
  glossaryListContainer: {
    flex: 1,
  },
  alphabetSection: {
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  alphabetTitle: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 8,
  },
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 11,
  },
  listItemText: {
    fontSize: 13,
    marginBottom: 8,
  },
});
