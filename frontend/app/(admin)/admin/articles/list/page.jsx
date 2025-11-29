"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import Card from "@/components/admin/Card";
import {getAllArticles, deleteArticle} from "@/services/articleApi";
import {fetchCategories} from "@/services/categoryApi";
// import "@/styles/admin/articles.css";
import "@/styles/admin/article-list.css";

/* ============================================================
   Tooltip nhỏ
============================================================ */
function TooltipText({text}) {
    const [show, setShow] = useState(false);

    return (
        <div
            className="tooltip-wrapper relative"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            <span className="tooltip-short normal-text text-sm">{text}</span>

            {show && (
                <div
                    className="tooltip-panel absolute z-30 top-full left-0 mt-1 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow">
                    {text}
                </div>
            )}
        </div>
    );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */
export default function ArticlesList() {
    const [articles, setArticles] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);

    const [categoryId, setCategoryId] = useState("");
    const [status, setStatus] = useState("");
    const [categories, setCategories] = useState([]);

    const [q, setQ] = useState("");
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const [selected, setSelected] = useState([]);

    /* ============================================================
       LOAD DATA (CALL API thật) – ADMIN API
    ============================================================ */
    // const loadArticles = async () => {
    //     try {
    //         setLoading(true);
    //
    //         const res = await getAllArticles(page, pageSize, q, categoryId, status);
    //
    //         // backend trả: { success, message, data }
    //         setArticles(res.data.content || []);
    //         setMeta(res.data);
    //
    //     } catch (err) {
    //         console.error("❌ Load articles error:", err);
    //         setArticles([]);
    //         setMeta({});
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const loadArticles = async () => {
        try {
            setLoading(true);
            const res = await getAllArticles(page, pageSize, q, "createdAt", "DESC", categoryId, status);
            // res = { success, message, data }
            setArticles(res.data?.content || []);
            setMeta(res.data || {});
        } catch (err) {
            console.error(err);
            setArticles([]);
            setMeta({});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArticles();
    }, [page, q, categoryId, status]);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetchCategories();
                setCategories(res.data || []);
            } catch (e) {
                console.error("Load category fail", e);
            }
        })();
    }, []);


    /* ============================================================
        SELECT / BULK DELETE
    ============================================================ */
    const allChecked = selected.length === articles.length && articles.length > 0;

    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (allChecked) setSelected([]);
        else setSelected(articles.map((a) => a.id));
    };

    const bulkDelete = async () => {
        if (!confirm(`Xoá ${selected.length} bài?`)) return;

        for (const id of selected) {
            await deleteArticle(id);
        }
        setSelected([]);
        loadArticles();
    };

    /* ============================================================
        LOADING UI
    ============================================================ */
    if (loading)
        return <p className="p-4 text-gray-300 fade-in text-sm">Đang tải…</p>;


    /* ============================================================
        RENDER
    ============================================================ */
    return (
        <div className="art-container fade-in p-4 md:p-6">

            {/* ================= HEADER ================= */}
            <div className="art-header-bar flex justify-between items-center mb-4 pb-2 border-b">
                <h1 className="text-2xl font-bold text-gray-800">Articles</h1>

                <div className="flex gap-2">
                    <Link
                        href="/admin"
                        className="bg-gray-100 border px-3 py-1 rounded hover:bg-gray-200 text-sm"
                    >
                        ← Dashboard
                    </Link>

                    <Link
                        href="/admin/articles/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
                    >
                        + Thêm Mới
                    </Link>
                </div>
            </div>

            {/* ================= BULK PANEL ================= */}
            {selected.length > 0 && (
                <div className="bg-red-30 border border-red-200 p-3 rounded mb-4 flex justify-between items-center">
                    <strong>{selected.length} bài đã chọn</strong>

                    <button
                        onClick={bulkDelete}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    >
                        Xoá các mục đã chọn
                    </button>
                </div>
            )}

            {/* ================= SEARCH ================= */}
          {/*  <Card className="mb-4">*/}
          {/*      <div className="flex justify-between items-center">*/}
          {/*          <input*/}
          {/*              value={q}*/}
          {/*              onChange={(e) => setQ(e.target.value)}*/}
          {/*              className="border p-2 rounded w-72 text-sm"*/}
          {/*              placeholder="Tìm theo title hoặc slug…"*/}
          {/*          />*/}

          {/*          <span className="text-sm text-gray-600">*/}
          {/*  Tổng: <strong>{meta.totalElements || 0}</strong>*/}
          {/*</span>*/}
          {/*      </div>*/}
          {/*  </Card>*/}

            <Card className="mb-4">
                <div className="flex flex-wrap gap-3 items-center">

                    {/* Search */}
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="border p-2 rounded w-72 text-sm"
                        placeholder="Tìm theo title hoặc slug…"
                    />

                    {/* Category Filter */}
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="border p-2 rounded text-sm"
                    >
                        <option value="">-- All Categories --</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border p-2 rounded text-sm"
                    >
                        <option value="">-- All Status --</option>
                        <option value="NEW">NEW</option>
                        <option value="CRAWLING">CRAWLING</option>
                        <option value="CRAWLED">CRAWLED</option>
                        <option value="ERROR">ERROR</option>
                    </select>

                    {/* Tổng */}
                    <span className="text-sm text-gray-600 ml-auto">
            Tổng: <strong>{meta.totalElements || 0}</strong>
        </span>

                </div>
            </Card>

            {/* ================= TABLE ================= */}
            <Card className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="p-2 w-8">
                            <input
                                type="checkbox"
                                checked={allChecked}
                                onChange={toggleSelectAll}
                            />
                        </th>

                        <th className="p-2">ID</th>
                        <th className="p-2">Ảnh</th>
                        <th className="p-2">Title</th>
                        <th className="p-2">Slug</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">URL</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Created</th>
                        <th className="p-2">Action</th>
                    </tr>
                    </thead>

                    <tbody>
                    {articles.map((a) => (
                        <tr key={a.id} className="border-b hover:bg-gray-30">
                            <td className="text-center p-2">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(a.id)}
                                    onChange={() => toggleSelect(a.id)}
                                />
                            </td>

                            <td className="text-center p-2">{a.id}</td>

                            <td className="p-2 text-center">
                                {a.imageUrl ? (
                                    <img
                                        src={a.imageUrl}
                                        className="w-12 h-8 object-cover rounded"
                                    />
                                ) : (
                                    "—"
                                )}
                            </td>

                            <td className="p-2 max-w-xs">
                                <TooltipText text={a.title?.length > 30 ? a.title.slice(0, 30) + "…" : a.title}/>
                            </td>

                            <td className="p-2 max-w-xs">
                                <TooltipText text={a.slug?.length > 30 ? a.slug.slice(0, 30) + "…" : a.slug}/>
                            </td>

                            <td className="p-2">
                  <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${a.status}`}
                  >
                    {a.status}
                  </span>
                            </td>

                            <td className="p-2 max-w-xs">
                                <TooltipText text={a.url?.length > 30 ? a.url.slice(0, 30) + "…" : a.url}/>
                            </td>

                            <td className="p-2">{a.articleCategory?.name || "—"}</td>

                            <td className="p-2 text-xs text-gray-300">
                                {new Date(a.createdAt).toLocaleString("vi-VN")}
                            </td>

                            <td className="p-2 text-center">
                                <div className="flex gap-2 justify-center">
                                    {/*<Link*/}
                                    {/*    href={`/admin/articles/${a.id}`}*/}
                                    {/*    className="text-blue-600"*/}
                                    {/*>*/}
                                    {/*    👁*/}
                                    {/*</Link>*/}

                                    {/* VIEW BUTTON – disabled nếu chưa CRAWLED */}
                                    {a.status === "CRAWLED" ? (
                                        <Link
                                            href={`/admin/articles/${a.id}`}
                                            className="neo-icon-btn view text-blue-600"
                                        >
                                            👁
                                        </Link>
                                    ) : (
                                        <span
                                            className="neo-icon-btn text-gray-400 opacity-40 cursor-default pointer-events-none"
                                            title="Bài chưa crawl xong — không thể xem"
                                        >
    👁
  </span>
                                    )}
                                    <Link
                                        href={`/admin/articles/${a.id}/edit`}
                                        className="text-amber-600"
                                    >
                                        ✏️
                                    </Link>
                                    <button
                                        className="text-red-600"
                                        onClick={() =>
                                            deleteArticle(a.id).then(() => loadArticles())
                                        }
                                    >
                                        🗑
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Card>

            {/* ================= PAGINATION ================= */}
            <div className="flex justify-center gap-3 mt-4 items-center text-sm">
                <button
                    disabled={page <= 0}
                    onClick={() => setPage(page - 1)}
                    className="border px-3 py-1 rounded disabled:opacity-30"
                >
                    Trước
                </button>

                <span>
          Trang <strong>{page + 1}</strong> / {meta.totalPages || 1}
        </span>

                <button
                    disabled={page >= (meta.totalPages || 1) - 1}
                    onClick={() => setPage(page + 1)}
                    className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-30"
                >
                    Sau
                </button>
            </div>
        </div>
    );
}