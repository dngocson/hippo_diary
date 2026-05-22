import { QueryClient } from "@tanstack/react-query";

// Cấu hình QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Thời gian cache data (5 phút)
      staleTime: 5 * 60 * 1000,

      // Thời gian giữ data trong cache khi không sử dụng (10 phút)
      gcTime: 10 * 60 * 1000,

      // Tự động retry khi request thất bại
      retry: 2,

      // Không tự động refetch khi window focus
      refetchOnWindowFocus: false,

      // Không tự động refetch khi mount
      refetchOnMount: false,

      // Tự động refetch khi reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutation 1 lần nếu thất bại
      retry: 1,

      // Callback khi mutation thành công
      onSuccess: () => {
        console.log("Mutation successful");
      },

      // Callback khi mutation thất bại
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    },
  },
});
