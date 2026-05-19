import React, { useState } from "react";
import { Calendar } from "react-native-calendars";
import { Box } from "@/components/ui/box";
import { View } from "@/components/Themed";
import DiaryCalendar from "@/components/custom/DiaryCalendar";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  return (
    <View className="flex-1 bg-[#F7F4F2]">
      <View className="px-4 pt-10">
        <DiaryCalendar />
      </View>
    </View>
  );
}
