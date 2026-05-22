/**
 * Supabase Profile Service
 * API service cho user profiles
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/app/libs/supabase";

// ==================== Types ====================

export interface Profile {
  id: string; // UUID from auth.users
  username?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileInput {
  username?: string;
  avatar_url?: string;
}

// ==================== Query Keys ====================

export const PROFILE_QUERY_KEYS = {
  profiles: {
    all: ["profiles"] as const,
    current: () => [...PROFILE_QUERY_KEYS.profiles.all, "current"] as const,
    detail: (id: string) => [...PROFILE_QUERY_KEYS.profiles.all, id] as const,
  },
} as const;

// ==================== API Functions ====================

/**
 * Lấy profile hiện tại
 */
export const getCurrentProfile = async (): Promise<Profile | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Lấy profile theo ID
 */
export const getProfileById = async (id: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Cập nhật profile
 */
export const updateProfile = async (
  input: UpdateProfileInput,
): Promise<Profile> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .update(input)
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Check username availability
 */
export const checkUsernameAvailable = async (
  username: string,
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .maybeSingle();

  if (error) throw error;
  return data === null;
};

// ==================== React Query Hooks ====================

/**
 * Hook lấy profile hiện tại
 */
export const useCurrentProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.profiles.current(),
    queryFn: getCurrentProfile,
  });
};

/**
 * Hook lấy profile theo ID
 */
export const useProfile = (id: string) => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.profiles.detail(id),
    queryFn: () => getProfileById(id),
    enabled: !!id,
  });
};

/**
 * Hook cập nhật profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEYS.profiles.current(),
      });
    },
  });
};

/**
 * Hook check username
 */
export const useCheckUsername = (username: string) => {
  return useQuery({
    queryKey: [...PROFILE_QUERY_KEYS.profiles.all, "check", username] as const,
    queryFn: () => checkUsernameAvailable(username),
    enabled: username.length >= 3,
  });
};
