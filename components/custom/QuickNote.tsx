import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../Themed";

export function QuickNote() {
  const { primary, secondaryText, input, border, icon } = useThemeColors([
    "primary",
    "secondaryText",
    "input",
    "border",
    "icon",
  ]);

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: primary,
          marginBottom: 10,
        }}
      >
        Quick Note
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: input,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: border,
          paddingHorizontal: 14,
          paddingVertical: 14,
        }}
      >
        <Ionicons
          name="pencil-outline"
          size={20}
          color={icon}
          style={{ marginRight: 10 }}
        />
        <TextInput
          placeholder="Write a quick note..."
          placeholderTextColor={secondaryText}
          style={{
            flex: 1,
            fontSize: 14,
            color: primary,
          }}
        />
        <TouchableOpacity
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            backgroundColor: border,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="add" size={20} color={icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
