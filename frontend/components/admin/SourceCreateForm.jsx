"use client";

import { useEffect, useState } from "react";
import { previewLinks, previewArticle } from "@/services/sourceApi";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";

// Thay đổi tên component và props: Bỏ show, onClose, data. Thêm editingData
export default function SourceCreateForm({ editingData, onSubmit, categories }) {

    const router = useRouter();

    const [step, setStep] = useState(1);
    const [localCategories, setLocalCategories] = useState(categories || []);

    // State cho loading preview
    const [loadingPreviewLinks, setLoadingPreviewLinks] = useState(false);
    const [loadingPreviewArticle, setLoadingPreviewArticle] = useState(false);

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
        limit: 5,
    });

    const [links, setLinks] = useState([]);
    const [selectedUrl, setSelectedUrl] = useState("");
    const [articlePreview, setArticlePreview] = useState(null);

    // Cập nhật categories nếu prop thay đổi (thường chỉ chạy 1 lần)
    useEffect(() => {
        setLocalCategories(categories || []);
    }, [categories]);

    // Logic setup form cho chế độ Edit hoặc Add mới
    useEffect(() => {
        // Reset/Setup khi component load
        setStep(1);
        setLinks([]);
        setSelectedUrl("");
        setArticlePreview(null);

        if (editingData) {
            // Edit mode
            setForm((prev) => ({
                ...prev,
                ...editingData,
                categoryId: editingData.categoryId || "",
                status: editingData.status ?? 1,
                limit: editingData.limit ?? 5,
            }));
        } else {
            // Add mode: Reset form
            setForm({
                title: "", domain: "", path: "", linkSelector: "", titleSelector: "",
                descriptionSelector: "", contentSelector: "", imageSelector: "",
                removeSelector: "", categoryId: "", status: 1, limit: 5,
            });
        }
    }, [editingData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: name === 'limit' || name === 'status' ? Number(value) : value
        });
    };

    /** ========== Step 1: Preview Links ========== */
    const handlePreviewLinks = async () => {
        if (!form.domain || !form.path || !form.linkSelector) {
            toast.warn("Vui lòng nhập Domain, Path và Link Selector.");
            return;
        }

        setLoadingPreviewLinks(true);
        setLinks([]);
        setSelectedUrl("");
        setArticlePreview(null);

        try {
            const res = await previewLinks({
                domain: form.domain,
                path: form.path,
                linkSelector: form.linkSelector,
                limit: Number(form.limit),
            });

            const list = res || [];
            if (!list.length) {
                toast.error("Không tìm thấy link nào với selector này.");
                return;
            }

            setLinks(list);
            setSelectedUrl(list[0]);
            setStep(2);
            toast.success(`Tìm thấy ${list.length} link. Chuyển sang Bước 2.`);
        } catch (err) {
            console.error(err);
            toast.error("Preview links lỗi, kiểm tra lại selector / domain / path.");
        } finally {
            setLoadingPreviewLinks(false);
        }
    };

    /** ========== Step 2: Preview Article ========== */
    const handlePreviewArticle = async () => {
        if (!selectedUrl) {
            toast.warn("Vui lòng chọn 1 article link.");
            return;
        }
        if (!form.contentSelector) {
            toast.warn("Cần nhập Content Selector để crawl nội dung.");
            return;
        }

        setLoadingPreviewArticle(true);
        setArticlePreview(null);

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
            toast.success("Preview Article thành công.");
        } catch (err) {
            console.error(err);
            toast.error("Preview article lỗi, kiểm tra lại selectors.");
        } finally {
            setLoadingPreviewArticle(false);
        }
    };

    /** ========== Save Source ========== */
    const handleSave = (e) => {
        e.preventDefault();
        onSubmit(form); // Gọi hàm onSubmit từ component cha (Page)
    };

    // BỎ CẤU TRÚC MODAL BAO BỌC
    return (
        // Sử dụng container cho form, mx-auto để căn giữa nếu cần
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 mx-auto">
            <h2 className="text-xl font-bold mb-4 source-modal-title">
                {editingData ? "Edit Source" : "Add Source"}
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

            <form onSubmit={handleSave} className="space-y-4 source-form">
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
                                {localCategories.map((c) => (
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

                        {/* INPUT LIMIT */}
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

                        <div className="flex justify-between items-center pt-4">
                            <button
                                type="button"
                                className="px-4 py-2 rounded border source-btn-secondary"
                                onClick={() => router.back()} // Dùng router.back()
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 rounded bg-blue-600 text-white source-btn-primary"
                                onClick={handlePreviewLinks}
                                disabled={loadingPreviewLinks}
                            >
                                {loadingPreviewLinks ? "Đang tìm..." : "Preview Links"}
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
                            className="text-sm text-blue-600 underline hover:text-blue-800 mb-3"
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
                                required
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
                                    {key} {key === 'contentSelector' && '*'}
                                </label>
                                <input
                                    name={key}
                                    value={form[key] ?? ""}
                                    onChange={handleChange}
                                    className="border p-2 rounded w-full"
                                    placeholder={
                                        key === "contentSelector" ? "article.fck_detail" : ""
                                    }
                                    required={key === 'contentSelector'}
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
                        <div className="flex justify-between items-center pt-4">
                            <button
                                type="button"
                                className="px-4 py-2 rounded border source-btn-secondary"
                                onClick={() => router.back()} // Dùng router.back()
                            >
                                Cancel
                            </button>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded border border-blue-600 text-blue-600 source-btn-preview-article"
                                    onClick={handlePreviewArticle}
                                    disabled={loadingPreviewArticle || !selectedUrl}
                                >
                                    {loadingPreviewArticle ? "Đang tải..." : "Preview Article"}
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-green-600 text-white source-btn-save"
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
                                        __html: articlePreview.contentHtml?.slice(0, 1000) || "Không tìm thấy nội dung (kiểm tra Content Selector)",
                                    }}
                                />
                            </div>
                        )}
                    </>
                )}
            </form>
        </div>
    );
}