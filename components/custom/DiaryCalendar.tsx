import React, { useMemo, useRef, useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";

import { Ionicons } from "@expo/vector-icons";

import { addMonths, subMonths, format, setMonth } from "date-fns";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function DiaryCalendar() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );

  const snapPoints = useMemo(() => ["45%"], []);

  const openMonthPicker = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const closeMonthPicker = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const selectMonth = (index: number) => {
    const newDate = setMonth(currentMonth, index);

    setCurrentMonth(newDate);
    closeMonthPicker();
  };

  return (
    <>
      <View className="bg-white rounded-[40px] px-5 pt-4 pb-8">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-5">
          {/* LEFT */}
          <View className="flex-row items-center">
            <View className="w-11 h-11 rounded-xl bg-[#F7F4F2] items-center justify-center mr-3">
              <Ionicons name="calendar-outline" size={22} color="#8B7568" />
            </View>

            <TouchableOpacity
              onPress={openMonthPicker}
              className="flex-row items-center"
            >
              <Text className="text-[18px] font-semibold text-[#2D201B]">
                {format(currentMonth, "MMMM yyyy")}
              </Text>

              <Ionicons
                name="chevron-down"
                size={18}
                color="#8B7568"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>

          {/* RIGHT */}
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setCurrentMonth((prev) => subMonths(prev, 1))}
              className="w-10 h-10 items-center justify-center"
            >
              <Ionicons name="chevron-back" size={22} color="#B29380" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCurrentMonth((prev) => addMonths(prev, 1))}
              className="w-10 h-10 items-center justify-center"
            >
              <Ionicons name="chevron-forward" size={22} color="#B29380" />
            </TouchableOpacity>
          </View>
        </View>

        <Calendar
          current={format(currentMonth, "yyyy-MM-dd")}
          hideArrows
          headerStyle={{ display: "none" }}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: "#F2E2D5",
            },
          }}
        />
      </View>

      {/* Month Slider */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
      >
        {/* Title nằm ngoài FlatList */}
        <BottomSheetView style={{ paddingHorizontal: 24, paddingBottom: 8 }}>
          <Text className="text-[20px] font-semibold text-center">
            Select Month
          </Text>
        </BottomSheetView>

        <BottomSheetFlatList
          data={months}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          renderItem={({ item, index }) => {
            const selected = currentMonth.getMonth() === index;
            return (
              <TouchableOpacity
                onPress={() => selectMonth(index)}
                className={`py-4 px-5 rounded-2xl mb-2 ${
                  selected ? "bg-[#F2E2D5]" : "bg-[#F7F4F2]"
                }`}
              >
                <Text
                  className={`text-[18px] ${
                    selected ? "font-semibold text-[#2D201B]" : "text-[#7D6E65]"
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </BottomSheet>
    </>
  );
}
