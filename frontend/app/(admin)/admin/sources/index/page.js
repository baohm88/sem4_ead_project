"use client";

import { useEffect, useState } from "react";
import SourceForm from "../SourceForm";

export default function SourcesPage() {
  const [sources, setSources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [editingSource, setEditingSource] = useState(null);

  const backendBase = "http://localhost:8080/api/v1";

  const loadData = async () => {
    setLoadingList(true);
    try {
      const [srcRes, catRes] = await Promise.all([
        fetch(`${backendBase}/sources`),
        fetch(`${backendBase}/categories`),
      ]);

      const srcJson = await srcRes.json();
      const catJson = await catRes.json();

      setSources(srcJson.data || srcJson || []);
      setCategories(catJson.data || catJson || []);
    } catch (err) {
      console.error(err);
      alert("Lỗi load sources/categories");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Xoá Source này?")) return;

    try:
      const res = await fetch(`${backendBase}/sources/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        alert("Lỗi: " + (data.message || "Không xoá được Source"));
      } else {
        alert(data.message || "Xoá Source thành công");
        loadData();
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối backend khi xoá");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">📰 Quản lý Sources</h1>

      <div className="grid md:grid-cols-[2fr,1fr] gap-4">
        {/* LIST */}
        <div className="bg-white border rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Danh sách Sources</h2>
            <button
              onClick={() => setEditingSource(null)}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              ➕ Add new
            </button>
          </div>

          {loadingList ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">ID</th>
                    <th className="border px-2 py-1">Title</th>
                    <th className="border px-2 py-1">Domain</th>
                    <th className="border px-2 py-1">Path</th>
                    <th className="border px-2 py-1">Category</th>
                    <th className="border px-2 py-1">Status</th>
                    <th className="border px-2 py-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sources.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">{s.id}</td>
                      <td className="border px-2 py-1 max-w-[200px] truncate">
                        {s.title}
                      </td>
                      <td className="border px-2 py-1">
                        <span className="text-xs text-gray-600">
                          {s.domain}
                        </span>
                      </td>
                      <td className="border px-2 py-1">{s.path}</td>
                      <td className="border px-2 py-1">
                        {s.articleCategory
                          ? `${s.articleCategory.name} (#${s.articleCategory.id})`
                          : "-"}
                      </td>
                      <td className="border px-2 py-1">
                        {s.status === 1 ? (
                          <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-700">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="border px-2 py-1 space-x-2">
                        <button
                          onClick={() => setEditingSource(s)}
                          className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="px-2 py-0.5 text-xs bg-red-600 text-white rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {sources.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center text-gray-500 py-4"
                      >
                        Chưa có Source nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* FORM */}
        <SourceForm
          editing={editingSource}
          onSaved={loadData}
          categories={categories}
        />
      </div>
    </div>
  );
}
