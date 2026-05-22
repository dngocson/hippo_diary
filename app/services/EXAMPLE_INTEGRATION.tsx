// ===============================================
// EXAMPLE: Cách tích hợp React Query vào day-detail.tsx
// ===============================================

import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { format, parseISO } from "date-fns";
import { useForm } from "@tanstack/react-form";
import {
  useCreateDiaryEntry,
  useDiaryEntryByDate,
  useUpdateDiaryEntry,
} from "@/app/services/diaryService";
import { Text, View } from "@/components/Themed";
import { ScrollView } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";

export default function DayDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const selectedDate = date ? parseISO(date) : new Date();
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  // React Query hooks
  const { data: existingEntry, isLoading } = useDiaryEntryByDate(formattedDate);
  const createMutation = useCreateDiaryEntry();
  const updateMutation = useUpdateDiaryEntry();

  const [isEditMode, setIsEditMode] = useState(false);

  const form = useForm({
    defaultValues: {
      content: "",
      activities: "",
    },
    onSubmit: async ({ value }) => {
      try {
        if (existingEntry) {
          // Update existing entry
          await updateMutation.mutateAsync({
            id: existingEntry.id,
            ...value,
          });
        } else {
          // Create new entry
          await createMutation.mutateAsync({
            date: formattedDate,
            ...value,
          });
        }

        alert("Đã lưu nhật ký thành công!");
        setIsEditMode(false);
      } catch (error) {
        alert("Lỗi khi lưu nhật ký");
        console.error(error);
      }
    },
  });

  // Load existing data vào form
  useEffect(() => {
    if (existingEntry) {
      form.setFieldValue("content", existingEntry.content);
      form.setFieldValue("activities", existingEntry.activities || "");
    }
  }, [existingEntry]);

  // Loading state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <ScrollView>
      {/* ... UI components ... */}

      <TouchableOpacity
        onPress={() => {
          if (isEditMode) {
            form.handleSubmit();
          } else {
            setIsEditMode(true);
          }
        }}
        disabled={isSaving}
      >
        <Text>
          {isSaving
            ? "Đang lưu..."
            : isEditMode
              ? "Lưu Nhật Ký"
              : "Viết Nhật Ký"}
        </Text>
      </TouchableOpacity>

      {/* Show error if any */}
      {(createMutation.error || updateMutation.error) && (
        <Text style={{ color: "red" }}>
          Lỗi: {createMutation.error?.message || updateMutation.error?.message}
        </Text>
      )}
    </ScrollView>
  );
}
