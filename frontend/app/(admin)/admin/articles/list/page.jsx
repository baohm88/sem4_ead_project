"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Card from "@/components/admin/Card";
import { getAllArticles, deleteArticle } from "@/services/articleApi";
import "@/styles/admin/articles.css"; // dùng chung style cũ
import "@/styles/admin/article-list.css";

function TooltipText({ text }) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="tooltip-wrapper relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="tooltip-short normal-text text-sm">{text}</span>
      {show && (
        <div className="tooltip-panel z-50 absolute top-full left-0 mt-1 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow">
          {text}
        </div>
      )}
    </div>
  );
}

export default function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [selected, setSelected] = useState([]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const res = await getAllArticles(page, pageSize, q);
      setArticles(res?.content || []);
      setMeta(res);
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
  }, [page, q]);

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
    for (const id of selected) await deleteArticle(id);
    setSelected([]);
    loadArticles();
  };

  if (loading) return <p className="fade-in text-gray-500 text-sm">Đang tải…</p>;

  return (
    <div className="art-container fade-in p-4 md:p-6">
      {/* HEADER */}
      <div className="art-header-bar flex justify-between items-center mb-4 pb-2 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Articles</h1>

        <div className="cat-actions flex gap-2">
          <Link
            href="/admin"
            className="cv-btn-back bg-gray-100 border px-3 py-1 rounded hover:bg-gray-200 text-sm"
          >
            ← Dashboard
          </Link>

          <Link
            href="/admin/articles/create"
            className="cv-btn-edit bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
          >
            + Thêm Mới
          </Link>
        </div>
      </div>

      {/* BULK PANEL */}
      {selected.length > 0 && (
        <div className="bulk-panel bg-red-50 border border-red-200 p-3 rounded mb-4 flex justify-between items-center">
          <strong>{selected.length} bài đã chọn</strong>
          <button
            onClick={bulkDelete}
            className="bulk-delete-btn bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
          >
            Xoá các mục đã chọn
          </button>
        </div>
      )}

      {/* SEARCH CARD */}
      <Card className="art-card search-card mb-4">
        <div className="art-tool-row flex justify-between items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="art-input border p-2 rounded w-72 text-sm"
            placeholder="Tìm theo title hoặc slug…"
          />
          <span className="art-counter text-sm text-gray-600">
            Tổng: <strong>{meta.totalElements || 0}</strong>
          </span>
        </div>
      </Card>

      {/* TABLE */}
      <Card className="art-card art-table-wrap overflow-x-auto">
        <table className="art-table w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 text-center w-8">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-2 w-12">ID</th>
              <th className="p-2 w-16">Ảnh</th>
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
              <tr key={a.id} className="hover:bg-gray-50 border-b">
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(a.id)}
                    onChange={() => toggleSelect(a.id)}
                  />
                </td>

                <td className="text-center">{a.id}</td>

                <td className="text-center">
                  {a.imageUrl ? (
                    <img src={a.imageUrl} className="art-thumb w-12 h-8 object-cover rounded" />
                  ) : (
                    "—"
                  )}
                </td>

                <td className="td-left max-w-xs">
                  <TooltipText text={a.title} />
                </td>

                <td className="td-left max-w-xs">
                  <TooltipText text={a.slug} />
                </td>

                <td>
                  <span
                    className={`art-status ${a.status} px-2 py-1 rounded text-xs font-semibold`}
                  >
                    {a.status}
                  </span>
                </td>

                <td className="td-left max-w-xs">
                  <TooltipText text={a.url} />
                </td>

                <td>{a.articleCategory?.name || "—"}</td>

                <td className="text-xs text-gray-500">
                  {new Date(a.createdAt).toLocaleString("vi-VN")}
                </td>

                <td className="text-center">
                  <div className="neo-action-row flex gap-2 justify-center">
                    <Link
                      href={`/admin/articles/${a.id}`}
                      className="neo-icon-btn view text-blue-600"
                    >
                      👁
                    </Link>
                    <Link
                      href={`/admin/articles/${a.id}/edit`}
                      className="neo-icon-btn edit text-amber-600"
                    >
                      ✏️
                    </Link>
                    <button
                      className="neo-icon-btn delete text-red-600"
                      onClick={() => deleteArticle(a.id).then(loadArticles)}
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

      {/* PAGINATION */}
      <div className="art-pagination-bar flex justify-center gap-3 mt-4 items-center text-sm">
        <button
          className="btn-ghost px-3 py-1 border rounded disabled:opacity-50"
          disabled={page <= 0}
          onClick={() => setPage(page - 1)}
        >
          Trước
        </button>

        <span className="cat-page-indicator">
          Trang <strong>{page + 1}</strong> / {meta.totalPages || 1}
        </span>

        <button
          className="btn-primary px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={page >= meta.totalPages - 1}
          onClick={() => setPage(page + 1)}
        >
          Sau
        </button>
      </div>
    </div>
  );
}