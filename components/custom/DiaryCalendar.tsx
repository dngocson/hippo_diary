import React, { useMemo, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";

import { Ionicons } from "@expo/vector-icons";

import { addMonths, subMonths, format, setMonth } from "date-fns";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useThemeColors } from "../Themed";
import { dayNames, monthNames } from "@/constants/Variable";
import { useRouter } from "expo-router";

export default function DiaryCalendar() {
  const router = useRouter();
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

  const theme = useColorScheme();
  const {
    calendar: calendarColor,
    text: textColor,
    primary: primaryColor,
    secondaryText,
    border: borderColor,
    icon: iconColor,
    tint,
    todayTextColor,
    normalDayTextColor,
  } = useThemeColors([
    "calendar",
    "text",
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
          {/* LEFT */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "transparent",
            }}
          >
            {/* Calendar Icon */}
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

            {/* Month Picker */}
            <TouchableOpacity
              onPress={openMonthPicker}
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: primaryColor,
                }}
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

          {/* RIGHT NAV */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "transparent",
            }}
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
            setSelectedDate(day.dateString);
            router.push({
              pathname: "/tabs/(tabs)/(calendar)/day-detail",
              params: { date: day.dateString },
            });
          }}
          markingType={"period"}
          markedDates={{
            [selectedDate]: {
              selected: true,
              color: "#50cebb",
              textColor: "white",
            },
          }}
          theme={{
            backgroundColor: calendarColor,
            calendarBackground: calendarColor,
            textSectionTitleColor: secondaryText,
            dayTextColor: normalDayTextColor,
            monthTextColor: primaryColor,
            todayTextColor: todayTextColor,
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
          })}
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
}
