import React from "react";
import { View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useThemeColors } from "@/components/Themed";

export default function TabLayout() {
  const { width: screenWidth } = useWindowDimensions();
  const { background, tabIconDefault, tabIconSelected, button, border } =
    useThemeColors([
      "background",
      "tint",
      "tabIconDefault",
      "tabIconSelected",
      "button",
      "border",
    ]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tabIconSelected,
        tabBarInactiveTintColor: tabIconDefault,
        tabBarStyle: {
          position: "absolute",
          bottom: 24,
          left: 0,
          right: 0,
          marginHorizontal: screenWidth * 0.04,
          height: 72,
          borderRadius: 40,
          backgroundColor: background,
          borderWidth: 1,
          borderColor: border,
          borderTopWidth: 1,
          paddingTop: 10,
          paddingBottom: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.08,
          shadowRadius: 24,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="tab1"
        options={{
          title: "Diary",
          tabBarIcon: ({ color }) => (
            <Ionicons name="book-outline" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tab2"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="write"
        options={{
          title: "",
          tabBarIcon: () => (
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: button,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 28,
                shadowColor: button,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Ionicons name="pencil" size={22} color="#fff" />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color }) => (
            <Ionicons name="bar-chart-outline" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
