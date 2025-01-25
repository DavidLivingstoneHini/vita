import React from "react";
import { View, Text, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./home";
import News from "./news";
import Library from "./library";

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

function DiscoverScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Discover!</Text>
    </View>
  );
}

function MoreScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>More!</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#828282",
        tabBarStyle: {
          height: 70,
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
                width: size * 1,
                height: size * 1,
                resizeMode: "contain",
                tintColor: color,
              }}
            />
          ),
          tabBarLabel: "Library",
          tabBarLabelStyle: {
            fontSize: 11.5,
            fontWeight: 500
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
                width: size * 1,
                height: size * 1,
                resizeMode: "contain",
                tintColor: color,
              }}
            />
          ),
          tabBarLabel: "News",
          tabBarLabelStyle: {
            fontSize: 11.5,
            fontWeight: 500
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
                width: size * 1,
                height: size * 1,
                resizeMode: "contain",
                tintColor: color,
              }}
            />
          ),
          tabBarLabel: "Home",
          tabBarLabelStyle: {
            fontSize: 11.5,
            fontWeight: 500
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
                width: size * 1,
                height: size * 1,
                resizeMode: "contain",
                tintColor: color,
              }}
            />
          ),
          tabBarLabel: "Discover",
          tabBarLabelStyle: {
            fontSize: 11.5,
            fontWeight: 500
          },
        })}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={({ focused }) => ({
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={focused ? moreIconFocused : moreIcon}
              style={{
                width: size * 1,
                height: size * 1,
                resizeMode: "contain",
                tintColor: color,
              }}
            />
          ),
          tabBarLabel: "More",
          tabBarLabelStyle: {
            fontSize: 11.5,
            fontWeight: 500
          },
        })}
      />
    </Tab.Navigator>
  );
}
