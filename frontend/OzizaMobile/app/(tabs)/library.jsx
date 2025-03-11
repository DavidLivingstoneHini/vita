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
  if (Platform.OS === "ios") {
    return 40; // Adjust for iOS
  }
  return 20; // Default for Android
};

export default function Library() {
  const [selectedAlphabet, setSelectedAlphabet] = useState(null);
  const glossaryListRef = useRef(null);
  const alphabetRefs = useRef({});

  // Dummy data for categories
  const categories = [
    { id: 0, image: require("../../assets/images/ailments.png"), title: "Men's Health" },
    { id: 1, image: require("../../assets/images/reprohealth.png"), title: "Women's Health" },
    { id: 2, image: require("../../assets/images/mentalhealth.png"), title: "Mental Health" },
    { id: 3, image: require("../../assets/images/ailments.png"), title: "General Ailments" },
    { id: 4, image: require("../../assets/images/reprohealth.png"), title: "Reproductive Health" },
    { id: 5, image: require("../../assets/images/ailments.png"), title: "Myths" },
    { id: 6, image: require("../../assets/images/mentalhealth.png"), title: "Contraception" },
    { id: 7, image: require("../../assets/images/reprohealth.png"), title: "Healthy Living" },
    { id: 8, image: require("../../assets/images/ailments.png"), title: "Child Care" },
    { id: 9, image: require("../../assets/images/mentalhealth.png"), title: "STIs" },
  ];

  // Dummy data for glossary
  const glossary = {
    alphabets: Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
    lists: {
      A: [
        "Abdominal Pain",
        "Acne",
        "Albinism",
        "Alcoholism",
        "Allergies",
        "Alzheimer's Disease",
        "Anaemia",
        "Anxiety",
        "Appendicitis",
        "Arthritis",
        "Asthma",
        "Autism",
      ],
      B: [
        "Back Pain",
        "Baldness",
        "Bilharzia",
        "Birth Defects",
        "Blindness",
        "Blood Cell Disorders",
        "Body Piercings and Tattoos",
        "Brain Disorders",
        "Breast Cancer",
        "Bug Bites",
        "Burns",
      ],
      C: [
        "Cancer",
        "Cavities",
        "Chest Pain",
        "Chlamydia",
        "Cholera",
        "Common Cold",
        "Constipation",
        "Coronary Artery Disease",
        "COVID-19",
      ],
      D: [
        "Dandruff",
        "Deafness",
        "Dengue",
        "Depression",
        "Diabetes (Type 1)",
        "Diabetes (Type 2)",
        "Diarrhoea",
        "Digestion Problems",
        "Dizziness",
        "Drug Addiction",
      ],
      E: [
        "Ear Infections",
        "Eating Disorders",
        "Ebola",
        "Eczema",
        "Epilepsy",
      ],
      F: [
        "Fever",
        "Female Reproductive System",
        "Female Circumcision",
        "Fibroids",
        "Flu",
        "Food Addiction",
        "Food Poisoning",
        "Fungal Skin Infection",
      ],
      G: [
        "Gallstones",
        "Genital Herpes",
        "Glaucoma",
        "Gonorrhea",
        "Gout",
        "Guinea Worm",
        "Gum Disease",
      ],
      H: [
        "Hair Loss",
        "Headache",
        "Heartburn",
        "Hemorrhoids",
        "Hepatitis",
        "Hernia",
        "HIV",
        "HPV",
        "Hypertension",
      ],
      I: [
        "Improving Brain Function",
        "Indigestion",
        "Infertility",
        "Insomnia",
      ],
      J: [
        "Joint Pain",
      ],
      K: [
        "Kidney Problems",
        "Kidney Stones",
        "Kwashiorkor",
      ],
      L: [
        "Leg Pain",
        "Leishmaniasis",
        "Leprosy",
        "Lice",
        "Low Testosterone",
        "Lung Cancer",
      ],
      M: [
        "Malaria",
        "Male Menopause",
        "Male Reproductive System",
        "Malnutrition",
        "Masturbation",
        "Menopause",
        "Men's Health",
        "Meningitis",
        "Migraine",
        "Mouth Ulcers",
        "Mpox",
        "Multiple Sclerosis",
        "Mumps",
      ],
      N: [
        "Nausea",
        "Night Eating",
        "Nosebleed",
        "Nutrition (Healthy Food)",
      ],
      O: [
        "Obesity",
        "Onchocerciasis",
        "Overweight Children",
      ],
      P: [
        "Parkinson's Disease",
        "Phobia",
        "Physical Exercise",
        "Pneumonia",
        "Pornography Addiction",
        "Premature Ejaculation",
        "Prostate Cancer",
      ],
      Q: [], // Empty as requested
      R: [
        "Rabies",
        "Rheumatism",
      ],
      S: [
        "Safe Sex",
        "Seizure",
        "Sex and Pleasure",
        "Sex Problems in Women",
        "Sickle Cell Anaemia",
        "Skin Disorders",
        "Sleep",
        "Sleeping Sickness",
        "Smoking",
        "Snoring",
        "Spinal Cord Injury",
        "Stomach Ulcer",
        "Stress Management",
        "Stroke",
        "Swollen Testicles",
        "Syphilis",
      ],
      T: [
        "Teething",
        "Tongue Problems",
        "Tonsillitis",
        "Trachoma",
        "Tuberculosis",
        "Typhoid Fever",
      ],
      U: [
        "Ulcers",
        "Urinary Incontinence in Men",
        "Urinary Incontinence in Women",
        "Urinary Tract Infection",
      ],
      V: [
        "Vaginal Infection",
      ],
      W: [
        "Weight Loss",
        "Weight Management",
        "Women's Health",
      ],
      X: [], // Empty as requested
      Y: [], // Empty as requested
      Z: [], // Empty as requested
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
                  source={category.image}
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
    borderRadius: scale(10),
    backgroundColor: "#DEE5DB",
    minWidth: scale(32),
    height: scale(32),
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
    paddingHorizontal: scale(6),
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