import React from "react";
import { ScrollView, LogBox } from "react-native";
import { View } from "@/components/Themed";
import { DiaryHeader } from "@/components/custom/DiaryHeader";
import { QuickNote } from "@/components/custom/QuickNote";
import { RecentEntries } from "@/components/custom/RecentEntries";
import DiaryCalendar from "@/components/custom/DiaryCalendar";

LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

export default function DiaryTab() {
  return (
    <View className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30, paddingTop: 30 }}
        nestedScrollEnabled
      >
        <DiaryHeader />
        <QuickNote />
        <RecentEntries />
        <DiaryCalendar />
      </ScrollView>
    </View>
  );
}
