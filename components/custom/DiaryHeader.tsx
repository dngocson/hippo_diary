import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../Themed";

export function DiaryHeader() {
  const { primary, secondaryText, icon } = useThemeColors([
    "primary",
    "secondaryText",
    "icon",
  ]);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
      }}
    >
      <TouchableOpacity>
        <Ionicons name="menu-outline" size={28} color={icon} />
      </TouchableOpacity>

      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: primary,
          }}
        >
          Diary 🌿
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: secondaryText,
            marginTop: 2,
          }}
        >
          Take note. Take care.
        </Text>
      </View>

      <TouchableOpacity>
        <Ionicons name="search-outline" size={24} color={icon} />
      </TouchableOpacity>
    </View>
  );
}
