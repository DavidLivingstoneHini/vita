import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import SearchBox from "../components/searchBox";
import { useRouter } from 'expo-router';

const LogoImage = require("../assets/images/ozizawhite.png");

const searchIcon = require("../assets/images/search.png");
const notificationsIcon = require("../assets/images/notification.png");

const Header = ({ onSearchPress, isSearchVisible, onSearchClose }) => {
  // Get status bar height for proper padding
  const statusBarHeight = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#000000' }]}>
      <View style={[
        styles.header,
        isSearchVisible ? styles.headerSearchMode : null,
      ]}>
        {isSearchVisible ? (
          <View style={styles.searchBoxContainer}>
            <SearchBox onClose={onSearchClose} style={styles.searchBox} />
            <TouchableOpacity
              onPress={onSearchClose}
              style={styles.closeButton}
            >
              <Feather name="x" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              onPress={onSearchPress}
              style={styles.iconButton}
            >
              <Image
                source={searchIcon}
                style={styles.icon}
              />
            </TouchableOpacity>

            <Image
              source={LogoImage}
              style={styles.logo}
              resizeMode="contain"
            />

            <TouchableOpacity style={styles.iconButton} onPress={() => router.push("notification")}>
              <Image
                source={notificationsIcon}
                style={styles.icon}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: Platform.OS === 'ios' ? 24 : StatusBar.currentHeight,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    backgroundColor: "#000000",
    minHeight: 60,
  },
  headerSearchMode: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  searchBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingRight: 50,
  },
  searchBox: {
    flex: 1,
    marginRight: 8,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  iconButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
  logo: {
    height: 32,
    width: 120,
    maxWidth: '40%',
  },
});

export default Header;