/**
 * Supabase Note Service
 * API service cho notes - có thể standalone hoặc belong to memory
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/app/libs/supabase";

// ==================== Types ====================

export interface Note {
  id: string;
  user_id: string;
  memory_id?: string | null;
  title?: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteInput {
  memory_id?: string | null;
  title?: string;
  content: string;
}

export interface UpdateNoteInput extends Partial<CreateNoteInput> {
  id: string;
}

// ==================== Query Keys ====================

export const NOTE_QUERY_KEYS = {
  notes: {
    all: ["notes"] as const,
    lists: () => [...NOTE_QUERY_KEYS.notes.all, "list"] as const,
    detail: (id: string) => [...NOTE_QUERY_KEYS.notes.all, id] as const,
    byMemory: (memoryId: string) =>
      [...NOTE_QUERY_KEYS.notes.all, "memory", memoryId] as const,
    standalone: () => [...NOTE_QUERY_KEYS.notes.all, "standalone"] as const,
  },
} as const;

// ==================== API Functions ====================

/**
 * Lấy tất cả notes của user
 */
export const getNotes = async (): Promise<Note[]> => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Lấy note theo ID
 */
export const getNoteById = async (id: string): Promise<Note | null> => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Lấy notes theo memory_id
 */
export const getNotesByMemory = async (memoryId: string): Promise<Note[]> => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("memory_id", memoryId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Lấy standalone notes (không thuộc memory nào)
 */
export const getStandaloneNotes = async (): Promise<Note[]> => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .is("memory_id", null)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Tạo note mới
 */
export const createNote = async (input: CreateNoteInput): Promise<Note> => {
  const { data, error } = await supabase
    .from("notes")
    .insert([input])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Cập nhật note
 */
export const updateNote = async (input: UpdateNoteInput): Promise<Note> => {
  const { id, ...updateData } = input;

  const { data, error } = await supabase
    .from("notes")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Xóa note
 */
export const deleteNote = async (id: string): Promise<void> => {
  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) throw error;
};

// ==================== React Query Hooks ====================

/**
 * Hook lấy danh sách notes
 */
export const useNotes = () => {
  return useQuery({
    queryKey: NOTE_QUERY_KEYS.notes.lists(),
    queryFn: getNotes,
  });
};

/**
 * Hook lấy note theo ID
 */
export const useNote = (id: string) => {
  return useQuery({
    queryKey: NOTE_QUERY_KEYS.notes.detail(id),
    queryFn: () => getNoteById(id),
    enabled: !!id,
  });
};

/**
 * Hook lấy notes theo memory
 */
export const useNotesByMemory = (memoryId: string) => {
  return useQuery({
    queryKey: NOTE_QUERY_KEYS.notes.byMemory(memoryId),
    queryFn: () => getNotesByMemory(memoryId),
    enabled: !!memoryId,
  });
};

/**
 * Hook lấy standalone notes
 */
export const useStandaloneNotes = () => {
  return useQuery({
    queryKey: NOTE_QUERY_KEYS.notes.standalone(),
    queryFn: getStandaloneNotes,
  });
};

/**
 * Hook tạo note mới
 */
export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({
        queryKey: NOTE_QUERY_KEYS.notes.lists(),
      });
      if (newNote.memory_id) {
        queryClient.invalidateQueries({
          queryKey: NOTE_QUERY_KEYS.notes.byMemory(newNote.memory_id),
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: NOTE_QUERY_KEYS.notes.standalone(),
        });
      }
    },
  });
};

/**
 * Hook cập nhật note
 */
export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNote,
    onSuccess: (updatedNote) => {
      queryClient.invalidateQueries({
        queryKey: NOTE_QUERY_KEYS.notes.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: NOTE_QUERY_KEYS.notes.detail(updatedNote.id),
      });
      if (updatedNote.memory_id) {
        queryClient.invalidateQueries({
          queryKey: NOTE_QUERY_KEYS.notes.byMemory(updatedNote.memory_id),
        });
      }
    },
  });
};

/**
 * Hook xóa note
 */
export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NOTE_QUERY_KEYS.notes.lists(),
      });
    },
  });
};
