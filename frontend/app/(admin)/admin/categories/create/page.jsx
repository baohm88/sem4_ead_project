"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/admin/Card";

import "@/styles/admin/category-create.css"; // 👈 IMPORT CSS RIÊNG
import { addCategory } from "@/services/categoryService";

export default function CreateCategoryPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await addCategory(name)
            const {id } = res;

            if (!id) throw new Error("Không thể tạo category!");

            router.push("/admin/categories/list");
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="catc-wrap fade-in">
            {/* Header */}
            <div className="catc-header">
                <h1 className="catc-title">Tạo Category</h1>

                <button
                    className="catc-btn-back"
                    onClick={() => router.back()}
                >
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

                    <button
                        type="submit"
                        className="catc-btn-create"
                        disabled={loading}
                    >
                        {loading ? "Đang tạo..." : "Tạo Category"}
                    </button>
                </form>
            </Card>
        </div>
    );
}
