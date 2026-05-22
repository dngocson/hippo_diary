/**
 * Supabase Diary Service (Updated)
 * API service cho diaries với visibility
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/app/libs/supabase";

// ==================== Types ====================

export interface Diary {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  cover_image?: string | null;
  visibility: "private" | "friends" | "public";
  created_at: string;
  updated_at: string;
}

export interface CreateDiaryInput {
  title: string;
  description?: string;
  cover_image?: string;
  visibility?: "private" | "friends" | "public";
}

export interface UpdateDiaryInput extends Partial<CreateDiaryInput> {
  id: string;
}

// ==================== Query Keys ====================

export const DIARY_QUERY_KEYS = {
  diaries: {
    all: ["diaries"] as const,
    lists: () => [...DIARY_QUERY_KEYS.diaries.all, "list"] as const,
    detail: (id: string) => [...DIARY_QUERY_KEYS.diaries.all, id] as const,
  },
} as const;

// ==================== API Functions ====================

/**
 * Lấy tất cả diaries của user
 */
export const getDiaries = async (): Promise<Diary[]> => {
  const { data, error } = await supabase
    .from("diaries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Lấy diary theo ID
 */
export const getDiaryById = async (id: string): Promise<Diary | null> => {
  const { data, error } = await supabase
    .from("diaries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Tạo diary mới
 */
export const createDiary = async (input: CreateDiaryInput): Promise<Diary> => {
  const { data, error } = await supabase
    .from("diaries")
    .insert([{ ...input, visibility: input.visibility || "private" }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Cập nhật diary
 */
export const updateDiary = async (input: UpdateDiaryInput): Promise<Diary> => {
  const { id, ...updateData } = input;

  const { data, error } = await supabase
    .from("diaries")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Xóa diary
 */
export const deleteDiary = async (id: string): Promise<void> => {
  const { error } = await supabase.from("diaries").delete().eq("id", id);

  if (error) throw error;
};

// ==================== React Query Hooks ====================

/**
 * Hook lấy danh sách diaries
 */
export const useDiaries = () => {
  return useQuery({
    queryKey: DIARY_QUERY_KEYS.diaries.lists(),
    queryFn: getDiaries,
  });
};

/**
 * Hook lấy diary theo ID
 */
export const useDiary = (id: string) => {
  return useQuery({
    queryKey: DIARY_QUERY_KEYS.diaries.detail(id),
    queryFn: () => getDiaryById(id),
    enabled: !!id,
  });
};

/**
 * Hook tạo diary mới
 */
export const useCreateDiary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDiary,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DIARY_QUERY_KEYS.diaries.lists(),
      });
    },
  });
};

/**
 * Hook cập nhật diary
 */
export const useUpdateDiary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDiary,
    onSuccess: (updatedDiary) => {
      queryClient.invalidateQueries({
        queryKey: DIARY_QUERY_KEYS.diaries.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: DIARY_QUERY_KEYS.diaries.detail(updatedDiary.id),
      });
    },
  });
};

/**
 * Hook xóa diary
 */
export const useDeleteDiary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDiary,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DIARY_QUERY_KEYS.diaries.lists(),
      });
    },
  });
};
