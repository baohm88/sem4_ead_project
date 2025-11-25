"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Card from "@/components/admin/Card";
import { toast } from "react-toastify"; // 👈 [1] IMPORT TOAST

import "@/styles/admin/categories.css"; // CSS list
import "@/styles/admin/category-edit.css"; // Popup CSS đang dùng bên edit
import { deleteCategory, fetchCategories } from "@/services/categoryApi";

const PAGE_SIZE = 5;

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

/* ================= FORMAT DATE ================ */
function formatDate(dt) {
    if (!dt) return "—";
    return new Date(dt).toLocaleDateString("vi-VN");
}

/* ====================================================== */
export default function CategoriesPage() {
    const [all, setAll] = useState([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const [error, setError] = useState("");

    /* ===== Popup Delete ===== */
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    /* ================ LOAD DATA ================ */
    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const data = await fetchCategories();
                if (!mounted) return;

                setAll(
                    Array.isArray(data)
                        ? data.map((c) => ({
                            id: c.id,
                            name: c.name,
                            createdAt: c.createdAt,
                            updatedAt: c.updatedAt,
                            postsCount: c.postsCount ?? 0,
                        }))
                        : []
                );
            } catch (e) {
                setError("Không tải được dữ liệu.");
            } finally {
                mounted && setLoading(false);
            }
        })();

        return () => (mounted = false);
    }, []);

    /* ================ FILTER ================ */
    const filtered = useMemo(() => {
        const kw = q.trim().toLowerCase();
        return all.filter(
            (c) => String(c.id).includes(kw) || c.name.toLowerCase().includes(kw)
        );
    }, [all, q]);

    useEffect(() => setPage(1), [q]);

    /* ================ PAGINATION ================ */
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    /* ================ DELETE CONFIRM (ĐÃ CẬP NHẬT) ================ */
    async function confirmDelete() {
        if (!deleteId) return;

        try {
            // [2] GỌI SERVICE API
            await deleteCategory(deleteId);

            // [3] BLOCK THÀNH CÔNG
            setAll(all.filter((c) => c.id !== deleteId)); // Xoá tại FE
            toast.success("Danh mục đã được xóa thành công!");

        } catch (e) {
            // [4] BLOCK THẤT BẠI - Bắt lỗi chi tiết từ Service API
            console.error("Lỗi xóa category:", e.message);

            let errorMessage = e.message || "Lỗi kết nối không xác định.";

            // 5. HIỂN THỊ THÔNG BÁO LỖI CHI TIẾT
            // Thông báo sẽ là: "Không thể xoá. Category đang được dùng bởi X bài viết."
            toast.error(errorMessage);
        }

        // Luôn đóng popup sau khi xử lý xong (dù thành công hay thất bại)
        setShowDeletePopup(false);
        setDeleteId(null);
    }

    /* ================ LOADING ================ */
    if (loading) {
        return (
            <div className="cat-wrap fade-in">
                <Card className="cat-card">
                    <p>Đang tải dữ liệu...</p>
                </Card>
            </div>
        );
    }

    /* ===================================================================== */
    return (
        <div className="cat-wrap fade-in">
            {/* HEADER */}
            <div className="cat-header">
                <h1 className="cat-title neon-title">Categories</h1>

                <div className="cat-actions">
                    <Link href="/admin" className="cv-btn-back">
                        ← Quay Lại
                    </Link>

                    <Link href="/admin/categories/create" className="cv-btn-edit">
                        + Thêm Mới
                    </Link>
                </div>
            </div>

            {/* SEARCH */}
            <Card className="cat-card" style={{ marginBottom: 16 }}>
                <div className="cat-tool-row">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="cat-input"
                        placeholder="Tìm theo ID hoặc tên..."
                    />

                    <span className="cat-counter">
            Tổng: <strong>{total}</strong>
          </span>
                </div>

                {error && <p className="cat-error">{error}</p>}
            </Card>

            {/* TABLE */}
            <Card className="cat-card">
                <h2 className="cat-section-title">Danh sách</h2>

                {current.length === 0 ? (
                    <p className="cat-empty">Không có dữ liệu.</p>
                ) : (
                    <div className="cat-table-wrap">
                        <table className="cat-table">
                            <thead>
                            <tr>
                                <th style={{ width: 60 }}>ID</th>
                                <th>Tên</th>
                                <th>Ngày tạo</th>
                                <th>Cập nhật cuối</th>
                                <th>Số bài viết</th>
                                <th style={{ width: 140 }}>Action</th>
                            </tr>
                            </thead>

                            <tbody>
                            {current.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td className="cat-td-strong">{c.name}</td>
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
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            Trước
                        </button>

                        <span className="cat-page-indicator">
              Trang {page}/{totalPages}
            </span>

                        <button
                            className="btn-ghost"
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        >
                            Sau
                        </button>
                    </div>
                )}
            </Card>

            {/* ===================================================================== */}
            {/* ========================= DELETE POPUP =============================== */}
            {/* ===================================================================== */}

            {showDeletePopup && (
                <div className="neo-popup-overlay">
                    <div className="neo-popup">
                        <div className="neo-popup-icon">
                            <svg viewBox="0 0 24 24">
                                <path
                                    d="M12 9v4m0 4h.01M12 2l9 18H3L12 2z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        <h3>Xoá Category?</h3>

                        <p>
                            Bạn chắc chắn muốn xoá category này? <br />
                            <strong>
                                Các bài viết đang dùng category này sẽ mất category.
                            </strong>
                        </p>

                        <div className="neo-popup-actions">
                            <button
                                className="neo-cancel"
                                onClick={() => setShowDeletePopup(false)}
                            >
                                Huỷ
                            </button>

                            <button className="neo-delete" onClick={confirmDelete}>
                                Xoá luôn
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}