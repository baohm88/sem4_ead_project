"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchCategories } from "@/services/categoryApi";
import {
  getSourceById,
  createSource,
  updateSource,
  previewLinks,
  previewArticle,
} from "@/services/sourceApi";
import { toast } from "react-toastify";

const initialForm = {
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
  limit: 5,
};

export default function SourceFormPage({ editData }) {
  const router = useRouter();
  const isEdit = !!editData;
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [links, setLinks] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [articlePreview, setArticlePreview] = useState(null);

  const [linkLoading, setLinkLoading] = useState(false);
  const [articleLoading, setArticleLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [linkStatus, setLinkStatus] = useState(""); // UX extra
  const [articleStatus, setArticleStatus] = useState("");

  /** ===== Load categories + source (nếu edit) ===== */
  useEffect(() => {
    const loadInit = async () => {
      try {
        const cats = await fetchCategories();
        setCategories(cats || []);

        if (editData) {
          setForm({
            ...initialForm,
            ...editData,
            categoryId: editData.categoryId ?? "",
            limit: 5,
          });
        }
      } catch (e) {
        console.error(e);
        toast.error("Load data lỗi");
      }
    };

    loadInit();
  }, [editData]);

  /** ===== Change input ===== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "limit" ? Number(value) : value,
    }));
  };

  /** ===== Preview Links ===== */
  const handlePreviewLinks = useCallback(async () => {
    if (!form.domain || !form.path || !form.linkSelector) {
      toast.error("Vui lòng nhập domain, path và linkSelector trước.");
      return;
    }

    setLinkLoading(true);
    setLinkStatus("Đang crawl links...");

    try {
      const res = await previewLinks({
        domain: form.domain,
        path: form.path,
        linkSelector: form.linkSelector,
        limit: Number(form.limit) || 5,
      });

      const list = res.data || res; // tuỳ backend (nếu trả raw list, res.data undefined)

      const finalList = Array.isArray(list) ? list : [];
      if (!finalList.length) {
        setLinks([]);
        setSelectedUrl("");
        setLinkStatus("Không tìm thấy link nào.");
        toast.error("Không tìm thấy link nào với selector này.");
        return;
      }

      setLinks(finalList);
      setSelectedUrl(finalList[0]);
      setLinkStatus(`Tìm thấy ${finalList.length} link.`);
    } catch (err) {
      console.error(err);
      setLinkStatus("Preview links lỗi.");
      toast.error("Preview links lỗi, kiểm tra lại selector / domain / path.");
    } finally {
      setLinkLoading(false);
    }
  }, [form]);

  /** ===== Preview Article ===== */
  const handlePreviewArticle = useCallback(async () => {
    if (!selectedUrl) {
      toast.error("Vui lòng chọn 1 article link.");
      return;
    }
    if (!form.contentSelector) {
      toast.error("Cần nhập contentSelector để crawl nội dung.");
      return;
    }

    setArticleLoading(true);
    setArticleStatus("Đang crawl nội dung...");

    try {
      const res = await previewArticle({
        url: selectedUrl,
        titleSelector: form.titleSelector,
        descriptionSelector: form.descriptionSelector,
        contentSelector: form.contentSelector,
        imageSelector: form.imageSelector,
        removeSelector: form.removeSelector,
      });

      const preview = res.data || res;
      setArticlePreview(preview);
      setArticleStatus("Crawl preview thành công.");
    } catch (err) {
      console.error(err);
      setArticleStatus("Preview article lỗi.");
      toast.error("Preview article lỗi, kiểm tra lại selectors.");
    } finally {
      setArticleLoading(false);
    }
  }, [selectedUrl, form]);

  /** ===== Save Source (Create / Update) ===== */
  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.categoryId) {
      toast.error("Vui lòng chọn Category.");
      return;
    }
    if (!form.domain || !form.path || !form.linkSelector) {
      if (
        !confirm(
          "Domain / path / linkSelector chưa đầy đủ. Bạn có chắc muốn lưu?"
        )
      ) {
        return;
      }
    }

    setSaving(true);
    try {
      if (isEdit) {
        await updateSource(id, form);
      } else {
        await createSource(form);
      }

      toast.success("Lưu source thành công");
      router.push("/admin/sources");
    } catch (err) {
      console.error(err);
      toast.error("Lưu source lỗi: ", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/sources");
  };

  /** ====== UI ====== */
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <div>
          <div className="text-sm text-gray-500">
            Admin / Sources / {isEdit ? "Edit" : "Create"}
          </div>
          <h1 className="text-2xl font-bold">
            {isEdit ? "Edit Source" : "Create Source"}
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Source"}
          </button>
        </div>
      </header>

      {/* Main 2-panel layout */}
      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden">
        {/* LEFT PANEL – Step 1 + Links list */}
        <section className="lg:w-1/2 flex flex-col bg-white rounded-lg shadow-sm border p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-semibold text-lg">Step 1 – Link Config</h2>
              <p className="text-xs text-gray-500">
                Cấu hình Category, Domain, Path, Link selector → Preview links
              </p>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">
              Links
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-3 overflow-auto pr-1">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="border p-2 rounded w-full text-sm"
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
              <label className="block text-sm font-medium mb-1">Domain</label>
              <input
                name="domain"
                value={form.domain}
                onChange={handleChange}
                className="border p-2 rounded w-full text-sm"
                placeholder="https://vnexpress.net"
              />
            </div>

            {/* Path */}
            <div>
              <label className="block text-sm font-medium mb-1">Path</label>
              <input
                name="path"
                value={form.path}
                onChange={handleChange}
                className="border p-2 rounded w-full text-sm"
                placeholder="the-thao"
              />
            </div>

            {/* Link selector + limit */}
            <div className="grid grid-cols-3 gap-2 items-end">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Link Selector
                </label>
                <input
                  name="linkSelector"
                  value={form.linkSelector}
                  onChange={handleChange}
                  className="border p-2 rounded w-full text-sm"
                  placeholder="article a"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Limit</label>
                <input
                  type="number"
                  name="limit"
                  value={form.limit}
                  onChange={handleChange}
                  className="border p-2 rounded w-full text-sm"
                  min="1"
                />
              </div>
            </div>

            {/* Preview button + status */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handlePreviewLinks}
                disabled={linkLoading}
                className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {linkLoading ? "Loading..." : "Preview Links"}
              </button>
              <span className="text-xs text-gray-500">{linkStatus}</span>
            </div>

            {/* Links list */}
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium mb-1">
                Links (click để chọn article test)
              </label>
              <div className="border rounded flex-1 overflow-auto text-xs">
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
                {!links.length && (
                  <div className="px-2 py-3 text-gray-400 text-xs">
                    Chưa có link, bấm &quot;Preview Links&quot; để load.
                  </div>
                )}
              </div>
              {selectedUrl && (
                <div className="mt-1 text-[11px] text-gray-500 truncate">
                  Selected: {selectedUrl}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT PANEL – selectors + article preview */}
        <section className="lg:w-1/2 flex flex-col bg-white rounded-lg shadow-sm border p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-semibold text-lg">Step 2 – Article Config</h2>
              <p className="text-xs text-gray-500">
                Nhập selectors cho bài viết và preview nội dung.
              </p>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700">
              Article Preview
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-3 overflow-auto pr-1">
            {/* Source title */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Source Title (hiển thị trong admin)
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="border p-2 rounded w-full text-sm"
                placeholder="VnExpress - Thể thao"
              />
            </div>

            {/* Selectors */}
            {[
              "titleSelector",
              "descriptionSelector",
              "contentSelector",
              "imageSelector",
              "removeSelector",
            ].map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1">{key}</label>
                <input
                  name={key}
                  value={form[key] ?? ""}
                  onChange={handleChange}
                  className="border p-2 rounded w-full text-sm"
                  placeholder={
                    key === "contentSelector" ? "article.fck_detail" : ""
                  }
                />
              </div>
            ))}

            {/* Status */}
            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="border p-2 rounded w-full text-sm"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>

              <div className="flex flex-col items-end gap-1">
                <button
                  type="button"
                  onClick={handlePreviewArticle}
                  disabled={articleLoading || !selectedUrl}
                  className="px-4 py-2 rounded border border-blue-600 text-blue-600 text-sm hover:bg-blue-50 disabled:opacity-60"
                >
                  {articleLoading ? "Loading preview..." : "Preview Article"}
                </button>
                <span className="text-xs text-gray-500">{articleStatus}</span>
              </div>
            </div>

            {/* Article preview box */}
            <div className="flex-1 border rounded p-3 bg-gray-50 overflow-auto text-sm">
              {!articlePreview && (
                <div className="text-gray-400 text-xs">
                  Chưa có preview. Chọn 1 link bên trái và bấm &quot;Preview
                  Article&quot;.
                </div>
              )}

              {articlePreview && (
                <>
                  <div className="font-semibold mb-1">
                    {articlePreview.title || "(no title)"}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
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
                    className="prose max-w-none text-xs"
                    dangerouslySetInnerHTML={{
                      __html: articlePreview.contentHtml?.slice(0, 1500) || "",
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
