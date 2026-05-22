import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import config from "@/app/config";

// Cấu hình base URL - lấy từ .env file
// Development: http://localhost:3000/api
// Physical device: http://192.168.1.x:3000/api (thay bằng IP máy của bạn)
// Production: https://api.yourdomain.com
const BASE_URL = config.api.baseUrl;

if (config.features.debug) {
  console.log("🔌 API Base URL:", BASE_URL);
}

// Tạo axios instance
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - thêm token vào header
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Lấy token từ storage (có thể dùng AsyncStorage hoặc Supabase)
      // const token = await AsyncStorage.getItem("access_token");

      // Nếu có token, thêm vào header
      // if (token && config.headers) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor - xử lý lỗi chung
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Xử lý lỗi 401 - Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token logic
        // const newToken = await refreshAccessToken();
        // if (newToken && originalRequest.headers) {
        //   originalRequest.headers.Authorization = `Bearer ${newToken}`;
        //   return axiosInstance(originalRequest);
        // }
      } catch (refreshError) {
        // Redirect to login hoặc xử lý logout
        return Promise.reject(refreshError);
      }
    }

    // Xử lý các lỗi khác
    if (error.response) {
      // Server trả về status code ngoài 2xx
      const errorMessage =
        (error.response.data as { message?: string })?.message ||
        "Đã có lỗi xảy ra";

      console.error("API Error:", errorMessage);
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      console.error("Network Error:", error.message);
      return Promise.reject(new Error("Lỗi kết nối mạng"));
    } else {
      // Lỗi khác
      console.error("Error:", error.message);
      return Promise.reject(error);
    }
  },
);

// Export default instance
export default axiosInstance;
