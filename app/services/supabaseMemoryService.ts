/**
 * Supabase Memory Service
 * API service cho memories - những kỷ niệm liên kết với diary entries
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/app/libs/supabase";

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
    details: () => [...MEMORY_QUERY_KEYS.memories.all, "detail"] as const,
    detail: (id: string) =>
      [...MEMORY_QUERY_KEYS.memories.details(), id] as const,
    byDiary: (diaryId: string) =>
      [...MEMORY_QUERY_KEYS.memories.all, "diary", diaryId] as const,
  },
} as const;

// ==================== API Functions ====================

/**
 * Lấy tất cả memories
 */
export const getMemories = async (): Promise<MemoryEntry[]> => {
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .order("created_at", { ascending: false });

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
    .order("created_at", { ascending: false });

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
    .order("created_at", { ascending: false });

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
 * Hook lấy danh sách memories
 */
export const useMemories = () => {
  return useQuery({
    queryKey: MEMORY_QUERY_KEYS.memories.lists(),
    queryFn: getMemories,
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
        queryKey: MEMORY_QUERY_KEYS.memories.lists(),
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
        queryKey: MEMORY_QUERY_KEYS.memories.lists(),
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
        queryKey: MEMORY_QUERY_KEYS.memories.lists(),
      });
    },
  });
};
