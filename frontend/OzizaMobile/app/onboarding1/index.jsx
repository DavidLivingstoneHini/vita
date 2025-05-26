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
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/background.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Dark overlay */}
        <View style={styles.overlay} />

        <View style={styles.progressBarContainer}>
          {/* <View style={[styles.progressBar, styles.activeProgressBar]} />
          <View style={styles.progressBar} /> */}
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.bottomContent}>
            <Text style={styles.title}>Integrated Health Support & Resources</Text>
            <Text style={styles.text}>
              Get instant health updates, expert advice, and access to a rich library of reliable resources — all in one place to help you make informed decisions and stay healthy, every day.
            </Text>
            <Pressable
              onPress={() => router.push("/signup")}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)", // Adjust opacity (0.4) to make darker or lighter
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
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});