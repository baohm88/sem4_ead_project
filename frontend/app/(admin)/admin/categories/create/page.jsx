"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/admin/Card";

import "@/styles/admin/category-create.css";
import { addCategory, checkSlugUnique } from "@/services/categoryService";

/* =================== TẠO SLUG TỰ ĐỘNG =================== */
function toSlug(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export default function CreateCategoryPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [slugValid, setSlugValid] = useState(null); // null | true | false
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* ================== Validate slug realtime ================== */
    async function handleSlugChange(value) {
        const clean = toSlug(value);
        setSlug(clean);

        if (!clean) {
            setSlugValid(null);
            return;
        }

        const exists = await checkSlugUnique(clean);
        setSlugValid(!exists); // exists = true → invalid
    }

    /* ================== Update Name + Auto slug ================== */
    const handleNameChange = async (value) => {
        setName(value);

        const autoSlug = toSlug(value);
        setSlug(autoSlug);

        if (!autoSlug) {
            setSlugValid(null);
            return;
        }

        const exists = await checkSlugUnique(autoSlug);
        setSlugValid(!exists);
    };

    /* ================== Submit ================== */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!slugValid) {
                throw new Error("Slug bị trùng hoặc không hợp lệ.");
            }

            const res = await addCategory({ name, slug });
            if (!res?.id) throw new Error("Không thể tạo category!");

            router.push("/admin/categories/list");
        } catch (err) {
            setError(err.message || "Có lỗi xảy ra");
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

                    {/* Name */}
                    <label className="catc-label">Tên Category</label>
                    <input
                        type="text"
                        className="catc-input"
                        placeholder="Nhập tên category..."
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        required
                    />

                    {/* Slug */}
                    <label className="catc-label" style={{ marginTop: 16 }}>Slug</label>
                    <input
                        type="text"
                        className={`catc-input ${slugValid === false ? "input-error" : ""}`}
                        placeholder="slug-tu-dong-tao..."
                        value={slug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        required
                    />

                    {/* Validate Text */}
                    {slugValid === false && (
                        <p className="catc-error">❌ Slug đã tồn tại — hãy chọn slug khác.</p>
                    )}

                    {slugValid === true && (
                        <p className="catc-success">✅ Slug hợp lệ</p>
                    )}

                    {error && <p className="catc-error">{error}</p>}

                    <button
                        type="submit"
                        className="catc-btn-create"
                        disabled={loading || slugValid === false}
                    >
                        {loading ? "Đang tạo..." : "Tạo Category"}
                    </button>
                </form>
            </Card>
        </div>
    );
}
