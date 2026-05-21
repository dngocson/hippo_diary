import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useThemeColors } from "@/components/Themed";

export default function TabLayout() {
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
    <View style={{ flex: 1, backgroundColor: background }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: tabIconSelected,
          tabBarInactiveTintColor: tabIconDefault,
          tabBarStyle: {
            backgroundColor: background,
            borderColor: border,
            borderWidth: 2,
            borderTopWidth: 1,
            paddingBottom: 8,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 24,
            elevation: 2,
            borderRadius: 30,
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
          name="(calendar)"
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
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: button,
                  alignItems: "center",
                  justifyContent: "center",
                  top: -15,
                  shadowColor: button,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.35,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Ionicons name="pencil" size={30} color="#fff" />
              </View>
            ),

            tabBarItemStyle: {
              justifyContent: "center",
              alignItems: "center",
            },
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
    </View>
  );
}
