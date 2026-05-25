/**
 * Supabase Memory Service
 * API service cho memories - những kỷ niệm liên kết với diary entries
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

export interface MemoryEntry {
  id: string;
  diary_id: string;
  mood_id?: number | null;
  title: string;
  content?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateMemoryInput {
  diary_id: string;
  title: string;
  content?: string;
  mood_id?: number | null;
  start_date?: string;
  end_date?: string;
}

export interface UpdateMemoryInput extends Partial<CreateMemoryInput> {
  id: string;
}

// ==================== Query Keys ====================

export const MEMORY_QUERY_KEYS = {
  memories: {
    all: ["memories"] as const,

    lists: () => [...MEMORY_QUERY_KEYS.memories.all, "list"] as const,

    listByMonth: (monthKey: string) =>
      [...MEMORY_QUERY_KEYS.memories.lists(), monthKey] as const,

    details: () => [...MEMORY_QUERY_KEYS.memories.all, "detail"] as const,

    detail: (id: string) =>
      [...MEMORY_QUERY_KEYS.memories.details(), id] as const,

    byDiary: (diaryId: string) =>
      [...MEMORY_QUERY_KEYS.memories.all, "diary", diaryId] as const,
  },
} as const;

// ==================== API Functions ====================

/**
 * Lấy memories overlap với tháng calendar đang hiển thị
 *
 * Example:
 * Calendar visible:
 * 2026-04-27 → 2026-05-31
 *
 * Memory:
 * 2026-04-25 → 2026-05-10 ✅
 * 2026-05-20 → 2026-06-10 ✅
 * 2026-03-01 → 2026-04-10 ❌
 */
export const getMemories = async (
  currentMonth: Date,
): Promise<MemoryEntry[]> => {
  const visibleStart = startOfWeek(startOfMonth(currentMonth), {
    weekStartsOn: 1,
  });

  const visibleEnd = endOfWeek(endOfMonth(currentMonth), {
    weekStartsOn: 1,
  });

  const startDate = format(visibleStart, "yyyy-MM-dd");

  const endDate = format(visibleEnd, "yyyy-MM-dd");

  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .lte("start_date", endDate)
    .gte("end_date", startDate)
    .order("start_date", {
      ascending: true,
    });

  if (error) throw error;

  return data || [];
};

/**
 * Lấy memory theo ID
 */
export const getMemoryById = async (
  id: string,
): Promise<MemoryEntry | null> => {
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
};

/**
 * Lấy memories theo diary_id
 */
export const getMemoriesByDiary = async (
  diaryId: string,
): Promise<MemoryEntry[]> => {
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .eq("diary_id", diaryId)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data || [];
};

/**
 * Search memories theo keyword
 */
export const searchMemories = async (
  keyword: string,
): Promise<MemoryEntry[]> => {
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%`)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data || [];
};

/**
 * Tạo memory mới
 */
export const createMemory = async (
  input: CreateMemoryInput,
): Promise<MemoryEntry> => {
  const { data, error } = await supabase
    .from("memories")
    .insert([input])
    .select()
    .single();

  if (error) throw error;

  return data;
};

/**
 * Cập nhật memory
 */
export const updateMemory = async (
  input: UpdateMemoryInput,
): Promise<MemoryEntry> => {
  const { id, ...updateData } = input;

  const { data, error } = await supabase
    .from("memories")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
};

/**
 * Xóa memory
 */
export const deleteMemory = async (id: string): Promise<void> => {
  const { error } = await supabase.from("memories").delete().eq("id", id);

  if (error) throw error;
};

// ==================== React Query Hooks ====================

/**
 * Hook lấy memories theo tháng calendar
 */
export const useMemories = (currentMonth: Date) => {
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
        queryKey: MEMORY_QUERY_KEYS.memories.listByMonth(key),
        queryFn: () => getMemories(month),
        staleTime: 1000 * 60 * 5,
      });
    });
  }, [monthKey, queryClient]);

  return useQuery({
    queryKey: MEMORY_QUERY_KEYS.memories.listByMonth(monthKey),

    queryFn: () => getMemories(currentMonth),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
};

/**
 * Hook lấy memory theo ID
 */
export const useMemory = (id: string) => {
  return useQuery({
    queryKey: MEMORY_QUERY_KEYS.memories.detail(id),

    queryFn: () => getMemoryById(id),

    enabled: !!id,
  });
};

/**
 * Hook lấy memories theo diary
 */
export const useMemoriesByDiary = (diaryId: string) => {
  return useQuery({
    queryKey: MEMORY_QUERY_KEYS.memories.byDiary(diaryId),

    queryFn: () => getMemoriesByDiary(diaryId),

    enabled: !!diaryId,
  });
};

/**
 * Hook search memories
 */
export const useSearchMemories = (keyword: string) => {
  return useQuery({
    queryKey: [...MEMORY_QUERY_KEYS.memories.all, "search", keyword] as const,

    queryFn: () => searchMemories(keyword),

    enabled: keyword.length >= 2,
  });
};

/**
 * Hook tạo memory mới
 */
export const useCreateMemory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMemory,

    onSuccess: (newMemory) => {
      queryClient.invalidateQueries({
        queryKey: MEMORY_QUERY_KEYS.memories.all,
      });

      queryClient.invalidateQueries({
        queryKey: MEMORY_QUERY_KEYS.memories.byDiary(newMemory.diary_id),
      });
    },
  });
};

/**
 * Hook cập nhật memory
 */
export const useUpdateMemory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMemory,

    onSuccess: (updatedMemory) => {
      queryClient.invalidateQueries({
        queryKey: MEMORY_QUERY_KEYS.memories.all,
      });

      queryClient.invalidateQueries({
        queryKey: MEMORY_QUERY_KEYS.memories.detail(updatedMemory.id),
      });

      queryClient.invalidateQueries({
        queryKey: MEMORY_QUERY_KEYS.memories.byDiary(updatedMemory.diary_id),
      });
    },
  });
};

/**
 * Hook xóa memory
 */
export const useDeleteMemory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMemory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MEMORY_QUERY_KEYS.memories.all,
      });
    },
  });
};
