/**
 * Supabase Helper Functions & Types
 * Các helper functions để làm việc với Supabase dễ dàng hơn
 */

import { supabase } from "./supabase";
import type { User, Session } from "@supabase/supabase-js";

// ==================== Auth Helpers ====================

/**
 * Đăng ký user mới
 */
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

/**
 * Đăng nhập
 */
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

/**
 * Đăng xuất
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Lấy user hiện tại
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

/**
 * Lấy session hiện tại
 */
export const getCurrentSession = async (): Promise<Session | null> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

/**
 * Reset password
 */
export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
};

/**
 * Update user profile
 */
export const updateProfile = async (updates: {
  email?: string;
  password?: string;
  data?: Record<string, any>;
}) => {
  const { data, error } = await supabase.auth.updateUser(updates);
  if (error) throw error;
  return data;
};

// ==================== Auth Listeners ====================

/**
 * Lắng nghe thay đổi auth state
 */
export const onAuthStateChange = (
  callback: (event: string, session: Session | null) => void,
) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback);

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
};

// ==================== Database Helpers ====================

/**
 * Generic type-safe query helper
 */
export const query = <T = any>(tableName: string) => {
  return supabase.from(tableName) as ReturnType<typeof supabase.from>;
};

/**
 * Upload file to storage
 */
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File | Blob,
  options?: {
    cacheControl?: string;
    contentType?: string;
    upsert?: boolean;
  },
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, options);

  if (error) throw error;
  return data;
};

/**
 * Get public URL for file
 */
export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

/**
 * Delete file from storage
 */
export const deleteFile = async (bucket: string, paths: string[]) => {
  const { error } = await supabase.storage.from(bucket).remove(paths);
  if (error) throw error;
};

// ==================== Realtime Helpers ====================

/**
 * Subscribe to table changes
 */
export const subscribeToTable = <T = any>(
  tableName: string,
  callback: (payload: any) => void,
  filter?: string,
) => {
  const channel = supabase
    .channel(`${tableName}_changes`)
    .on(
      "postgres_changes" as any,
      {
        event: "*",
        schema: "public",
        table: tableName,
        filter,
      } as any,
      callback,
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};

// ==================== Utility Functions ====================

/**
 * Check nếu user đang authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const session = await getCurrentSession();
  return session !== null;
};

/**
 * Lấy access token
 */
export const getAccessToken = async (): Promise<string | null> => {
  const session = await getCurrentSession();
  return session?.access_token || null;
};

// Export supabase client
export { supabase };
export default supabase;
