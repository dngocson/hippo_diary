import React from "react";
import { View } from "@/components/Themed";
import { Text } from "react-native";
import { useThemeColors } from "@/components/Themed";

export default function StatsTab() {
  const { primary } = useThemeColors(["primary"]);
  return (
    <View className="flex-1 items-center justify-center">
      <Text style={{ color: primary, fontSize: 18, fontWeight: "600" }}>
        Stats
      </Text>
    </View>
  );
}
