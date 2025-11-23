"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "@/components/admin/Card";

import "@/styles/admin/category-edit.css";
import { getCategoryById, updateCategory, checkSlugUnique } from "@/services/categoryService";

/* =================== TẠO SLUG =================== */
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

export default function EditCategoryPage() {
    const params = useParams();
    const id = Number(params.id);
    const router = useRouter();

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [slugValid, setSlugValid] = useState(null); // null | true | false
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    /* =================== LOAD DATA =================== */
    useEffect(() => {
        (async () => {
            try {
                const data = await getCategoryById(id);
                if (!data) return router.push("/admin/categories/list");

                setName(data.name);
                setSlug(data.slug);
                setSlugValid(true); // slug hiện tại chắc chắn hợp lệ
            } catch (e) {
                router.push("/admin/categories/list");
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    /* =================== VALIDATE SLUG REALTIME =================== */
    async function validateSlug(value) {
        const clean = toSlug(value);
        setSlug(clean);

        if (!clean) {
            setSlugValid(null);
            return;
        }

        // gọi API check slug (bỏ qua this category)
        const exists = await checkSlugUnique(clean, id);
        setSlugValid(!exists);
    }

    /* =================== NAME CHANGE =================== */
    async function handleNameChange(value) {
        setName(value);

        const autoSlug = toSlug(value);
        setSlug(autoSlug);

        if (!autoSlug) {
            setSlugValid(null);
            return;
        }

        const exists = await checkSlugUnique(autoSlug, id);
        setSlugValid(!exists);
    }

    /* =================== SAVE =================== */
    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            if (!slugValid) throw new Error("Slug không hợp lệ hoặc đã tồn tại.");

            const json = await updateCategory(id, { name, slug });

            if (!json?.id) throw new Error("Cập nhật thất bại!");

            router.push(`/admin/categories/${id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="edit-wrap fade-in">
                <Card>
                    <p>Đang tải...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="edit-wrap fade-in">
            {/* HEADER */}
            <div className="edit-header">
                <h1 className="edit-title">Sửa Category</h1>

                <button
                    className="edit-btn-back"
                    onClick={() => router.push(`/admin/categories/${id}`)}
                >
                    ← Quay lại
                </button>
            </div>

            {/* FORM */}
            <Card className="edit-card">
                <form onSubmit={handleSave} className="edit-form">

                    {/* NAME */}
                    <label className="edit-label">Tên Category</label>
                    <input
                        className="edit-input"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        required
                    />

                    {/* SLUG */}
                    <label className="edit-label" style={{ marginTop: 16 }}>
                        Slug
                    </label>

                    <input
                        className={`edit-input ${slugValid === false ? "input-error" : ""}`}
                        value={slug}
                        onChange={(e) => validateSlug(e.target.value)}
                        required
                    />

                    {/* Validate Message */}
                    {slugValid === false && (
                        <p className="edit-error">❌ Slug đã tồn tại — vui lòng chọn slug khác.</p>
                    )}

                    {slugValid === true && (
                        <p className="edit-success">✅ Slug hợp lệ</p>
                    )}

                    {error && <p className="edit-error">{error}</p>}

                    {/* ACTIONS */}
                    <div className="edit-actions">
                        <button
                            type="submit"
                            className="edit-btn-save"
                            disabled={saving || slugValid === false}
                        >
                            {saving ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
