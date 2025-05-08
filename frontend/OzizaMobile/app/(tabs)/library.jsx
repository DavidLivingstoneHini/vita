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
import { dataStore } from "../../utils/dataStore";

// Screen Dimensions
const { width } = Dimensions.get("window");

// Scaling function
const scale = (size) => (width / 375) * size;

// Function to get safe area top padding
const getSafeAreaTop = () => {
  if (Platform.OS === "ios") {
    return 40;
  }
  return 20;
};

export default function Library() {
  const router = useRouter();
  const [selectedAlphabet, setSelectedAlphabet] = useState(null);
  const glossaryListRef = useRef(null);
  const alphabetRefs = useRef({});

  // Article ID mapping for all library items
  const articleMappings = {
    // Categories
    "Men's Health": 2,
    "Women's Health": 2,
    "Mental Health": 4,
    "General Ailments": 1,
    "Reproductive Health": 1,
    "Myths": 5,
    "Contraception": 6,
    "Healthy Living": 2,
    "Child Care": 3,
    "STIs": 1,

    // Glossary terms - A
    "Abdominal Pain": 1,
    "Acne": 1,
    "Albinism": 1,
    "Alcoholism": 4,
    "Allergies": 1,
    "Alzheimer's Disease": 4,
    "Anaemia": 1,
    "Anxiety": 4,
    "Appendicitis": 1,
    "Arthritis": 1,
    "Asthma": 6,
    "Autism": 4,

    // B
    "Back Pain": 1,
    "Baldness": 1,
    "Bilharzia": 1,
    "Birth Defects": 1,
    "Blindness": 1,
    "Blood Cell Disorders": 1,
    "Body Piercings and Tattoos": 1,
    "Brain Disorders": 4,
    "Breast Cancer": 1,
    "Bug Bites": 1,
    "Burns": 1,

    // C
    "Cancer": 1,
    "Cavities": 1,
    "Chest Pain": 1,
    "Chlamydia": 1,
    "Cholera": 1,
    "Common Cold": 1,
    "Constipation": 1,
    "Coronary Artery Disease": 1,
    "COVID-19": 1,

    // D
    "Dandruff": 1,
    "Deafness": 1,
    "Dengue": 1,
    "Depression": 4,
    "Diabetes (Type 1)": 2,
    "Diabetes (Type 2)": 2,
    "Diarrhoea": 1,
    "Digestion Problems": 1,
    "Dizziness": 1,
    "Drug Addiction": 4,

    // E
    "Ear Infections": 1,
    "Eating Disorders": 4,
    "Ebola": 1,
    "Eczema": 1,
    "Epilepsy": 4,

    // F
    "Fever": 1,
    "Female Reproductive System": 1,
    "Female Circumcision": 1,
    "Fibroids": 1,
    "Flu": 1,
    "Food Addiction": 4,
    "Food Poisoning": 1,
    "Fungal Skin Infection": 1,

    // G
    "Gallstones": 1,
    "Genital Herpes": 1,
    "Glaucoma": 1,
    "Gonorrhea": 1,
    "Gout": 1,
    "Guinea Worm": 1,
    "Gum Disease": 1,

    // H
    "Hair Loss": 1,
    "Headache": 1,
    "Heartburn": 1,
    "Hemorrhoids": 1,
    "Hepatitis": 1,
    "Hernia": 1,
    "HIV": 1,
    "HPV": 1,
    "Hypertension": 3,

    // I
    "Improving Brain Function": 4,
    "Indigestion": 1,
    "Infertility": 1,
    "Insomnia": 4,

    // J
    "Joint Pain": 1,

    // K
    "Kidney Problems": 1,
    "Kidney Stones": 1,
    "Kwashiorkor": 1,

    // L
    "Leg Pain": 1,
    "Leishmaniasis": 1,
    "Leprosy": 1,
    "Lice": 1,
    "Low Testosterone": 1,
    "Lung Cancer": 1,

    // M
    "Malaria": 1,
    "Male Menopause": 1,
    "Male Reproductive System": 1,
    "Malnutrition": 1,
    "Masturbation": 1,
    "Menopause": 1,
    "Men's Health": 2,
    "Meningitis": 1,
    "Migraine": 1,
    "Mouth Ulcers": 1,
    "Mpox": 1,
    "Multiple Sclerosis": 4,
    "Mumps": 1,

    // N
    "Nausea": 1,
    "Night Eating": 4,
    "Nosebleed": 1,
    "Nutrition (Healthy Food)": 2,

    // O
    "Obesity": 2,
    "Onchocerciasis": 1,
    "Overweight Children": 2,

    // P
    "Parkinson's Disease": 4,
    "Phobia": 4,
    "Physical Exercise": 2,
    "Pneumonia": 1,
    "Pornography Addiction": 4,
    "Premature Ejaculation": 1,
    "Prostate Cancer": 1,

    // Q
    // Empty as requested

    // R
    "Rabies": 1,
    "Rheumatism": 1,

    // S
    "Safe Sex": 1,
    "Seizure": 4,
    "Sex and Pleasure": 1,
    "Sex Problems in Women": 1,
    "Sickle Cell Anaemia": 1,
    "Skin Disorders": 1,
    "Sleep": 4,
    "Sleeping Sickness": 1,
    "Smoking": 1,
    "Snoring": 1,
    "Spinal Cord Injury": 1,
    "Stomach Ulcer": 1,
    "Stress Management": 4,
    "Stroke": 1,
    "Swollen Testicles": 1,
    "Syphilis": 1,

    // T
    "Teething": 1,
    "Tongue Problems": 1,
    "Tonsillitis": 1,
    "Trachoma": 1,
    "Tuberculosis": 1,
    "Typhoid Fever": 1,

    // U
    "Ulcers": 1,
    "Urinary Incontinence in Men": 1,
    "Urinary Incontinence in Women": 1,
    "Urinary Tract Infection": 1,

    // V
    "Vaginal Infection": 1,

    // W
    "Weight Loss": 2,
    "Weight Management": 2,
    "Women's Health": 2,

    // X-Y-Z
    // Empty as requested
  };

  // Categories data with article IDs
  const categories = [
    { id: 0, image: require("../../assets/images/menshealth.jpg"), title: "Men's Health", articleId: 2 },
    { id: 1, image: require("../../assets/images/womenshealth.jpg"), title: "Women's Health", articleId: 2 },
    { id: 2, image: require("../../assets/images/mentalhealth.png"), title: "Mental Health", articleId: 4 },
    { id: 3, image: require("../../assets/images/ailments.png"), title: "General Ailments", articleId: 1 },
    { id: 4, image: require("../../assets/images/reprohealth.png"), title: "Reproductive Health", articleId: 1 },
    { id: 5, image: require("../../assets/images/myth.jpg"), title: "Myths", articleId: 5 },
    { id: 6, image: require("../../assets/images/contraception.jpg"), title: "Contraception", articleId: 6 },
    { id: 7, image: require("../../assets/images/healthy.jpg"), title: "Healthy Living", articleId: 2 },
    { id: 8, image: require("../../assets/images/childcare.jpg"), title: "Child Care", articleId: 3 },
    { id: 9, image: require("../../assets/images/sti.jpg"), title: "STIs", articleId: 1 },
  ];

  // Glossary data structure
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
    let articleId = articleMappings[item];

    if (!articleId) {
      // Fallback: Find any article that mentions this term
      const matchingArticle = dataStore.articles.find(article =>
        article.title.toLowerCase().includes(item.toLowerCase()) ||
        article.content.toLowerCase().includes(item.toLowerCase())
      );

      articleId = matchingArticle?.id || 1; // Default to first article
    }

    router.push({
      pathname: "/articles",
      params: { articleId },
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
                onPress={() => router.push({
                  pathname: "/articles",
                  params: { articleId: category.articleId },
                })}
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
    gap: scale(10),
    justifyContent: "flex-start",
  },
  listItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "30%",
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