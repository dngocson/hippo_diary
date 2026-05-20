import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useThemeColors } from "@/components/Themed";

export default function TabLayout() {
  const { background, tint, tabIconDefault, tabIconSelected, button } =
    useThemeColors([
      "background",
      "tint",
      "tabIconDefault",
      "tabIconSelected",
      "button",
    ]);
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tabIconSelected,
        tabBarInactiveTintColor: tabIconDefault,
        tabBarStyle: {
          backgroundColor: background,
          borderTopWidth: 0,
          elevation: 0,
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="tab1"
        options={{
          title: "Diary",
          tabBarIcon: ({ color }) => (
            <Ionicons name="book-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tab2"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={22} color={color} />
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
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: button,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Ionicons name="pencil" size={24} color="#fff" />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            // TODO: Open write diary modal or navigate to write screen
          },
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color }) => (
            <Ionicons name="bar-chart-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
