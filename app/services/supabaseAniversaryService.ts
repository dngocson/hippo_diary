/**
 * Supabase Aniversary Service
 * API service cho aniversary - những ngày kỷ niệm đặc biệt (chỉ có 1 ngày, không có start_date/end_date)
 */

import { supabase } from "@/app/libs/supabase";
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useEffect } from "react";

// ==================== Types ====================

export interface AniversaryEntry {
  id: string;
  memory_id: string;
  title: string;
  description?: string | null;
  day: number;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAniversaryInput {
  memory_id: string;
  title: string;
  description?: string;
  mood_id?: number | null;
  date: string;
}

export interface UpdateAniversaryInput extends Partial<CreateAniversaryInput> {
  id: string;
}

// ==================== Query Keys ====================

export const ANIVERSARY_QUERY_KEYS = {
  aniversaries: {
    all: ["aniversaries"] as const,

    lists: () => [...ANIVERSARY_QUERY_KEYS.aniversaries.all, "list"] as const,

    listByMonth: (monthKey: string) =>
      [...ANIVERSARY_QUERY_KEYS.aniversaries.lists(), monthKey] as const,

    details: () =>
      [...ANIVERSARY_QUERY_KEYS.aniversaries.all, "detail"] as const,

    detail: (id: string) =>
      [...ANIVERSARY_QUERY_KEYS.aniversaries.details(), id] as const,

    byMemory: (memoryId: string) =>
      [...ANIVERSARY_QUERY_KEYS.aniversaries.all, "memory", memoryId] as const,
  },
} as const;

// ==================== API Functions ====================

/**
 * Lấy aniversary overlap với tháng calendar đang hiển thị
 *
 * Example:
 * Calendar visible:
 * 2026-04-27 → 2026-05-31
 *
 * Aniversary:
 * 2026-05-10 ✅
 * 2026-05-20 ✅
 * 2026-04-10 ❌
 */
export const getAniversaries = async (
  currentMonth: Date,
): Promise<AniversaryEntry[]> => {
  const month = currentMonth.getMonth() + 1;

  const { data, error } = await supabase
    .from("aniversaries")
    .select("*")
    .eq("month", month)
    .order("day", { ascending: true });

  if (error) throw error;

  return data || [];
};
/**
 * Lấy aniversary theo ID
 */
export const getAniversaryById = async (
  id: string,
): Promise<AniversaryEntry | null> => {
  const { data, error } = await supabase
    .from("aniversaries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
};

/**
 * Lấy aniversary theo memory_id
 */
export const getAniversariesByMemory = async (
  memoryId: string,
): Promise<AniversaryEntry[]> => {
  const { data, error } = await supabase
    .from("aniversaries")
    .select("*")
    .eq("memory_id", memoryId)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data || [];
};

/**
 * Search aniversary theo keyword
 */
export const searchAniversaries = async (
  keyword: string,
): Promise<AniversaryEntry[]> => {
  const { data, error } = await supabase
    .from("aniversaries")
    .select("*")
    .or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%`)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data || [];
};

/**
 * Tạo aniversary mới
 */
export const createAniversary = async (
  input: CreateAniversaryInput,
): Promise<AniversaryEntry> => {
  const { data, error } = await supabase
    .from("aniversaries")
    .insert([input])
    .select()
    .single();

  if (error) throw error;

  return data;
};

/**
 * Cập nhật aniversary
 */
export const updateAniversary = async (
  input: UpdateAniversaryInput,
): Promise<AniversaryEntry> => {
  const { id, ...updateData } = input;

  const { data, error } = await supabase
    .from("aniversaries")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
};

/**
 * Xóa aniversary
 */
export const deleteAniversary = async (id: string): Promise<void> => {
  const { error } = await supabase.from("aniversaries").delete().eq("id", id);

  if (error) throw error;
};

// ==================== React Query Hooks ====================

/**
 * Hook lấy aniversary theo tháng calendar
 */
export const useAniversaries = (currentMonth: Date) => {
  const monthKey = format(currentMonth, "yyyy-MM");
  const queryClient = useQueryClient();

  useEffect(() => {
    const monthsToPreload = [
      subMonths(currentMonth, 2),
      subMonths(currentMonth, 1),
      addMonths(currentMonth, 1),
      addMonths(currentMonth, 2),
    ];

    monthsToPreload.forEach((month) => {
      const key = format(month, "yyyy-MM");
      queryClient.prefetchQuery({
        queryKey: ANIVERSARY_QUERY_KEYS.aniversaries.listByMonth(key),
        queryFn: () => getAniversaries(month),
        staleTime: 1000 * 60 * 5,
      });
    });
  }, [monthKey, queryClient]);

  return useQuery({
    queryKey: ANIVERSARY_QUERY_KEYS.aniversaries.listByMonth(monthKey),
    queryFn: () => getAniversaries(currentMonth),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
};

/**
 * Hook lấy aniversary theo ID
 */
export const useAniversary = (id: string) => {
  return useQuery({
    queryKey: ANIVERSARY_QUERY_KEYS.aniversaries.detail(id),
    queryFn: () => getAniversaryById(id),
    enabled: !!id,
  });
};

/**
 * Hook lấy aniversary theo memory
 */
export const useAniversariesByMemory = (memoryId: string) => {
  return useQuery({
    queryKey: ANIVERSARY_QUERY_KEYS.aniversaries.byMemory(memoryId),
    queryFn: () => getAniversariesByMemory(memoryId),
    enabled: !!memoryId,
  });
};

/**
 * Hook search aniversary
 */
export const useSearchAniversaries = (keyword: string) => {
  return useQuery({
    queryKey: [
      ...ANIVERSARY_QUERY_KEYS.aniversaries.all,
      "search",
      keyword,
    ] as const,
    queryFn: () => searchAniversaries(keyword),
    enabled: keyword.length >= 2,
  });
};

/**
 * Hook tạo aniversary mới
 */
export const useCreateAniversary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAniversary,
    onSuccess: (newAniversary) => {
      queryClient.invalidateQueries({
        queryKey: ANIVERSARY_QUERY_KEYS.aniversaries.all,
      });
      queryClient.invalidateQueries({
        queryKey: ANIVERSARY_QUERY_KEYS.aniversaries.byMemory(
          newAniversary.memory_id,
        ),
      });
    },
  });
};

/**
 * Hook cập nhật aniversary
 */
export const useUpdateAniversary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAniversary,
    onSuccess: (updatedAniversary) => {
      queryClient.invalidateQueries({
        queryKey: ANIVERSARY_QUERY_KEYS.aniversaries.all,
      });
      queryClient.invalidateQueries({
        queryKey: ANIVERSARY_QUERY_KEYS.aniversaries.detail(
          updatedAniversary.id,
        ),
      });
      queryClient.invalidateQueries({
        queryKey: ANIVERSARY_QUERY_KEYS.aniversaries.byMemory(
          updatedAniversary.memory_id,
        ),
      });
    },
  });
};

/**
 * Hook xóa aniversary
 */
export const useDeleteAniversary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAniversary,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ANIVERSARY_QUERY_KEYS.aniversaries.all,
      });
    },
  });
};
