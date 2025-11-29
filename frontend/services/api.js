// frontend/services/api.js
import axios from "axios";

const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const api = axios.create({
    baseURL: API_BASE,
    timeout: 60000,
});

api.interceptors.response.use(
    (response) => {
        return response.data; // luôn trả {success, message, data}
    },
    (error) => {
        console.error("❌ API Error:", error.response || error.message);

        return Promise.reject(
            error.response?.data?.message || error.message || "Request failed"
        );
    }
);