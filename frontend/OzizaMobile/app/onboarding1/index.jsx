import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";

export default function OnboardScreen1() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, styles.activeProgressBar]} />
        <View style={styles.progressBar} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.bottomContent}>
          <Text style={styles.title}>Comprehensive Health Resources</Text>
          <Text style={styles.text}>
            Access a vast library of over 100+ articles on various health
            conditions, stay updated on new content, and get notifications about
            activity on your followed topics.
          </Text>
          <Pressable
            onPress={() => router.push("/onboarding2")}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  progressBarContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 0,
  },
  progressBar: {
    width: 80,
    height: 4,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    opacity: 0.5,
    marginHorizontal: 5,
  },
  activeProgressBar: {
    opacity: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  bottomContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    color: "#FFFFFF",
  },
  text: {
    fontSize: 15,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  buttonPressed: {
    opacity: 0.7,
    backgroundColor: "#FFFFFF",
    color: "black",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
