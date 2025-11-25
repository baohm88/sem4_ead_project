"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SourceCreateForm from "@/components/admin/SourceCreateForm"; // Import Form component
import { fetchCategories } from "@/services/categoryApi";
import { createSource } from "@/services/sourceApi"; // Hàm gọi API POST Source
import "@/styles/admin/category-create.css"; // Dùng lại CSS layout catc-*
import "@/styles/admin/SourceCreate.css"; // CSS cho form elements (nếu bạn có)

export default function AddSourcePage() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Fetch Categories
    useEffect(() => {
        setLoadingCategories(true);
        fetchCategories()
            .then(res => setCategories(res || []))
            .catch(err => {
                console.error("Lỗi tải danh mục:", err);
                toast.error("Không thể tải danh mục.");
            })
            .finally(() => setLoadingCategories(false));
    }, []);

    const handleSave = async (formPayload) => {
        try {
            // Chuẩn bị payload cho BE: đảm bảo categoryId là số hoặc object
            const payload = {
                ...formPayload,
                categoryId: Number(formPayload.categoryId) // Đảm bảo categoryId là kiểu Number
            };

            // Xóa các trường không cần thiết cho API (nếu cần)
            delete payload.articleCategory;

            const res = await createSource(payload);

            if (res && res.id) {
                toast.success(`🎉 Tạo Source "${formPayload.title}" thành công!`);
                router.push("/admin/sources"); // Quay lại trang danh sách sau khi lưu
            } else {
                throw new Error(res?.message || "Lỗi tạo Source không xác định.");
            }

        } catch (error) {
            console.error("Error creating source:", error);
            toast.error(error.message || "Lỗi kết nối hoặc dữ liệu không hợp lệ.");
        }
    };

    return (
        <div className="catc-wrap fade-in">
            {/* Header mô phỏng trang categories/create */}
            <div className="catc-header">
                <h1 className="catc-title">Thêm Source Mới</h1>
                <button
                    className="catc-btn-back"
                    onClick={() => router.back()}
                >
                    ← Quay lại
                </button>
            </div>

            {loadingCategories ? (
                <div className="text-center p-10 text-gray-600">Đang tải danh mục...</div>
            ) : (
                <SourceCreateForm
                    onSubmit={handleSave}
                    categories={categories}
                    editingData={null} // Đảm bảo là chế độ Add
                />
            )}
        </div>
    );
}