"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Imp  ort CSS bắt buộc

export default function ToastProvider({ children }) {
    return (
        <>
            {children}
            <ToastContainer
                position="top-right"
                autoClose={3000} // Tự đóng sau 3 giây
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light" // hoặc "colored" nếu muốn màu mè hơn
            />
        </>
    );
}