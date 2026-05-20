import React from "react";
import { View } from "@/components/Themed";
import DiaryCalendar from "@/components/custom/DiaryCalendar";

export default function CalendarTab() {
  return (
    <View className="flex-1 px-4 pt-10">
      <DiaryCalendar />
    </View>
  );
}
