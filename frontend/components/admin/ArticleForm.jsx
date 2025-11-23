"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import "@/styles/admin/articles_form.css";
import dynamic from "next/dynamic";

// CKEditor phải import dynamic để tránh lỗi Window is not defined
const CkEditor = dynamic(() => import("@/components/admin/CkEditor"), {
    ssr: false,
});

export default function ArticleForm({ initialData, mode }) {
    const router = useRouter();
    const isEdit = mode === "edit";

    // ============= FORM STATE =============
    const [form, setForm] = useState({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        description: initialData?.description || "",
        content_raw: initialData?.content_raw || "",
        content: initialData?.content || "",
        image_url: initialData?.image_url || "",
        url: initialData?.url || "",
        status: initialData?.status || "draft",
        categoryId: initialData?.categoryId || "",
        sourceId: initialData?.sourceId || "",
    });

    const [categories, setCategories] = useState([]);
    const [sources, setSources] = useState([]);

    // ==================== LOAD CATEGORIES & SOURCES ====================
    useEffect(() => {
        async function loadData() {
            try {
                const catRes = await fetch("/api/categories?page=1&limit=9999");
                // const srcRes = await fetch("/api/sources");

                const catJson = await catRes.json();
                // const srcJson = await srcRes.json();

                setCategories(catJson?.data || []);
                // setSources(srcJson || []);

            } catch (err) {
                console.error("CATEGORY/SOURCE ERROR:", err);
            }
        }

        loadData();
    }, []);

    // ==================== HANDLE SUBMIT ====================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const method = isEdit ? "PUT" : "POST";
        const endpoint = isEdit
            ? `/api/articles/${initialData.id}`
            : "/api/articles";

        const res = await fetch(endpoint, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            router.push("/admin/articles/list");
        } else {
            alert("❌ Lỗi khi lưu bài viết!");
        }
    };

    // ==================== JSX ====================
    return (
        <>

            {/* 🔵 HEADER BAR (GIỐNG VIEW PAGE) */}
            <div className="art-header">
                <button
                    className="art-btn-back"
                    onClick={() => router.push("/admin/articles/list")}
                >
                    ← Quay lại
                </button>

                <h1 className="art-header-title">
                    {isEdit ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
                </h1>

                <button className="art-btn-save" onClick={handleSubmit}>
                    💾 Lưu
                </button>
            </div>

            {/* FORM */}
            <form className="art-form" onSubmit={handleSubmit}>
                <div className="art-grid">

                    <Field label="Tiêu đề" name="title" value={form.title} setForm={setForm} />
                    <Field label="Slug" name="slug" value={form.slug} setForm={setForm} />
                    <Field label="Ảnh đại diện URL" name="image_url" value={form.image_url} setForm={setForm} />
                    <Field label="URL gốc" name="url" value={form.url} setForm={setForm} />

                    {/* STATUS */}
                    <div className="art-group">
                        <label>Trạng thái</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                            className="art-input"
                        >
                            <option value="draft">Draft</option>
                            <option value="public">Public</option>
                        </select>
                    </div>

                    {/* CATEGORY DROPDOWN */}
                    <div className="art-group">
                        <label>Danh mục</label>
                        <select
                            className="art-input"
                            value={form.categoryId}
                            onChange={(e) =>
                                setForm({ ...form, categoryId: e.target.value })
                            }
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* SOURCE DROPDOWN */}
                    {/*<div className="art-group">*/}
                    {/*    <label>Nguồn</label>*/}
                    {/*    <select*/}
                    {/*        className="art-input"*/}
                    {/*        value={form.sourceId}*/}
                    {/*        onChange={(e) =>*/}
                    {/*            setForm({ ...form, sourceId: e.target.value })*/}
                    {/*        }*/}
                    {/*    >*/}
                    {/*        <option value="">-- Chọn nguồn --</option>*/}
                    {/*        {sources.map((src) => (*/}
                    {/*            <option key={src.id} value={src.id}>*/}
                    {/*                {src.name}*/}
                    {/*            </option>*/}
                    {/*        ))}*/}
                    {/*    </select>*/}
                    {/*</div>*/}
                </div>

                {/* DESCRIPTION */}
                <div className="art-group">
                    <label>Mô tả</label>
                    <textarea
                        className="art-textarea"
                        name="description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </div>

                {/* RAW CONTENT */}
                <div className="art-group">
                    <label>Content Raw</label>
                    <textarea
                        className="art-code"
                        name="content_raw"
                        value={form.content_raw}
                        onChange={(e) => setForm({ ...form, content_raw: e.target.value })}
                        rows={7}
                    />
                </div>

                {/* CKEDITOR HTML CONTENT */}
                <div className="art-group">
                    <label>Nội dung bài viết (CKEditor)</label>
                    <CkEditor
                        value={form.content}
                        onChange={(html) => setForm({ ...form, content: html })}
                    />
                </div>

                <button className="art-submit">
                    {isEdit ? "Lưu " : "Tạo bài viết"}
                </button>
            </form>
        </>
    );
}

// ==================== FIELD INPUT COMPONENT ====================
function Field({ label, name, value, setForm }) {
    return (
        <div className="art-group">
            <label>{label}</label>
            <input
                className="art-input"
                name={name}
                value={value}
                onChange={(e) =>
                    setForm((prev) => ({ ...prev, [name]: e.target.value }))
                }
            />
        </div>
    );
}
