import React, { useCallback, useMemo, useRef, useState } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { dayNames, monthNames } from "@/constants/Variable";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { addMonths, format, setMonth, subMonths } from "date-fns";
import { useRouter, useFocusEffect } from "expo-router";
import { useThemeColors } from "../Themed";
import { useMemories } from "@/app/services/supabaseMemoryService";
import { useAniversaries } from "@/app/services/supabaseAniversaryService";
import { useMarkedDates } from "@/app/hooks/useMarkedDates";

export default function DiaryCalendar() {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const navigatingRef = useRef(false);
  const theme = useColorScheme();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );

  const { data: memories = [] } = useMemories(currentMonth);
  const { data: aniversaries = [] } = useAniversaries(currentMonth);
  const markedDates = useMarkedDates(
    memories,
    aniversaries,
    selectedDate,
    currentMonth,
  );

  const snapPoints = useMemo(() => ["45%"], []);

  useFocusEffect(
    useCallback(() => {
      navigatingRef.current = false;
    }, []),
  );

  const openMonthPicker = useCallback(
    () => bottomSheetRef.current?.expand(),
    [],
  );
  const closeMonthPicker = useCallback(
    () => bottomSheetRef.current?.close(),
    [],
  );
  const selectMonth = useCallback(
    (index: number) => {
      setCurrentMonth((prev) => setMonth(prev, index));
      closeMonthPicker();
    },
    [closeMonthPicker],
  );

  const {
    calendar: calendarColor,
    primary: primaryColor,
    secondaryText,
    border: borderColor,
    icon: iconColor,
    tint,
    todayTextColor,
    normalDayTextColor,
  } = useThemeColors([
    "calendar",
    "primary",
    "secondaryText",
    "border",
    "icon",
    "tint",
    "todayTextColor",
    "normalDayTextColor",
  ]);

  return (
    <>
      <View
        style={{
          backgroundColor: calendarColor,
          borderRadius: 40,
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 32,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
            backgroundColor: "transparent",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "transparent",
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 16,
                backgroundColor: borderColor,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name="calendar-outline" size={22} color={iconColor} />
            </View>

            <TouchableOpacity
              onPress={openMonthPicker}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "700", color: primaryColor }}
              >
                {format(currentMonth, "MMMM yyyy")}
              </Text>
              <Ionicons
                name="chevron-down"
                size={18}
                color={iconColor}
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{ flexDirection: "row", backgroundColor: "transparent" }}
          >
            <TouchableOpacity
              onPress={() => setCurrentMonth((prev) => subMonths(prev, 1))}
              style={{
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="chevron-back" size={22} color={tint} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCurrentMonth((prev) => addMonths(prev, 1))}
              style={{
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="chevron-forward" size={22} color={tint} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Day Names */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 6,
            backgroundColor: "transparent",
          }}
        >
          {dayNames.map((day) => (
            <Text
              key={day}
              style={{
                width: 36,
                textAlign: "center",
                fontSize: 13,
                fontWeight: "600",
                color: secondaryText,
              }}
            >
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar */}
        <Calendar
          current={format(currentMonth, "yyyy-MM-dd")}
          key={format(currentMonth, "yyyy-MM") + theme}
          hideArrows
          firstDay={1}
          headerStyle={{ display: "none" }}
          onDayPress={(day) => {
            if (navigatingRef.current) return;
            navigatingRef.current = true;
            setSelectedDate(day.dateString);
            router.push({
              pathname: "/tabs/(tabs)/(calendar)/day-detail",
              params: { date: day.dateString },
            });
          }}
          markedDates={markedDates}
          markingType="period"
          theme={{
            backgroundColor: calendarColor,
            calendarBackground: calendarColor,
            textSectionTitleColor: secondaryText,
            dayTextColor: normalDayTextColor,
            monthTextColor: primaryColor,
            todayTextColor,
            selectedDayBackgroundColor: tint,
            selectedDayTextColor: "#fff",
            textDisabledColor: secondaryText,
            arrowColor: tint,
            indicatorColor: tint,
            textDayFontWeight: "500",
            textMonthFontWeight: "700",
          }}
        />
      </View>

      {/* Month Picker BottomSheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
      >
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        >
          <Text className="text-[20px] font-semibold text-center mb-3">
            Select Month
          </Text>
          {monthNames.map((item, index) => {
            const selected = currentMonth.getMonth() === index;
            return (
              <TouchableOpacity
                key={item}
                onPress={() => selectMonth(index)}
                className={`py-4 px-5 rounded-2xl mb-2 ${selected ? "bg-[#F2E2D5]" : "bg-[#F7F4F2]"}`}
              >
                <Text
                  className={`text-[18px] ${selected ? "font-semibold text-[#2D201B]" : "text-[#7D6E65]"}`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
}
