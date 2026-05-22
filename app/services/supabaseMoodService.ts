/**
 * Supabase Mood Service
 * API service cho moods (tâm trạng)
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/app/libs/supabase";

// ==================== Types ====================

export interface Mood {
  id: number;
  name: string;
  emoji?: string | null;
  color?: string | null;
}

// ==================== Query Keys ====================

export const MOOD_QUERY_KEYS = {
  moods: {
    all: ["moods"] as const,
    lists: () => [...MOOD_QUERY_KEYS.moods.all, "list"] as const,
  },
} as const;

// ==================== API Functions ====================

/**
 * Lấy tất cả moods
 */
export const getMoods = async (): Promise<Mood[]> => {
  const { data, error } = await supabase
    .from("moods")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Lấy mood theo ID
 */
export const getMoodById = async (id: number): Promise<Mood | null> => {
  const { data, error } = await supabase
    .from("moods")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

// ==================== React Query Hooks ====================

/**
 * Hook lấy danh sách moods
 */
export const useMoods = () => {
  return useQuery({
    queryKey: MOOD_QUERY_KEYS.moods.lists(),
    queryFn: getMoods,
    staleTime: Infinity, // Moods ít khi thay đổi
  });
};

/**
 * Hook lấy mood theo ID
 */
export const useMood = (id: number) => {
  return useQuery({
    queryKey: [...MOOD_QUERY_KEYS.moods.all, id] as const,
    queryFn: () => getMoodById(id),
    enabled: !!id,
    staleTime: Infinity,
  });
};
