import React, { useCallback } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import Home from "./home";
import News from "./news";
import Library from "./library";
import Settings from "./settings";

import libraryIcon from "../../assets/images/library-icon-unfocused.png";
import libraryIconFocused from "../../assets/images/library-icon-focused.png";
import newsIcon from "../../assets/images/news-icon-unfocused.png";
import newsIconFocused from "../../assets/images/news-icon-focused.png";
import homeIcon from "../../assets/images/home-icon-unfocused.png";
import homeIconFocused from "../../assets/images/home-icon-focused.png";
import discoverIcon from "../../assets/images/search-icon-unfocused.png";
import discoverIconFocused from "../../assets/images/search-icon-focused.png";
import moreIcon from "../../assets/images/more-icon-unfocused.png";
import moreIconFocused from "../../assets/images/more-icon-focused.png";

const Tab = createBottomTabNavigator();

// Screen dimensions
const { width, height } = Dimensions.get("window");

// Responsive font size function
const responsiveFontSize = (size) => {
  const scaleFactor = width / 375; // Base width: iPhone SE
  const newSize = size * scaleFactor;
  return Math.ceil(newSize);
};

// Responsive height function
const responsiveHeight = (h) => {
  return height * (h / 812); // Assuming base height of 812 (iPhone XS Max)
};

// Responsive width function
const responsiveWidth = (w) => {
  return width * (w / 375); // Assuming base width of 375 (iPhone SE)
};

function DiscoverScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Discover!</Text>
    </View>
  );
}

function TabLayout() {
  const navigation = useNavigation();
  const route = useRoute();

  useFocusEffect(
    useCallback(() => {
      if (route.params?.reset) {
        navigation.reset({
          index: 2,
          routes: [
            {
              name: "TabLayout",
              state: {
                routes: [{ name: "home" }],
                index: 0,
              },
            },
          ],
        });
      }
    }, [navigation, route])
  );

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#828282",
        tabBarStyle: {
          height: responsiveHeight(70),
          paddingHorizontal: responsiveWidth(15),
        },
      }}
    >
      <Tab.Screen
        name="Library"
        component={Library}
        options={({ focused }) => ({
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={focused ? libraryIconFocused : libraryIcon}
              style={{
                width: responsiveWidth(24), // Responsive icon width
                height: responsiveHeight(24), // Responsive icon height
                resizeMode: "contain",
                tintColor: color,
              }}
            />
          ),
          tabBarLabel: "Library",
          tabBarLabelStyle: {
            fontSize: responsiveFontSize(11.5),
            fontWeight: "500",
          },
        })}
      />
      <Tab.Screen
        name="News"
        component={News}
        options={({ focused }) => ({
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={focused ? newsIconFocused : newsIcon}
              style={{
                width: responsiveWidth(24), // Responsive icon width
                height: responsiveHeight(24), // Responsive icon height
                resizeMode: "contain",
                tintColor: color,
              }}
            />
          ),
          tabBarLabel: "News",
          tabBarLabelStyle: {
            fontSize: responsiveFontSize(11.5),
            fontWeight: "500",
          },
        })}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={({ focused }) => ({
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={focused ? homeIconFocused : homeIcon}
              style={{
                width: responsiveWidth(24), // Responsive icon width
                height: responsiveHeight(24), // Responsive icon height
                resizeMode: "contain",
                tintColor: color,
              }}
            />
          ),
          tabBarLabel: "Home",
          tabBarLabelStyle: {
            fontSize: responsiveFontSize(11.5),
            fontWeight: "500",
          },
        })}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={({ focused }) => ({
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={focused ? discoverIconFocused : discoverIcon}
              style={{
                width: responsiveWidth(24), // Responsive icon width
                height: responsiveHeight(24), // Responsive icon height
                resizeMode: "contain",
                tintColor: color,
              }}
            />
          ),
          tabBarLabel: "Discover",
          tabBarLabelStyle: {
            fontSize: responsiveFontSize(11.5),
            fontWeight: "500",
          },
        })}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={({ focused }) => ({
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={focused ? moreIconFocused : moreIcon}
              style={{
                width: responsiveWidth(24), // Responsive icon width
                height: responsiveHeight(24), // Responsive icon height
                resizeMode: "contain",
                tintColor: color,
              }}
            />
          ),
          tabBarLabel: "Settings",
          tabBarLabelStyle: {
            fontSize: responsiveFontSize(11.5),
            fontWeight: "500",
          },
        })}
      />
    </Tab.Navigator>
  );
}

export default TabLayout;

