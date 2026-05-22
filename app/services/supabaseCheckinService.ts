/**
 * Supabase Checkin Service
 * API service cho checkins - địa điểm check-in
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/app/libs/supabase";

// ==================== Types ====================

export interface Checkin {
  id: string;
  user_id: string;
  memory_id?: string | null;
  place_name?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  checkin_time: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCheckinInput {
  memory_id?: string | null;
  place_name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  checkin_time?: string;
}

export interface UpdateCheckinInput extends Partial<CreateCheckinInput> {
  id: string;
}

// ==================== Query Keys ====================

export const CHECKIN_QUERY_KEYS = {
  checkins: {
    all: ["checkins"] as const,
    lists: () => [...CHECKIN_QUERY_KEYS.checkins.all, "list"] as const,
    detail: (id: string) => [...CHECKIN_QUERY_KEYS.checkins.all, id] as const,
    byMemory: (memoryId: string) =>
      [...CHECKIN_QUERY_KEYS.checkins.all, "memory", memoryId] as const,
    standalone: () =>
      [...CHECKIN_QUERY_KEYS.checkins.all, "standalone"] as const,
  },
} as const;

// ==================== API Functions ====================

/**
 * Lấy tất cả checkins của user
 */
export const getCheckins = async (): Promise<Checkin[]> => {
  const { data, error } = await supabase
    .from("checkins")
    .select("*")
    .order("checkin_time", { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Lấy checkin theo ID
 */
export const getCheckinById = async (id: string): Promise<Checkin | null> => {
  const { data, error } = await supabase
    .from("checkins")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Lấy checkins theo memory_id
 */
export const getCheckinsByMemory = async (
  memoryId: string,
): Promise<Checkin[]> => {
  const { data, error } = await supabase
    .from("checkins")
    .select("*")
    .eq("memory_id", memoryId)
    .order("checkin_time", { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Lấy standalone checkins
 */
export const getStandaloneCheckins = async (): Promise<Checkin[]> => {
  const { data, error } = await supabase
    .from("checkins")
    .select("*")
    .is("memory_id", null)
    .order("checkin_time", { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Tạo checkin mới
 */
export const createCheckin = async (
  input: CreateCheckinInput,
): Promise<Checkin> => {
  const { data, error } = await supabase
    .from("checkins")
    .insert([input])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Cập nhật checkin
 */
export const updateCheckin = async (
  input: UpdateCheckinInput,
): Promise<Checkin> => {
  const { id, ...updateData } = input;

  const { data, error } = await supabase
    .from("checkins")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Xóa checkin
 */
export const deleteCheckin = async (id: string): Promise<void> => {
  const { error } = await supabase.from("checkins").delete().eq("id", id);

  if (error) throw error;
};

// ==================== React Query Hooks ====================

/**
 * Hook lấy danh sách checkins
 */
export const useCheckins = () => {
  return useQuery({
    queryKey: CHECKIN_QUERY_KEYS.checkins.lists(),
    queryFn: getCheckins,
  });
};

/**
 * Hook lấy checkin theo ID
 */
export const useCheckin = (id: string) => {
  return useQuery({
    queryKey: CHECKIN_QUERY_KEYS.checkins.detail(id),
    queryFn: () => getCheckinById(id),
    enabled: !!id,
  });
};

/**
 * Hook lấy checkins theo memory
 */
export const useCheckinsByMemory = (memoryId: string) => {
  return useQuery({
    queryKey: CHECKIN_QUERY_KEYS.checkins.byMemory(memoryId),
    queryFn: () => getCheckinsByMemory(memoryId),
    enabled: !!memoryId,
  });
};

/**
 * Hook lấy standalone checkins
 */
export const useStandaloneCheckins = () => {
  return useQuery({
    queryKey: CHECKIN_QUERY_KEYS.checkins.standalone(),
    queryFn: getStandaloneCheckins,
  });
};

/**
 * Hook tạo checkin mới
 */
export const useCreateCheckin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCheckin,
    onSuccess: (newCheckin) => {
      queryClient.invalidateQueries({
        queryKey: CHECKIN_QUERY_KEYS.checkins.lists(),
      });
      if (newCheckin.memory_id) {
        queryClient.invalidateQueries({
          queryKey: CHECKIN_QUERY_KEYS.checkins.byMemory(newCheckin.memory_id),
        });
      }
    },
  });
};

/**
 * Hook cập nhật checkin
 */
export const useUpdateCheckin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCheckin,
    onSuccess: (updatedCheckin) => {
      queryClient.invalidateQueries({
        queryKey: CHECKIN_QUERY_KEYS.checkins.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: CHECKIN_QUERY_KEYS.checkins.detail(updatedCheckin.id),
      });
    },
  });
};

/**
 * Hook xóa checkin
 */
export const useDeleteCheckin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCheckin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CHECKIN_QUERY_KEYS.checkins.lists(),
      });
    },
  });
};
