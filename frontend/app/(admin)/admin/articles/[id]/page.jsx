"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PopupConfirm from "@/components/admin/PopupConfirm";
import "@/styles/admin/articles_view.css";

export default function ArticleView() {

    const { id } = useParams();

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showRaw, setShowRaw] = useState(false);
    const [showContent, setShowContent] = useState(false);

    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const res = await fetch(`/api/articles/${id}`);
                const json = await res.json();
                setArticle(json.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return <p className="fade-in">Đang tải…</p>;
    if (!article) return <p className="fade-in">Không tìm thấy dữ liệu!</p>;

    return (
        <div className="art-view-container fade-in">

            {/* HEADER */}
            <div className="av-header">
                <h1 className="av-title">Chi Tiết Bài Viết</h1>

                <div className="av-actions">
                    <Link href="/admin/articles/list" className="cv-btn-back">
                        ← Quay lại
                    </Link>

                    <Link href={`/admin/articles/${id}/edit`} className="cv-btn-edit">
                        ✎ Sửa
                    </Link>

                    <button
                        className="cv-btn-delete"
                        onClick={() => setShowPopup(true)}
                    >
                        🗑 Xoá
                    </button>
                </div>
            </div>

            {/* CARD */}
            <div className="av-card">

                <div className="av-img-wrap">
                    {article.image_url ? (
                        <img src={article.image_url} className="av-img" />
                    ) : (
                        <div className="av-img-placeholder">Không có ảnh</div>
                    )}
                </div>

                <div className="av-fields">

                    <Field label="ID" value={article.id} />
                    <Field label="Title" value={article.title} />
                    <Field label="Slug" value={article.slug} />
                    <Field label="URL" value={article.url} />
                    <Field label="Status" value={article.status} />
                    <Field label="Category ID" value={article.categoryId} />
                    <Field label="Source ID" value={article.sourceId} />

                    <Field label="Description" value={article.description} long />

                    <Field
                        label="Created At"
                        value={new Date(article.createdAt).toLocaleString("vi-VN")}
                    />

                    <Field
                        label="Updated At"
                        value={new Date(article.updatedAt).toLocaleString("vi-VN")}
                    />

                    {/* RAW */}
                    <div className="av-block">
                        <label>Nội dung gốc (content_raw)</label>

                        <pre className={`av-pre ${showRaw ? "" : "av-collapsed"}`}>
                            {article.content_raw || "—"}
                        </pre>

                        <button
                            className="av-toggle-btn"
                            onClick={() => setShowRaw(!showRaw)}
                        >
                            {showRaw ? "Thu gọn ▲" : "Xem thêm ▼"}
                        </button>
                    </div>

                    {/* CONTENT */}
                    <div className="av-block">
                        <label>Nội dung đã xử lý (content)</label>

                        <div
                            className={`av-html ${showContent ? "" : "av-collapsed"}`}
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        <button
                            className="av-toggle-btn"
                            onClick={() => setShowContent(!showContent)}
                        >
                            {showContent ? "Thu gọn ▲" : "Xem thêm ▼"}
                        </button>
                    </div>

                </div>
            </div>

            {/* POPUP XOÁ */}
            <PopupConfirm
                open={showPopup}
                title="Xoá bài viết?"
                message={`Bạn chắc chắn muốn xoá bài viết <strong>${article.title}</strong>?`}
                onClose={() => setShowPopup(false)}
                onConfirm={async () => {
                    await fetch(`/api/articles/${id}`, { method: "DELETE" });
                    window.location.href = "/admin/articles/list";
                }}
            />

        </div>
    );
}

/* Field Component */
function Field({ label, value, long }) {
    return (
        <div className={`av-field ${long ? "long" : ""}`}>
            <label>{label}</label>
            <div className="av-value">{value || "—"}</div>
        </div>
    );
}
