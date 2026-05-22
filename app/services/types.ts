// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// Diary Entry Types
export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  activities?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiaryEntryInput {
  date: string;
  content: string;
  activities?: string;
}

export interface UpdateDiaryEntryInput extends Partial<CreateDiaryEntryInput> {
  id: string;
}

// Query Keys
export const QUERY_KEYS = {
  diary: {
    all: ["diary"] as const,
    lists: () => [...QUERY_KEYS.diary.all, "list"] as const,
    list: (filters: any) => [...QUERY_KEYS.diary.lists(), filters] as const,
    details: () => [...QUERY_KEYS.diary.all, "detail"] as const,
    detail: (id: string) => [...QUERY_KEYS.diary.details(), id] as const,
    byDate: (date: string) => [...QUERY_KEYS.diary.all, "date", date] as const,
  },
  // Thêm các query keys khác ở đây
} as const;
