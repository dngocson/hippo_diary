import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import { useThemeColors } from "@/components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { diaryEntrySchema } from "@/app/schema/diarySchema";

// Zod Schema cho validation

export default function DayDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    background,
    text: textColor,
    primary: primaryColor,
    secondaryText,
    border: borderColor,
    calendar: cardBackground,
  } = useThemeColors([
    "background",
    "text",
    "primary",
    "secondaryText",
    "border",
    "calendar",
  ]);

  const selectedDate = date ? parseISO(date) : new Date();
  const formattedDate = format(selectedDate, "EEEE, MMMM dd, yyyy");
  const dayOfWeek = format(selectedDate, "EEEE");
  const monthDay = format(selectedDate, "MMMM dd");
  const year = format(selectedDate, "yyyy");

  const form = useForm({
    defaultValues: {
      content: "",
      mood: "",
      activities: "",
    },
    onSubmit: async ({ value }) => {
      const result = diaryEntrySchema.safeParse(value);

      if (!result.success) {
        console.log("Validation errors:", result.error);
        return;
      }

      console.log("Form submitted:", value);
      alert(`Đã lưu nhật ký cho ngày ${formattedDate}`);
      setIsEditMode(false);
    },
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: background,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}
      >
        {/* Date Header */}
        <View
          style={{
            backgroundColor: cardBackground,
            borderRadius: 24,
            padding: 24,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "700",
              color: primaryColor,
              marginBottom: 8,
            }}
          >
            {monthDay}
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "500",
              color: secondaryText,
            }}
          >
            {dayOfWeek}, {year}
          </Text>
        </View>

        {/* Diary Entry Section */}
        <View
          style={{
            backgroundColor: cardBackground,
            borderRadius: 24,
            padding: 24,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
              backgroundColor: "transparent",
            }}
          >
            <Ionicons
              name="book-outline"
              size={24}
              color={primaryColor}
              style={{ marginRight: 12 }}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: textColor,
              }}
            >
              Diary Entry
            </Text>
          </View>

          <form.Field name="content">
            {(field) => (
              <>
                <TextInput
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  placeholder="Viết về ngày của bạn..."
                  placeholderTextColor={secondaryText}
                  multiline
                  numberOfLines={8}
                  textAlignVertical="top"
                  style={{
                    backgroundColor: background,
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 15,
                    lineHeight: 24,
                    color: textColor,
                    borderWidth: 1,
                    borderColor: field.state.meta.errors?.length
                      ? "#ef4444"
                      : borderColor,
                    minHeight: 150,
                  }}
                />
              </>
            )}
          </form.Field>

          <TouchableOpacity
            style={{
              backgroundColor: primaryColor,
              borderRadius: 16,
              paddingVertical: 14,
              paddingHorizontal: 20,
              marginTop: 16,
              alignItems: "center",
            }}
            onPress={() => {
              if (isEditMode) {
                form.handleSubmit();
              } else {
                setIsEditMode(true);
              }
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              {isEditMode ? "Lưu Nhật Ký" : "Viết Nhật Ký"}
            </Text>
          </TouchableOpacity>

          {isEditMode && (
            <TouchableOpacity
              style={{
                backgroundColor: borderColor,
                borderRadius: 16,
                paddingVertical: 14,
                paddingHorizontal: 20,
                marginTop: 8,
                alignItems: "center",
              }}
              onPress={() => {
                setIsEditMode(false);
                form.reset();
              }}
            >
              <Text
                style={{
                  color: textColor,
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Hủy
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Mood Section */}
        <View
          style={{
            backgroundColor: cardBackground,
            borderRadius: 24,
            padding: 24,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
              backgroundColor: "transparent",
            }}
          >
            <Ionicons
              name="happy-outline"
              size={24}
              color={primaryColor}
              style={{ marginRight: 12 }}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: textColor,
              }}
            >
              Tâm Trạng
            </Text>
          </View>

          <form.Field name="mood">
            {(field) => (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    backgroundColor: "transparent",
                  }}
                >
                  {[
                    { emoji: "😊", label: "Vui vẻ" },
                    { emoji: "😐", label: "Bình thường" },
                    { emoji: "😔", label: "Buồn" },
                    { emoji: "😢", label: "Rất buồn" },
                    { emoji: "😡", label: "Tức giận" },
                  ].map((mood, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor:
                          field.state.value === mood.emoji
                            ? primaryColor
                            : borderColor,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: field.state.value === mood.emoji ? 2 : 0,
                        borderColor: primaryColor,
                      }}
                      onPress={() => {
                        field.handleChange(mood.emoji);
                      }}
                    >
                      <Text style={{ fontSize: 28 }}>{mood.emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </form.Field>
        </View>

        {/* Activities Section */}
        <View
          style={{
            backgroundColor: cardBackground,
            borderRadius: 24,
            padding: 24,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
              backgroundColor: "transparent",
            }}
          >
            <Ionicons
              name="list-outline"
              size={24}
              color={primaryColor}
              style={{ marginRight: 12 }}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: textColor,
              }}
            >
              Hoạt Động
            </Text>
          </View>

          <form.Field name="activities">
            {(field) => (
              <TextInput
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Thêm các hoạt động của bạn... (vd: Đọc sách, Tập thể dục, Gặp bạn bè)"
                placeholderTextColor={secondaryText}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={{
                  backgroundColor: background,
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 15,
                  lineHeight: 24,
                  color: textColor,
                  borderWidth: 1,
                  borderColor: field.state.meta.errors?.length
                    ? "#ef4444"
                    : borderColor,
                  minHeight: 100,
                }}
              />
            )}
          </form.Field>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
