"use client";

import { useEffect, useState } from "react";

const emptyForm = {
  id: null,
  title: "",
  domain: "",
  path: "",
  linkSelector: "",
  titleSelector: "",
  descriptionSelector: "",
  contentSelector: "",
  imageSelector: "",
  removeSelector: "",
  categoryId: "",
  status: 1,
};

export default function SourceForm({ editing, onSaved, categories }) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        id: editing.id,
        title: editing.title || "",
        domain: editing.domain || "",
        path: editing.path || "",
        linkSelector: editing.linkSelector || "",
        titleSelector: editing.titleSelector || "",
        descriptionSelector: editing.descriptionSelector || "",
        contentSelector: editing.contentSelector || "",
        imageSelector: editing.imageSelector || "",
        removeSelector: editing.removeSelector || "",
        categoryId: editing.articleCategory?.id || "",
        status: editing.status ?? 1,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "status" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      domain: form.domain,
      path: form.path,
      linkSelector: form.linkSelector,
      titleSelector: form.titleSelector,
      descriptionSelector: form.descriptionSelector,
      contentSelector: form.contentSelector,
      imageSelector: form.imageSelector,
      removeSelector: form.removeSelector,
      articleCategory: form.categoryId
        ? { id: Number(form.categoryId) }
        : null,
      status: form.status,
    };

    try {
      const baseUrl = "http://localhost:8080/api/v1/sources";

      const res = await fetch(
        form.id ? `${baseUrl}/${form.id}` : baseUrl,
        {
          method: form.id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert("Lỗi: " + (data.message || "Không thể lưu Source"));
      } else {
        alert(data.message || "Lưu Source thành công");
        onSaved(); // reload list
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối đến backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-3">
        {form.id ? "✏️ Sửa Source" : "➕ Thêm Source mới"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <div>
          <label className="block font-medium mb-1">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            placeholder="VD: VnExpress - Thể thao"
            required
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block font-medium mb-1">Domain *</label>
            <input
              name="domain"
              value={form.domain}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              placeholder="https://vnexpress.net"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">Path *</label>
            <input
              name="path"
              value={form.path}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              placeholder="/the-thao"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">
            Category (articleCategory)
          </label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">-- Chọn category --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} (ID: {c.id})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-medium mb-1">linkSelector *</label>
            <input
              name="linkSelector"
              value={form.linkSelector}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              placeholder="VD: h3.title-news a"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">titleSelector *</label>
            <input
              name="titleSelector"
              value={form.titleSelector}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              placeholder="VD: h1.title-detail"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-medium mb-1">
              descriptionSelector
            </label>
            <input
              name="descriptionSelector"
              value={form.descriptionSelector}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              placeholder="VD: p.description"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">contentSelector *</label>
            <input
              name="contentSelector"
              value={form.contentSelector}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              placeholder="VD: article.fck_detail"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-medium mb-1">imageSelector</label>
            <input
              name="imageSelector"
              value={form.imageSelector}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              placeholder='VD: "meta[itemprop=url]" hoặc "img[itemprop=contentUrl]"'
            />
          </div>
          <div>
            <label className="block font-medium mb-1">removeSelector</label>
            <input
              name="removeSelector"
              value={form.removeSelector}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              placeholder="VD: .ads, .banner, .social-share"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value={1}>Active (1)</option>
            <option value={0}>Inactive (0)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : form.id ? "Update Source" : "Create Source"}
        </button>
      </form>
    </div>
  );
}
