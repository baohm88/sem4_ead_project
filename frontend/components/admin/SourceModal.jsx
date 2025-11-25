"use client";

import { useEffect, useState } from "react";

import { fetchCategories } from "@/services/categoryApi";

import { previewLinks, previewArticle } from "@/services/sourceApi"; // path tuỳ bạn

export default function SourceModal({ show, data, onClose, onSubmit }) {
  console.log("modal data:", data);

  const [step, setStep] = useState(1);

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
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

    limit: 5, // [1] THÊM LIMIT VÀO STATE
  });

  const [links, setLinks] = useState([]);

  const [selectedUrl, setSelectedUrl] = useState("");

  const [articlePreview, setArticlePreview] = useState(null);

  /** ========== Load categories khi mở modal ========== */

  useEffect(() => {
    if (!show) return;

    fetchCategories().then((res) => {
      setCategories(res || []);
    });
  }, [show]);

  /** ========== Khi mở modal / edit ========== */

  useEffect(() => {
    if (!show) return;

    if (data) {
      // Edit mode

      setStep(1);

      setLinks([]);

      setSelectedUrl("");

      setArticlePreview(null);

      setForm((prev) => ({
        ...prev,

        ...data,

        categoryId: data.categoryId || "",

        limit: data.limit ?? 5, // [2] LẤY GIÁ TRỊ CŨ KHI EDIT
      }));
    } else {
      // Add mode

      setStep(1);

      setLinks([]);

      setSelectedUrl("");

      setArticlePreview(null);

      setForm({
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

        limit: 5, // [2] Đảm bảo limit có trong add mode
      });
    }
  }, [data, show]);

  /** ========== Close modal ========== */

  if (!show) return null;

  /** ========== Change input ========== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Đảm bảo limit được chuyển thành số

    setForm({
      ...form,

      [name]: name === "limit" ? Number(value) : value,
    });
  };

  /** ========== Step 1: Preview Links ========== */

  const handlePreviewLinks = async () => {
    if (!form.domain || !form.path || !form.linkSelector) {
      alert("Vui lòng nhập domain, path và linkSelector trước.");

      return;
    }

    try {
      const res = await previewLinks({
        domain: form.domain,

        path: form.path,

        linkSelector: form.linkSelector,

        limit: Number(form.limit), // [4] SỬ DỤNG form.limit
      });

      const list = res || [];

      if (!list.length) {
        alert("Không tìm thấy link nào với selector này.");

        return;
      }

      setLinks(list);

      setSelectedUrl(list[0]);

      setStep(2);
    } catch (err) {
      console.error(err);

      alert("Preview links lỗi, kiểm tra lại selector / domain / path.");
    }
  };

  /** ========== Step 2: Preview Article ========== */

  const handlePreviewArticle = async () => {
    if (!selectedUrl) {
      alert("Vui lòng chọn 1 article link.");

      return;
    }

    if (!form.contentSelector) {
      alert("Cần nhập contentSelector để crawl nội dung.");

      return;
    }

    try {
      const res = await previewArticle({
        url: selectedUrl,

        titleSelector: form.titleSelector,

        descriptionSelector: form.descriptionSelector,

        contentSelector: form.contentSelector,

        imageSelector: form.imageSelector,

        removeSelector: form.removeSelector,
      });

      setArticlePreview(res);
    } catch (err) {
      console.error(err);

      alert("Preview article lỗi, kiểm tra lại selectors.");
    }
  };

  /** ========== Save Source ========== */

  const handleSave = (e) => {
    e.preventDefault();

    onSubmit(form); // giữ nguyên payload cũ, form đã bao gồm limit
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-start justify-center p-4 overflow-auto z-50 transition-opacity duration-200 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-lg p-6 w-full md:w-11/12 max-w-6xl transform transition-all duration-200 ${
          show ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">
          {data ? "Edit Source" : "Add Source"}
        </h2>

        {/* Step indicator */}

        <div className="flex gap-4 mb-4">
          <div
            className={`flex-1 p-2 rounded ${
              step === 1 ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <div className="font-semibold">Bước 1</div>

            <div className="text-sm text-gray-600">
              Cấu hình domain, path, link selector
            </div>
          </div>

          <div
            className={`flex-1 p-2 rounded ${
              step === 2 ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <div className="font-semibold">Bước 2</div>

            <div className="text-sm text-gray-600">
              Cấu hình article selectors + preview
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* ====================== STEP 1 ====================== */}

          {step === 1 && (
            <>
              {/* Category */}

              <div>
                <label className="block font-semibold mb-1">Category</label>

                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                >
                  <option value="">-- Select Category --</option>

                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Domain */}

              <div>
                <label className="block font-semibold mb-1">Domain</label>

                <input
                  name="domain"
                  value={form.domain}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="https://vnexpress.net"
                />
              </div>

              {/* Path */}

              <div>
                <label className="block font-semibold mb-1">Path</label>

                <input
                  name="path"
                  value={form.path}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="the-thao"
                />
              </div>

              {/* Link selector */}

              <div>
                <label className="block font-semibold mb-1">
                  Link Selector
                </label>

                <input
                  name="linkSelector"
                  value={form.linkSelector}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="article a"
                />
              </div>

              {/* ⭐ [3] INPUT LIMIT ĐÃ THÊM ⭐ */}

              <div>
                <label className="block font-semibold mb-1">
                  Preview Limit (số lượng link)
                </label>

                <input
                  type="number"
                  name="limit"
                  value={form.limit}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="5"
                  min="1"
                />
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded border"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                  onClick={handlePreviewLinks}
                >
                  Preview Links
                </button>
              </div>
            </>
          )}

          {/* ====================== STEP 2 ====================== */}

          {step === 2 && (
            <>
              {/* Back to step 1 */}

              <button
                type="button"
                className="text-sm text-blue-600 underline"
                onClick={() => setStep(1)}
              >
                ← Quay lại bước 1
              </button>

              {/* List URLs */}

              <div>
                <label className="block font-semibold mb-1">
                  Preview Links (click để chọn article test)
                </label>

                <div className="border rounded max-h-40 overflow-auto text-sm">
                  {links.map((link) => (
                    <div
                      key={link}
                      onClick={() => setSelectedUrl(link)}
                      className={`px-2 py-1 cursor-pointer break-all hover:bg-gray-100 ${
                        selectedUrl === link
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : ""
                      }`}
                    >
                      {link}
                    </div>
                  ))}
                </div>
              </div>

              {/* Title */}

              <div>
                <label className="block font-semibold mb-1">
                  Source Title (hiển thị trong admin)
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="VnExpress - Thể thao"
                />
              </div>

              {/* Article selectors */}

              {[
                "titleSelector",

                "descriptionSelector",

                "contentSelector",

                "imageSelector",

                "removeSelector",
              ].map((key) => (
                <div key={key}>
                  <label className="block font-semibold mb-1 capitalize">
                    {key}
                  </label>

                  <input
                    name={key}
                    value={form[key] ?? ""}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    placeholder={
                      key === "contentSelector" ? "article.fck_detail" : ""
                    }
                  />
                </div>
              ))}

              {/* Status */}

              <div>
                <label className="block font-semibold mb-1">Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value={1}>Active</option>

                  <option value={0}>Inactive</option>
                </select>
              </div>

              {/* Buttons + Preview article */}

              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded border"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 rounded border border-blue-600 text-blue-600"
                    onClick={handlePreviewArticle}
                  >
                    Preview Article
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-green-600 text-white"
                  >
                    Save Source
                  </button>
                </div>
              </div>

              {/* Article Preview */}

              {articlePreview && (
                <div className="mt-4 border rounded p-3 bg-gray-50">
                  <div className="font-semibold mb-1">
                    {articlePreview.title || "(no title)"}
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    {articlePreview.description}
                  </div>

                  {articlePreview.imageUrl && (
                    <img
                      src={articlePreview.imageUrl}
                      alt=""
                      className="max-w-sm mb-2 rounded"
                    />
                  )}

                  <div
                    className="prose max-w-none text-sm"
                    dangerouslySetInnerHTML={{
                      __html: articlePreview.contentHtml?.slice(0, 1000) || "",
                    }}
                  />
                </div>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
}
