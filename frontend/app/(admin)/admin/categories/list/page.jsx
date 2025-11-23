"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/admin/Card";

import "@/styles/admin/categories.css";
import "@/styles/admin/category-edit.css";

import { deleteCategory, fetchCategories } from "@/services/categoryService";

/* ================= ICONS ================= */
const IconView = () => (
    <svg className="neo-icon" viewBox="0 0 24 24">
        <path d="M12 5c-5 0-9 5-9 7s4 7 9 7 9-5 9-7-4-7-9-7z" />
        <circle cx="12" cy="12" r="3.2" />
    </svg>
);
const IconEdit = () => (
    <svg className="neo-icon" viewBox="0 0 24 24">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
    </svg>
);
const IconDelete = () => (
    <svg className="neo-icon" viewBox="0 0 24 24">
        <path d="M6 7h12M10 11v6M14 11v6M9 7l1-2h4l1 2M5 7h14l-1 13H6L5 7z" />
    </svg>
);
/* FORMAT DATE */
function formatDate(dt) {
    if (!dt) return "—";
    return new Date(dt).toLocaleDateString("vi-VN");
}

export default function CategoriesPage() {
    const [items, setItems] = useState([]);
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    const [totalPages, setTotalPages] = useState(1);
    const [totalRows, setTotalRows] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    /* LOAD DATA */
    useEffect(() => {
        let active = true;

        async function load() {
            setLoading(true);
            try {
                const res = await fetchCategories(page, limit, q);

                if (!active) return;

                const list = res?.data ?? [];
                const pag = res?.pagination ?? {};

                setItems(list);
                setTotalPages(pag.totalPages || 1);
                setTotalRows(pag.total || 0);
            } catch (e) {
                console.error(e);
                setError("Không tải được dữ liệu.");
            } finally {
                active && setLoading(false);
            }
        }

        load();
        return () => { active = false };
    }, [page, q]);

    /* DELETE */
    async function confirmDelete() {
        if (!deleteId) return;

        const ok = await deleteCategory(deleteId);
        if (ok) {
            setItems(items.filter((x) => x.id !== deleteId));
            setShowDeletePopup(false);
            setDeleteId(null);
        } else {
            alert("Xoá thất bại!");
        }
    }

    if (loading) {
        return (
            <div className="cat-wrap fade-in">
                <Card><p>Đang tải dữ liệu...</p></Card>
            </div>
        );
    }

    return (
        <div className="cat-wrap fade-in">
            {/* HEADER */}
            <div className="cat-header">
                <h1 className="cat-title neon-title">Categories</h1>

                <div className="cat-actions">
                    <Link href="/admin" className="cv-btn-back">← Quay Lại</Link>
                    <Link href="/admin/categories/create" className="cv-btn-edit">+ Thêm Mới</Link>
                </div>
            </div>

            {/* SEARCH */}
            <Card className="cat-card" style={{ marginBottom: 16 }}>
                <div className="cat-tool-row">
                    <input
                        value={q}
                        onChange={(e) => { setQ(e.target.value); setPage(1); }}
                        className="cat-input"
                        placeholder="Tìm theo ID, tên hoặc slug..."
                    />

                    <span className="cat-counter">
            Tổng: <strong>{totalRows}</strong>
          </span>
                </div>

                {error && <p className="cat-error">{error}</p>}
            </Card>

            {/* TABLE */}
            <Card className="cat-card">
                <h2 className="cat-section-title">Danh sách</h2>

                {items.length === 0 ? (
                    <p className="cat-empty">Không có dữ liệu.</p>
                ) : (
                    <div className="cat-table-wrap">
                        <table className="cat-table">
                            <thead>
                            <tr>
                                <th style={{ width: 60 }}>ID</th>
                                <th>Tên</th>
                                <th>Slug</th>
                                <th>Ngày tạo</th>
                                <th>Cập nhật cuối</th>
                                <th>Số bài viết</th>
                                <th style={{ width: 140 }}>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {items.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td className="cat-td-strong">{c.name}</td>
                                    <td>{c.slug}</td>
                                    <td>{formatDate(c.createdAt)}</td>
                                    <td>{formatDate(c.updatedAt)}</td>
                                    <td>{c.postsCount}</td>

                                    <td>
                                        <div className="neo-action-row">
                                            <Link
                                                href={`/admin/categories/${c.id}`}
                                                className="neo-icon-btn view"
                                            >
                                                <IconView />
                                            </Link>

                                            <Link
                                                href={`/admin/categories/${c.id}/edit`}
                                                className="neo-icon-btn edit"
                                            >
                                                <IconEdit />
                                            </Link>

                                            <button
                                                onClick={() => {
                                                    setDeleteId(c.id);
                                                    setShowDeletePopup(true);
                                                }}
                                                className="neo-icon-btn delete"
                                            >
                                                <IconDelete />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                    </div>
                )}

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="cat-pagination">
                        <button
                            className="btn-ghost"
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            Trước
                        </button>

                        <span className="cat-page-indicator">
              Trang {page}/{totalPages}
            </span>

                        <button
                            className="btn-ghost"
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Sau
                        </button>
                    </div>
                )}
            </Card>

            {/* DELETE POPUP */}
            {showDeletePopup && (
                <div className="neo-popup-overlay">
                    <div className="neo-popup">
                        <h3>Xoá Category?</h3>
                        <p>Bạn có chắc muốn xoá? Các bài viết sẽ bị mất category.</p>

                        <div className="neo-popup-actions">
                            <button className="neo-cancel" onClick={() => setShowDeletePopup(false)}>Huỷ</button>
                            <button className="neo-delete" onClick={confirmDelete}>Xoá luôn</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
