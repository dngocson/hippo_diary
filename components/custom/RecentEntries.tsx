import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../Themed";

interface DiaryEntry {
  id: string;
  title: string;
  date: string;
  preview: string;
  image?: any;
}

const MOCK_ENTRIES: DiaryEntry[] = [
  {
    id: "1",
    title: "A calm morning",
    date: "Today, 8:30 AM",
    preview: "Started the day with sunlight and a good cup of coffee...",
    image: require("@/assets/images/480d4a56-7861-4241-a625-51df77b793f3.png"),
  },
  {
    id: "2",
    title: "Grateful for today",
    date: "May 18, 2024, 10:15 PM",
    preview: "There are so many small things that make life beautiful...",
    image: require("@/assets/images/5345d76f-4f54-417d-b90a-07d043cdec99.png"),
  },
];

function EntryCard({ entry }: { entry: DiaryEntry }) {
  const { input, primary, secondaryText, border, icon } = useThemeColors([
    "input",
    "primary",
    "secondaryText",
    "border",
    "icon",
  ]);

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: input,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: border,
        padding: 12,
        marginBottom: 12,
      }}
    >
      {entry.image && (
        <Image
          source={entry.image}
          style={{
            width: 70,
            height: 70,
            borderRadius: 12,
            marginRight: 12,
          }}
        />
      )}
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "700",
            color: primary,
          }}
        >
          {entry.title}
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: secondaryText,
            marginTop: 2,
          }}
        >
          {entry.date}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: secondaryText,
            marginTop: 4,
          }}
          numberOfLines={2}
        >
          {entry.preview}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={18} color={icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={18} color={icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function RecentEntries() {
  const { primary, tint } = useThemeColors(["primary", "tint"]);

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: primary,
          }}
        >
          Recent Entries
        </Text>
        <TouchableOpacity>
          <Text
            style={{
              fontSize: 13,
              color: tint,
              fontWeight: "500",
            }}
          >
            See all
          </Text>
        </TouchableOpacity>
      </View>

      {MOCK_ENTRIES.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </View>
  );
}
