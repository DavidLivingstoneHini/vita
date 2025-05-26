import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import SearchBox from "./searchBox";

const notificationsIcon = require("../assets/images/notification.png");

const Header = () => {
  const router = useRouter();
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <SearchBox
              onClose={() => setIsSearchVisible(false)}
              onFocus={() => setIsSearchVisible(true)}
            />
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push("notification")}
          >
            <Image
              source={notificationsIcon}
              style={styles.notificationIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    width: "100%",
    backgroundColor: "#ffffff",
    zIndex: 1000,
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    zIndex: 1000,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchContainer: {
    flex: 1.4,
  },
  notificationButton: {
    padding: 8,
    marginLeft: 12,
  },
  notificationIcon: {
    width: 24,
    height: 24,
    tintColor: "#333",
  },
});

export default Header;
