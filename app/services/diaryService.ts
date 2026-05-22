import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/app/libs/axios";
import {
  ApiResponse,
  CreateDiaryEntryInput,
  DiaryEntry,
  QUERY_KEYS,
  UpdateDiaryEntryInput,
} from "./types";

// API Endpoints
const ENDPOINTS = {
  diary: {
    list: "/diary",
    byId: (id: string) => `/diary/${id}`,
    byDate: (date: string) => `/diary/date/${date}`,
  },
};

// ==================== API Functions ====================

// Lấy tất cả diary entries
export const getDiaryEntries = async (): Promise<DiaryEntry[]> => {
  const { data } = await axiosInstance.get<ApiResponse<DiaryEntry[]>>(
    ENDPOINTS.diary.list,
  );
  return data.data;
};

// Lấy diary entry theo ID
export const getDiaryEntryById = async (id: string): Promise<DiaryEntry> => {
  const { data } = await axiosInstance.get<ApiResponse<DiaryEntry>>(
    ENDPOINTS.diary.byId(id),
  );
  return data.data;
};

// Lấy diary entry theo ngày
export const getDiaryEntryByDate = async (
  date: string,
): Promise<DiaryEntry | null> => {
  const { data } = await axiosInstance.get<ApiResponse<DiaryEntry>>(
    ENDPOINTS.diary.byDate(date),
  );
  return data.data;
};

// Tạo diary entry mới
export const createDiaryEntry = async (
  input: CreateDiaryEntryInput,
): Promise<DiaryEntry> => {
  const { data } = await axiosInstance.post<ApiResponse<DiaryEntry>>(
    ENDPOINTS.diary.list,
    input,
  );
  return data.data;
};

// Cập nhật diary entry
export const updateDiaryEntry = async (
  input: UpdateDiaryEntryInput,
): Promise<DiaryEntry> => {
  const { id, ...updateData } = input;
  const { data } = await axiosInstance.put<ApiResponse<DiaryEntry>>(
    ENDPOINTS.diary.byId(id),
    updateData,
  );
  return data.data;
};

// Xóa diary entry
export const deleteDiaryEntry = async (id: string): Promise<void> => {
  await axiosInstance.delete(ENDPOINTS.diary.byId(id));
};

// ==================== React Query Hooks ====================

// Hook lấy danh sách diary entries
export const useDiaryEntries = () => {
  return useQuery({
    queryKey: QUERY_KEYS.diary.lists(),
    queryFn: getDiaryEntries,
  });
};

// Hook lấy diary entry theo ID
export const useDiaryEntry = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.diary.detail(id),
    queryFn: () => getDiaryEntryById(id),
    enabled: !!id, // Chỉ fetch khi có id
  });
};

// Hook lấy diary entry theo ngày
export const useDiaryEntryByDate = (date: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.diary.byDate(date),
    queryFn: () => getDiaryEntryByDate(date),
    enabled: !!date, // Chỉ fetch khi có date
  });
};

// Hook tạo diary entry mới
export const useCreateDiaryEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDiaryEntry,
    onSuccess: (newEntry) => {
      // Invalidate và refetch danh sách diary entries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.diary.lists(),
      });

      // Invalidate entry theo ngày
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.diary.byDate(newEntry.date),
      });
    },
  });
};

// Hook cập nhật diary entry
export const useUpdateDiaryEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDiaryEntry,
    onSuccess: (updatedEntry) => {
      // Invalidate danh sách
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.diary.lists(),
      });

      // Invalidate entry cụ thể
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.diary.detail(updatedEntry.id),
      });

      // Invalidate entry theo ngày
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.diary.byDate(updatedEntry.date),
      });
    },
  });
};

// Hook xóa diary entry
export const useDeleteDiaryEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDiaryEntry,
    onSuccess: () => {
      // Invalidate danh sách sau khi xóa
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.diary.lists(),
      });
    },
  });
};
