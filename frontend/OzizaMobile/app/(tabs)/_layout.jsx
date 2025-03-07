import React from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./home";
import News from "./news";
import Library from "./library";
import Settings from "./settings";
import Discover from "./discover";

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

function TabLayout() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="initialRoute"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#828282",
        tabBarStyle: {
          height: 65,
        },
      }}
    >
      <Tab.Screen
        name="Library"
        component={Library}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={focused ? libraryIconFocused : libraryIcon}
              style={{
                width: size,
                height: size,
                resizeMode: "contain",
                tintColor: color,
              }}
            />
          ),
          tabBarLabel: "Library",
        }}
      />
      <Tab.Screen
        name="News"
        component={News}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={focused ? newsIconFocused : newsIcon}
              style={{
                width: size,
                height: size,
                resizeMode: "contain",
                tintColor: color,
              }}
            />
          ),
          tabBarLabel: "News",
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={focused ? homeIconFocused : homeIcon}
              style={{
                width: size,
                height: size,
                resizeMode: "contain",
                tintColor: color,
              }}
            />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Discover"
        component={Discover}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={focused ? discoverIconFocused : discoverIcon}
              style={{
                width: size,
                height: size,
                resizeMode: "contain",
                tintColor: color,
              }}
            />
          ),
          tabBarLabel: "Discover",
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={focused ? moreIconFocused : moreIcon}
              style={{
                width: size,
                height: size,
                resizeMode: "contain",
                tintColor: color,
              }}
            />
          ),
          tabBarLabel: "Settings",
        }}
      />
    </Tab.Navigator>
  );
}

export default TabLayout;