/**
 * Supabase Tag Service
 * API service cho tags và memory_tags (many-to-many)
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/app/libs/supabase";

// ==================== Types ====================

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface MemoryTag {
  memory_id: string;
  tag_id: number;
}

// ==================== Query Keys ====================

export const TAG_QUERY_KEYS = {
  tags: {
    all: ["tags"] as const,
    lists: () => [...TAG_QUERY_KEYS.tags.all, "list"] as const,
    byMemory: (memoryId: string) =>
      [...TAG_QUERY_KEYS.tags.all, "memory", memoryId] as const,
  },
} as const;

// ==================== API Functions ====================

/**
 * Lấy tất cả tags
 */
export const getTags = async (): Promise<Tag[]> => {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Lấy tag theo ID
 */
export const getTagById = async (id: number): Promise<Tag | null> => {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Lấy tags của một memory
 */
export const getTagsByMemory = async (memoryId: string): Promise<Tag[]> => {
  const { data, error } = await supabase
    .from("memory_tags")
    .select("tag_id, tags(*)")
    .eq("memory_id", memoryId);

  if (error) throw error;
  return data?.map((item: any) => item.tags) || [];
};

/**
 * Thêm tag vào memory
 */
export const addTagToMemory = async (
  memoryId: string,
  tagId: number,
): Promise<void> => {
  const { error } = await supabase
    .from("memory_tags")
    .insert([{ memory_id: memoryId, tag_id: tagId }]);

  if (error) throw error;
};

/**
 * Xóa tag khỏi memory
 */
export const removeTagFromMemory = async (
  memoryId: string,
  tagId: number,
): Promise<void> => {
  const { error } = await supabase
    .from("memory_tags")
    .delete()
    .eq("memory_id", memoryId)
    .eq("tag_id", tagId);

  if (error) throw error;
};

/**
 * Set tags cho memory (replace all)
 */
export const setMemoryTags = async (
  memoryId: string,
  tagIds: number[],
): Promise<void> => {
  // Xóa tất cả tags hiện tại
  const { error: deleteError } = await supabase
    .from("memory_tags")
    .delete()
    .eq("memory_id", memoryId);

  if (deleteError) throw deleteError;

  // Thêm tags mới
  if (tagIds.length > 0) {
    const { error: insertError } = await supabase
      .from("memory_tags")
      .insert(tagIds.map((tagId) => ({ memory_id: memoryId, tag_id: tagId })));

    if (insertError) throw insertError;
  }
};

/**
 * Tạo tag mới hoặc lấy existing
 */
export const getOrCreateTag = async (name: string): Promise<Tag> => {
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  // Check nếu tag đã tồn tại
  const { data: existing, error: checkError } = await supabase
    .from("tags")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (checkError) throw checkError;
  if (existing) return existing;

  // Tạo tag mới
  const { data, error } = await supabase
    .from("tags")
    .insert([{ name, slug }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ==================== React Query Hooks ====================

/**
 * Hook lấy danh sách tags
 */
export const useTags = () => {
  return useQuery({
    queryKey: TAG_QUERY_KEYS.tags.lists(),
    queryFn: getTags,
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
};

/**
 * Hook lấy tags của memory
 */
export const useMemoryTags = (memoryId: string) => {
  return useQuery({
    queryKey: TAG_QUERY_KEYS.tags.byMemory(memoryId),
    queryFn: () => getTagsByMemory(memoryId),
    enabled: !!memoryId,
  });
};

/**
 * Hook thêm tag vào memory
 */
export const useAddTagToMemory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memoryId, tagId }: { memoryId: string; tagId: number }) =>
      addTagToMemory(memoryId, tagId),
    onSuccess: (_, { memoryId }) => {
      queryClient.invalidateQueries({
        queryKey: TAG_QUERY_KEYS.tags.byMemory(memoryId),
      });
    },
  });
};

/**
 * Hook xóa tag khỏi memory
 */
export const useRemoveTagFromMemory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memoryId, tagId }: { memoryId: string; tagId: number }) =>
      removeTagFromMemory(memoryId, tagId),
    onSuccess: (_, { memoryId }) => {
      queryClient.invalidateQueries({
        queryKey: TAG_QUERY_KEYS.tags.byMemory(memoryId),
      });
    },
  });
};

/**
 * Hook set tags cho memory
 */
export const useSetMemoryTags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memoryId,
      tagIds,
    }: {
      memoryId: string;
      tagIds: number[];
    }) => setMemoryTags(memoryId, tagIds),
    onSuccess: (_, { memoryId }) => {
      queryClient.invalidateQueries({
        queryKey: TAG_QUERY_KEYS.tags.byMemory(memoryId),
      });
    },
  });
};

/**
 * Hook get or create tag
 */
export const useGetOrCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: getOrCreateTag,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TAG_QUERY_KEYS.tags.lists(),
      });
    },
  });
};
