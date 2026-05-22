import { diaryEntrySchema } from "@/app/schema/diarySchema";
import { useThemeColors } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "@tanstack/react-form";
import { format, parseISO } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function DayDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();

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

  // Daily quotes
  const quotes = [
    {
      text: "Mỗi ngày là một trang mới trong cuốn sách cuộc đời bạn",
      author: "Unknown",
    },
    {
      text: "Hạnh phúc không phải là điều gì đó bạn tìm kiếm, mà là điều bạn tạo ra",
      author: "Buddha",
    },
    {
      text: "Viết nhật ký là cách để kết nối với chính mình",
      author: "Virginia Woolf",
    },
    {
      text: "Cuộc sống được đo bằng những khoảnh khắc khiến ta nín thở",
      author: "Maya Angelou",
    },
    {
      text: "Hôm nay là món quà, đó là lý do nó được gọi là hiện tại",
      author: "Eleanor Roosevelt",
    },
  ];

  const todayQuote = quotes[new Date(selectedDate).getDate() % quotes.length];

  const form = useForm({
    defaultValues: {
      content: "",
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
    <ScrollView
      style={{
        flex: 1,
      }}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingBottom: 40,
        backgroundColor: background,
      }}
    >
      {/* Header with Back Button */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 8,
          marginBottom: 16,
          backgroundColor: "transparent",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: cardBackground,
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          <Ionicons name="arrow-back" size={20} color={primaryColor} />
          <Text
            style={{
              marginLeft: 8,
              fontSize: 15,
              fontWeight: "600",
              color: textColor,
            }}
          >
            Quay lại
          </Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            gap: 8,
            backgroundColor: "transparent",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: cardBackground,
              padding: 10,
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            <Ionicons name="share-outline" size={20} color={primaryColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Daily Quote Card */}
      <View
        style={{
          backgroundColor: `${primaryColor}10`,
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          borderLeftWidth: 4,
          borderLeftColor: primaryColor,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            backgroundColor: "transparent",
          }}
        >
          <Ionicons
            name="flower-outline"
            size={24}
            color={primaryColor}
            style={{ marginRight: 12, marginTop: 2 }}
          />
          <View style={{ flex: 1, backgroundColor: "transparent" }}>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 24,
                color: textColor,
                fontStyle: "italic",
                marginBottom: 8,
              }}
            >
              "{todayQuote.text}"
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: secondaryText,
                fontWeight: "500",
              }}
            >
              — {todayQuote.author}
            </Text>
          </View>
        </View>
      </View>

      {/* Date Header */}
      <View
        style={{
          backgroundColor: cardBackground,
          borderRadius: 20,
          padding: 28,
          marginBottom: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <Text
          style={{
            fontSize: 36,
            fontWeight: "800",
            color: primaryColor,
            marginBottom: 4,
            letterSpacing: -0.5,
          }}
        >
          {monthDay}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            color: secondaryText,
            opacity: 0.8,
          }}
        >
          {dayOfWeek}, {year}
        </Text>
      </View>

      {/* Diary Entry Section */}
      <View
        style={{
          backgroundColor: cardBackground,
          borderRadius: 20,
          padding: 28,
          marginBottom: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            backgroundColor: "transparent",
          }}
        >
          <View
            style={{
              backgroundColor: `${primaryColor}15`,
              padding: 10,
              borderRadius: 12,
              marginRight: 12,
            }}
          >
            <Ionicons name="book-outline" size={24} color={primaryColor} />
          </View>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              color: textColor,
              letterSpacing: -0.3,
            }}
          >
            Nhật Ký
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
                numberOfLines={10}
                textAlignVertical="top"
                style={{
                  backgroundColor: background,
                  borderRadius: 16,
                  padding: 18,
                  fontSize: 16,
                  lineHeight: 26,
                  color: textColor,
                  borderWidth: 1.5,
                  borderColor: field.state.meta.errors?.length
                    ? "#ef4444"
                    : borderColor,
                  minHeight: 200,
                }}
              />
            </>
          )}
        </form.Field>

        <TouchableOpacity
          style={{
            backgroundColor: primaryColor,
            borderRadius: 14,
            paddingVertical: 16,
            paddingHorizontal: 24,
            marginTop: 20,
            alignItems: "center",
            shadowColor: primaryColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
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
              fontSize: 17,
              fontWeight: "700",
              letterSpacing: 0.2,
            }}
          >
            {isEditMode ? "Lưu Nhật Ký" : "Viết Nhật Ký"}
          </Text>
        </TouchableOpacity>

        {isEditMode && (
          <TouchableOpacity
            style={{
              backgroundColor: "transparent",
              borderWidth: 1.5,
              borderColor: borderColor,
              borderRadius: 14,
              paddingVertical: 16,
              paddingHorizontal: 24,
              marginTop: 12,
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
                fontSize: 17,
                fontWeight: "600",
              }}
            >
              Hủy
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Activities Section */}
      <View
        style={{
          backgroundColor: cardBackground,
          borderRadius: 20,
          padding: 28,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            backgroundColor: "transparent",
          }}
        >
          <View
            style={{
              backgroundColor: `${primaryColor}15`,
              padding: 10,
              borderRadius: 12,
              marginRight: 12,
            }}
          >
            <Ionicons name="list-outline" size={24} color={primaryColor} />
          </View>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              color: textColor,
              letterSpacing: -0.3,
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
              numberOfLines={6}
              textAlignVertical="top"
              style={{
                backgroundColor: background,
                borderRadius: 16,
                padding: 18,
                fontSize: 16,
                lineHeight: 26,
                color: textColor,
                borderWidth: 1.5,
                borderColor: field.state.meta.errors?.length
                  ? "#ef4444"
                  : borderColor,
                minHeight: 120,
              }}
            />
          )}
        </form.Field>
      </View>
    </ScrollView>
  );
}
