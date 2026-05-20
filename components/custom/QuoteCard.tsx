import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../Themed";

export function QuoteCard() {
  const { card } = useThemeColors(["card"]);

  return (
    <View
      style={{
        marginHorizontal: 20,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: card,
        height: 180,
      }}
    >
      <ImageBackground
        source={require("@/assets/images/5345d76f-4f54-417d-b90a-07d043cdec99.png")}
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}
        imageStyle={{ borderRadius: 20 }}
        resizeMode="cover"
      >
        <Text
          style={{
            fontSize: 28,
            color: "#A06D4A",
            marginBottom: 4,
            fontWeight: "300",
          }}
        >
          "
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#4A3228",
            lineHeight: 26,
          }}
        >
          Every day{"\n"}is a new page{"\n"}in your story.
        </Text>
        <TouchableOpacity style={{ marginTop: 12 }}>
          <Ionicons name="heart-outline" size={22} color="#A06D4A" />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}
