import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

export default function OnboardScreen1() {
  return (
    <ImageBackground
      source={{ uri: 'https://picsum.photos/200/300' }} // Replace with your image URL
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, styles.activeProgressBar]} />
        <View style={styles.progressBar} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.bottomContent}>
          <Text style={styles.title}>Welcome to Our App</Text>
          <Text style={styles.text}>Discover new experiences and make memories with our community.</Text>
          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20, 
    marginBottom: 0, 
  },
  progressBar: {
    width: 40,
    height: 5,
    backgroundColor: '#FFFFFF',
    opacity: 0.5,
    marginHorizontal: 5,
  },
  activeProgressBar: {
    opacity: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1, 
    justifyContent: 'flex-end', // Changed to flex-end to move content to the bottom
    backgroundColor: 'transparent', 
  },
  bottomContent: {
    paddingHorizontal: 20, 
    paddingBottom: 40, // Added padding to give some space from the bottom
    backgroundColor: 'transparent', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, 
  },
  nextButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});
