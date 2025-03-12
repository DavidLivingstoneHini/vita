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
import { useRouter } from "expo-router";
import { dataStore } from "../../utils/dataStore"; // Adjust path as needed

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
  const router = useRouter();
  const [selectedAlphabet, setSelectedAlphabet] = useState(null);
  const glossaryListRef = useRef(null);
  const alphabetRefs = useRef({});

  // Dummy data for categories
  const categories = [
    { id: 0, image: require("../../assets/images/menshealth.jpg"), title: "Men's Health" },
    { id: 1, image: require("../../assets/images/womenshealth.jpg"), title: "Women's Health" },
    { id: 2, image: require("../../assets/images/mentalhealth.png"), title: "Mental Health" },
    { id: 3, image: require("../../assets/images/ailments.png"), title: "General Ailments" },
    { id: 4, image: require("../../assets/images/reprohealth.png"), title: "Reproductive Health" },
    { id: 5, image: require("../../assets/images/myth.jpg"), title: "Myths" },
    { id: 6, image: require("../../assets/images/contraception.jpg"), title: "Contraception" },
    { id: 7, image: require("../../assets/images/healthy.jpg"), title: "Healthy Living" },
    { id: 8, image: require("../../assets/images/childcare.jpg"), title: "Child Care" },
    { id: 9, image: require("../../assets/images/sti.jpg"), title: "STIs" },
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
    let articleId;

    // Determine articleId based on the item
    switch (item) {
      case "Men's Health":
      case "Women's Health":
        articleId = 2; // Healthy Eating article
        break;
      case "Mental Health":
        articleId = 2; // Healthy Eating
        break;
      case "General Ailments":
      case "Common Cold":
        articleId = 4; // Using Common Cold from health conditions
        break;
      case "Reproductive Health":
        articleId = 1; // Diabetes 101
        break;
      case "Healthy Living":
        articleId = 2; // Healthy Eating
        break;
      case "Hypertension":
        articleId = 3; // Hypertension Management
        break;
      case "Diabetes (Type 1)":
      case "Diabetes (Type 2)":
        articleId = 1; // Diabetes 101
        break;
      default:
        // For any other item or glossary term, try to find a matching article
        const matchingArticle = dataStore.articles.find(article =>
          article.title.toLowerCase().includes(item.toLowerCase()) ||
          article.content.toLowerCase().includes(item.toLowerCase())
        );

        const matchingCondition = dataStore.healthConditions.find(condition =>
          condition.title.toLowerCase().includes(item.toLowerCase())
        );

        if (matchingArticle) {
          articleId = matchingArticle.id;
        } else if (matchingCondition) {
          articleId = matchingCondition.id;
        } else {
          articleId = 1; // Default to the first article if no match is found
        }
    }

    // Navigate to the articles screen with the selected article ID
    router.push({
      pathname: "/articles",
      params: { articleId }, // Pass articleId as a query parameter
    });
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

  // Render list item with dot
  const renderListItem = (item, index, array) => {
    return (
      <TouchableOpacity
        key={item}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.6}
        style={styles.listItemContainer}
      >
        <Text style={styles.listItemText}>{item}</Text>
        {index < array.length - 1 && <Text style={styles.listItemDot}>•</Text>}
      </TouchableOpacity>
    );
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
                {glossary.lists[alphabet]?.map((item, index, array) =>
                  renderListItem(item, index, array)
                )}
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
    marginBottom: scale(16),
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
    width: scale(100),
    height: scale(100),
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
    marginBottom: scale(22),
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
    marginBottom: scale(18),
    paddingHorizontal: scale(6),
  },
  alphabetTitle: {
    fontSize: scale(24),
    fontWeight: "700",
    marginBottom: scale(18),
  },
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(8), // Adjusted gap between items
    justifyContent: "flex-start", // Align items to the start of the row
  },
  listItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "30%", // Adjusted width to fit three items per row
  },
  listItemDot: {
    fontSize: scale(14),
    marginHorizontal: scale(8),
    color: "#848587",
  },
  listItemText: {
    fontSize: scale(13),
  },
});