/**
 * Supabase Memory Image Service
 * API service cho memory images với sort order
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/app/libs/supabase";

// ==================== Types ====================

export interface MemoryImage {
  id: string;
  memory_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface CreateMemoryImageInput {
  memory_id: string;
  image_url: string;
  sort_order?: number;
}

export interface UpdateMemoryImageInput {
  id: string;
  sort_order?: number;
}

export interface ReorderImagesInput {
  images: Array<{ id: string; sort_order: number }>;
}

// ==================== Query Keys ====================

export const MEMORY_IMAGE_QUERY_KEYS = {
  images: {
    all: ["memory_images"] as const,
    byMemory: (memoryId: string) =>
      [...MEMORY_IMAGE_QUERY_KEYS.images.all, "memory", memoryId] as const,
  },
} as const;

// ==================== API Functions ====================

/**
 * Lấy images của một memory (sorted)
 */
export const getMemoryImages = async (
  memoryId: string,
): Promise<MemoryImage[]> => {
  const { data, error } = await supabase
    .from("memory_images")
    .select("*")
    .eq("memory_id", memoryId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Thêm image vào memory
 */
export const addMemoryImage = async (
  input: CreateMemoryImageInput,
): Promise<MemoryImage> => {
  // Nếu không có sort_order, lấy max + 1
  if (input.sort_order === undefined) {
    const { data: existing } = await supabase
      .from("memory_images")
      .select("sort_order")
      .eq("memory_id", input.memory_id)
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();

    input.sort_order = (existing?.sort_order ?? -1) + 1;
  }

  const { data, error } = await supabase
    .from("memory_images")
    .insert([input])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Xóa image
 */
export const deleteMemoryImage = async (id: string): Promise<void> => {
  const { error } = await supabase.from("memory_images").delete().eq("id", id);

  if (error) throw error;
};

/**
 * Cập nhật sort order của một image
 */
export const updateImageSortOrder = async (
  input: UpdateMemoryImageInput,
): Promise<MemoryImage> => {
  const { id, ...updateData } = input;

  const { data, error } = await supabase
    .from("memory_images")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Reorder nhiều images cùng lúc
 */
export const reorderMemoryImages = async (
  input: ReorderImagesInput,
): Promise<void> => {
  // Update từng image
  const promises = input.images.map((img) =>
    supabase
      .from("memory_images")
      .update({ sort_order: img.sort_order })
      .eq("id", img.id),
  );

  const results = await Promise.all(promises);

  const error = results.find((r) => r.error)?.error;
  if (error) throw error;
};

// ==================== React Query Hooks ====================

/**
 * Hook lấy images của memory
 */
export const useMemoryImages = (memoryId: string) => {
  return useQuery({
    queryKey: MEMORY_IMAGE_QUERY_KEYS.images.byMemory(memoryId),
    queryFn: () => getMemoryImages(memoryId),
    enabled: !!memoryId,
  });
};

/**
 * Hook thêm image
 */
export const useAddMemoryImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addMemoryImage,
    onSuccess: (newImage) => {
      queryClient.invalidateQueries({
        queryKey: MEMORY_IMAGE_QUERY_KEYS.images.byMemory(newImage.memory_id),
      });
    },
  });
};

/**
 * Hook xóa image
 */
export const useDeleteMemoryImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, memoryId }: { id: string; memoryId: string }) =>
      deleteMemoryImage(id),
    onSuccess: (_, { memoryId }) => {
      queryClient.invalidateQueries({
        queryKey: MEMORY_IMAGE_QUERY_KEYS.images.byMemory(memoryId),
      });
    },
  });
};

/**
 * Hook update sort order
 */
export const useUpdateImageSortOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateImageSortOrder,
    onSuccess: (updatedImage) => {
      queryClient.invalidateQueries({
        queryKey: MEMORY_IMAGE_QUERY_KEYS.images.byMemory(
          updatedImage.memory_id,
        ),
      });
    },
  });
};

/**
 * Hook reorder images
 */
export const useReorderMemoryImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderMemoryImages,
    onSuccess: (_, { images }) => {
      // Invalidate tất cả memories liên quan
      const memoryIds = new Set(
        images.map((img) => {
          // Lấy memory_id từ query cache
          const cached = queryClient.getQueryData<MemoryImage[]>([
            "memory_images",
            "memory",
          ]);
          return cached?.find((c) => c.id === img.id)?.memory_id;
        }),
      );

      memoryIds.forEach((memoryId) => {
        if (memoryId) {
          queryClient.invalidateQueries({
            queryKey: MEMORY_IMAGE_QUERY_KEYS.images.byMemory(memoryId),
          });
        }
      });
    },
  });
};
