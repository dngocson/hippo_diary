// store/diaryCalendarStore.ts

import { create } from "zustand";
import { format, addMonths, subMonths, setMonth } from "date-fns";

type DiaryCalendarState = {
  currentMonth: Date;
  selectedDate: string;
  isMonthPickerOpen: boolean;

  setCurrentMonth: (date: Date) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  selectMonth: (monthIndex: number) => void;

  setSelectedDate: (date: string) => void;

  openMonthPicker: () => void;
  closeMonthPicker: () => void;
};

export const useDiaryCalendarStore = create<DiaryCalendarState>((set, get) => ({
  currentMonth: new Date(),

  selectedDate: format(new Date(), "yyyy-MM-dd"),

  isMonthPickerOpen: false,

  setCurrentMonth: (date) =>
    set({
      currentMonth: date,
    }),

  nextMonth: () =>
    set((state) => ({
      currentMonth: addMonths(state.currentMonth, 1),
    })),

  prevMonth: () =>
    set((state) => ({
      currentMonth: subMonths(state.currentMonth, 1),
    })),

  selectMonth: (monthIndex) => {
    const { currentMonth } = get();

    const newDate = setMonth(currentMonth, monthIndex);

    set({
      currentMonth: newDate,
      isMonthPickerOpen: false,
    });
  },

  setSelectedDate: (date) =>
    set({
      selectedDate: date,
    }),

  openMonthPicker: () =>
    set({
      isMonthPickerOpen: true,
    }),

  closeMonthPicker: () =>
    set({
      isMonthPickerOpen: false,
    }),
}));
