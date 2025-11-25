"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/admin/Card";
import Sidebar from "@/styles/admin/sidebar.css";
import "@/styles/admin/category-create.css"; // 👈 IMPORT CSS RIÊNG
import { addCategory } from "@/services/categoryApi";
import { toast } from "react-toastify"; // 👈 [1] IMPORT TOAST

export default function CreateCategoryPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); // Giữ lại state này cho các lỗi validation FE (nếu có)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Xóa lỗi form trước khi submit

        try {
            const res = await addCategory(name);

            // Giả sử addCategory trả về object chứa 'id' hoặc dữ liệu category đã tạo
            if (!res || !res.id) {
                // Nếu service không ném lỗi mà trả về phản hồi không hợp lệ
                throw new Error("Không thể tạo category!");
            }

            // ✅ HIỂN THỊ THÔNG BÁO THÀNH CÔNG
            toast.success(`🎉 Tạo category "${name}" thành công!`);

            // Chuyển hướng sau khi thông báo thành công
            router.push("/admin/categories/list");

        } catch (e) {
            // ❌ HIỂN THỊ THÔNG BÁO LỖI (Bắt lỗi chi tiết từ Service API)

            // e.message sẽ chứa lỗi cụ thể từ Backend (ví dụ: "Category X đã tồn tại!")
            const errorMessage = e.message || "Lỗi kết nối không xác định.";
            toast.error(errorMessage);

            // Không cần setError(e.message) nữa, vì toast đã hiển thị lỗi

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="catc-wrap fade-in">
            {/* Header */}
            <div className="catc-header">
                <h1 className="catc-title">Tạo Category</h1>

                <button className="catc-btn-back" onClick={() => router.back()}>
                    ← Quay lại
                </button>
            </div>

            {/* Form */}
            <Card className="catc-card">
                <form onSubmit={handleSubmit} className="catc-form">
                    <label className="catc-label">Tên Category</label>
                    <input
                        type="text"
                        className="catc-input"
                        placeholder="Nhập tên category..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    {error && <p className="catc-error">{error}</p>}

                    <button type="submit" className="catc-btn-create" disabled={loading}>
                        {loading ? "Đang tạo..." : "Tạo Category"}
                    </button>
                </form>
            </Card>
        </div>
    );
}