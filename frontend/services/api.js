import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// 👇 Tạo instance axios
export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10s tránh treo UI
});

// 👇 Response Interceptor: luôn trả về response.data.data
api.interceptors.response.use(
  (response) => {
    // API dạng {success, message, data}
    if (response?.data?.data !== undefined) return response.data.data;
    return response.data;
  },
  (error) => {
    console.error("❌ API Error:", error.response || error.message);
    return Promise.reject(
      error.response?.data?.message || "Request failed"
    );
  }
);