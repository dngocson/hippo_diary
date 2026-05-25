// hooks/useMarkedDates.ts
import { eachDayOfInterval, format } from "date-fns";
import merge from "lodash/merge";
import { useMemo } from "react";
import { MemoryEntry } from "@/app/services/supabaseMemoryService";
import { AniversaryEntry } from "@/app/services/supabaseAniversaryService";

export const useMarkedDates = (
  memories: MemoryEntry[],
  aniversaries: AniversaryEntry[],
  selectedDate: string,
  currentMonth: Date,
) => {
  return useMemo(() => {
    const marks: Record<string, any> = {};

    memories.forEach((item) => {
      if (!item.start_date || !item.end_date) return;

      const days = eachDayOfInterval({
        start: new Date(item.start_date),
        end: new Date(item.end_date),
      });

      days.forEach((day, index) => {
        marks[format(day, "yyyy-MM-dd")] = {
          startingDay: index === 0,
          endingDay: index === days.length - 1,
          color: "#A7C7E7",
          textColor: "#000",
        };
      });
    });

    aniversaries.forEach((item) => {
      const dateString = format(
        new Date(currentMonth.getFullYear(), item.month - 1, item.day),
        "yyyy-MM-dd",
      );

      marks[dateString] = {
        ...marks[dateString],
        marked: true,
        dotColor: "red",
      };
    });

    const isInPeriod = !!marks[selectedDate];

    merge(marks, {
      [selectedDate]: {
        color: "#2D201B",
        textColor: "#fff",
        ...(!isInPeriod && { startingDay: true, endingDay: true }),
      },
    });

    return marks;
  }, [memories, aniversaries, selectedDate, currentMonth]);
};
