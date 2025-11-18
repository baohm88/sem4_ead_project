"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Card from "@/components/admin/Card";

import "@/styles/admin/categories.css";

const PAGE_SIZE = 10;

export default function CategoriesPage() {
    const [all, setAll] = useState([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            setError("");
            try {
                const res = await fetch("/api/categories", { cache: "no-store" });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                if (!mounted) return;
                // Đảm bảo dữ liệu đúng dạng [{id, name}]
                const safe = Array.isArray(data)
                    ? data.map((c) => ({ id: c.id, name: c.name }))
                    : [];
                setAll(safe);
            } catch (e) {
                if (!mounted) return;
                setError("Không thể tải danh sách categories.");
                setAll([]);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    // Lọc theo từ khóa: id hoặc name
    const filtered = useMemo(() => {
        const kw = q.trim().toLowerCase();
        if (!kw) return all;
        return all.filter((c) => {
            const idStr = String(c.id ?? "").toLowerCase();
            const nameStr = String(c.name ?? "").toLowerCase();
            return idStr.includes(kw) || nameStr.includes(kw);
        });
    }, [all, q]);

    // Reset về trang 1 khi thay đổi từ khóa
    useEffect(() => {
        setPage(1);
    }, [q]);

    // Phân trang
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const pageSafe = Math.min(Math.max(1, page), totalPages);
    const start = (pageSafe - 1) * PAGE_SIZE;
    const current = filtered.slice(start, start + PAGE_SIZE);

    if (loading) {
        return (
            <div className="cat-wrap fade-in">
                <Card className="cat-card">
                    <p>Đang tải danh sách categories...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="cat-wrap fade-in">
            {/* Header */}
            <div className="cat-header">
                <h1 className="cat-title">Categories</h1>
                <div className="cat-actions">
                    <Link href="/admin" className="btn-link">← Quay lại Dashboard</Link>
                    <Link href="/admin/categories/create" className="btn-primary">+ Tạo Category</Link>
                </div>
            </div>

            {/* Toolbar */}
            <Card className="cat-card" style={{ marginBottom: 16 }}>
                <div className="cat-tool-row">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Tìm theo ID hoặc tên..."
                        className="cat-input"
                    />
                    <span className="cat-counter">
            Tổng: <strong>{total}</strong> category
          </span>
                </div>
                {error && <p style={{ color: "#dc2626", marginTop: 8 }}>{error}</p>}
            </Card>

            {/* Bảng */}
            <Card className="cat-card">
                <h2 className="cat-section-title">Danh sách</h2>

                {current.length === 0 ? (
                    <p className="cat-empty">Không có category nào phù hợp.</p>
                ) : (
                    <div className="cat-table-wrap">
                        <table className="cat-table">
                            <thead>
                            <tr>
                                <th style={{ width: 80 }}>ID</th>
                                <th>Tên</th>
                                <th style={{ width: 140 }}>Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {current.map((c) => (
                                <tr key={c.id}>
                                    <td className="cat-td-mono">{c.id}</td>
                                    <td className="cat-td-strong">{c.name}</td>
                                    <td>
                                        <div className="cat-actions-cell">
                                            <Link href={`/admin/categories/${c.id}`} className="btn-ghost">Xem</Link>
                                            <Link href={`/admin/categories/${c.id}/edit`} className="btn-ghost">Sửa</Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="cat-pagination">
                        <button
                            className="btn-ghost"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={pageSafe === 1}
                        >
                            Trước
                        </button>
                        <span className="cat-page-indicator">
              Trang {pageSafe}/{totalPages}
            </span>
                        <button
                            className="btn-ghost"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={pageSafe === totalPages}
                        >
                            Sau
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
}
