"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Card from "@/components/admin/Card";
import "@/styles/admin/articles.css";
import "@/styles/admin/categories.css";

function TooltipText({ text }) {
    const [show, setShow] = useState(false);

    return (
        <div
            className="tooltip-wrapper"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            <span className="tooltip-short normal-text">{text}</span>


            {show && (
                <div className="tooltip-panel">
                    {text}
                </div>
            )}
        </div>
    );
}

export default function ArticlesList() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");

    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const allChecked = selected.length === articles.length && articles.length > 0;

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/articles", { cache: "no-store" });
                const data = await res.json();
                setArticles(Array.isArray(data) ? data : []);
            } catch {
                setArticles([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Search filter
    const filtered = useMemo(() => {
        const kw = q.trim().toLowerCase();
        return articles.filter(
            (a) =>
                a.title?.toLowerCase().includes(kw) ||
                a.slug?.toLowerCase().includes(kw)
        );
    }, [articles, q]);

    const totalPages = Math.ceil(filtered.length / pageSize);
    useEffect(() => setPage(1), [q]);

    const paged = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page]);

    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (allChecked) setSelected([]);
        else setSelected(paged.map((a) => a.id));
    };

    const bulkDelete = async () => {
        if (!confirm(`Xoá ${selected.length} bài?`)) return;

        for (const id of selected) {
            await fetch(`/api/articles/${id}`, { method: "DELETE" });
        }

        setArticles((prev) => prev.filter((a) => !selected.includes(a.id)));
        setSelected([]);
    };

    if (loading) return <p className="fade-in">Đang tải…</p>;

    return (
        <div className="art-container fade-in">
            {/* ================= HEADER ================= */}
            <div className="art-header-bar">
                <h1 className="art-title">Articles</h1>

                <div className="cat-actions">
                    <Link href="/admin" className="cv-btn-back">← Dashboard</Link>
                    <Link href="/admin/articles/create" className="cv-btn-edit">+ Thêm Mới</Link>
                </div>
            </div>

            {/* ================= BULK PANEL ================= */}
            {selected.length > 0 && (
                <div className="bulk-panel">
                    <strong>{selected.length} bài đã chọn</strong>
                    <button onClick={bulkDelete} className="bulk-delete-btn">
                        Xoá các mục đã chọn
                    </button>
                </div>
            )}

            {/* ================= SEARCH ================= */}
            <Card className="art-card search-card">
                <div className="art-tool-row">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="art-input"
                        placeholder="Tìm theo title hoặc slug…"
                    />

                    <span className="art-counter">
                        Tổng: <strong>{filtered.length}</strong>
                    </span>
                </div>
            </Card>

            {/* ================= TABLE ================= */}
            <Card className="art-card art-table-wrap">
                <table className="art-table">
                    <thead>
                    <tr>
                        <th className="art-col-check">
                            <input type="checkbox" checked={allChecked} onChange={toggleSelectAll} />
                        </th>

                        <th className="art-col-id">ID</th>
                        <th className="art-col-thumb">Ảnh</th>
                        <th className="art-col-title">Title</th>
                        <th className="art-col-slug">Slug</th>
                        <th className="art-col-status">Status</th>
                        <th className="art-col-url">URL</th>
                        <th className="art-col-category">Category</th>
                        <th className="art-col-created">Created</th>
                        <th className="art-col-action">Action</th>
                    </tr>
                    </thead>

                    <tbody>
                    {paged.map((a) => (
                        <tr key={a.id}>
                            <td className="art-col-check">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(a.id)}
                                    onChange={() => toggleSelect(a.id)}
                                />
                            </td>

                            <td>{a.id}</td>

                            <td>
                                {a.image_url ? (
                                    <img src={a.image_url} className="art-thumb" />
                                ) : "—"}
                            </td>

                            {/* TITLE */}
                            <td className="art-col-title td-left">
                                <TooltipText text={a.title} />
                            </td>

                            {/* SLUG */}
                            <td className="art-col-slug td-left">
                                <TooltipText text={a.slug} />
                            </td>

                            {/* STATUS */}
                            <td>
                                    <span className={`art-status ${a.status}`}>
                                        {a.status}
                                    </span>
                            </td>

                            {/* URL */}
                            <td className="art-col-url td-left">
                                <TooltipText text={a.url} />
                            </td>

                            <td>{a.category?.name || "—"}</td>


                            <td>{new Date(a.createdAt).toLocaleString("vi-VN")}</td>

                            <td className="art-col-action">
                                <div className="neo-action-row">
                                    <Link href={`/admin/articles/${a.id}`} className="neo-icon-btn view">
                                        <svg className="neo-icon" viewBox="0 0 24 24">
                                            <path d="M12 5c-5 0-9 5-9 7s4 7 9 7 9-5 9-7-4-7-9-7z" />
                                            <circle cx="12" cy="12" r="3.2" />
                                        </svg>
                                    </Link>

                                    <Link href={`/admin/articles/${a.id}/edit`} className="neo-icon-btn edit">
                                        <svg className="neo-icon" viewBox="0 0 24 24">
                                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                                        </svg>
                                    </Link>

                                    <button className="neo-icon-btn delete">
                                        <svg className="neo-icon" viewBox="0 0 24 24">
                                            <path d="M6 7h12M10 11v6M14 11v6M9 7l1-2h4l1 2M5 7h14l-1 13H6z" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Card>

            {/* ================= PAGINATION ================= */}
            <div className="art-pagination-bar">
                <button className="btn-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                    Trước
                </button>

                <span className="cat-page-indicator">
                    Trang {page}/{totalPages}
                </span>

                <button className="btn-primary" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                    Sau
                </button>
            </div>
        </div>
    );
}
