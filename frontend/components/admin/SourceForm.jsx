// "use client";
//
// import { useEffect, useState } from "react";
// import { previewLinks, previewArticle } from "@/services/sourceApi";
// import { fetchCategories } from "@/services/categoryApi";
// import { toast } from "react-toastify";
//
// import "@/styles/admin/source-form.css"; // 👈 Gắn CSS vừa tạo
//
// export default function SourceForm({ editing, onSaved }) {
//     const [step, setStep] = useState(1);
//
//     const [categories, setCategories] = useState([]);
//     const [links, setLinks] = useState([]);
//     const [selectedUrl, setSelectedUrl] = useState("");
//     const [articlePreview, setArticlePreview] = useState(null);
//
//     const empty = {
//         title: "",
//         domain: "",
//         path: "",
//         linkSelector: "",
//         titleSelector: "",
//         descriptionSelector: "",
//         contentSelector: "",
//         imageSelector: "",
//         removeSelector: "",
//         categoryId: "",
//         status: 1,
//         limit: 5,
//     };
//
//     const [form, setForm] = useState(empty);
//
//     /* LOAD CATEGORY */
//     useEffect(() => {
//         fetchCategories().then((res) => setCategories(res || []));
//     }, []);
//
//     /* IF EDIT → FILL DATA */
//     useEffect(() => {
//         if (!editing) return setForm(empty);
//
//         setForm({
//             ...empty,
//             ...editing,
//             categoryId: editing.articleCategory?.id || editing.categoryId || "",
//             limit: editing.limit ?? 5,
//         });
//     }, [editing]);
//
//     /* INPUT HANDLE */
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//
//         setForm((prev) => ({
//             ...prev,
//             [name]: ["limit", "status"].includes(name) ? Number(value) : value,
//         }));
//     };
//
//     /* STEP 1 → PREVIEW LINKS */
//     const handlePreviewLinks = async () => {
//         try {
//             const res = await previewLinks({
//                 domain: form.domain,
//                 path: form.path,
//                 linkSelector: form.linkSelector,
//                 limit: form.limit,
//             });
//
//             if (!res?.length) {
//                 toast.warn("Không tìm thấy link nào!");
//                 return;
//             }
//
//             setLinks(res);
//             setSelectedUrl(res[0]);
//             setStep(2);
//             toast.success("Lấy danh sách links thành công!");
//         } catch (err) {
//             console.error(err);
//             toast.error("Preview links thất bại!");
//         }
//     };
//
//     /* STEP 2 → PREVIEW ARTICLE */
//     const handlePreviewArticle = async () => {
//         try {
//             const res = await previewArticle({
//                 url: selectedUrl,
//                 titleSelector: form.titleSelector,
//                 descriptionSelector: form.descriptionSelector,
//                 contentSelector: form.contentSelector,
//                 imageSelector: form.imageSelector,
//                 removeSelector: form.removeSelector,
//             });
//
//             setArticlePreview(res);
//             toast.success("Preview bài viết thành công!");
//         } catch (err) {
//             console.error(err);
//             toast.error("Preview article thất bại!");
//         }
//     };
//
//     /* SAVE */
//     const handleSave = (e) => {
//         e.preventDefault();
//         onSaved(form);
//     };
//
//     /* Selector Fields */
//     const selectorFields = [
//         "titleSelector",
//         "descriptionSelector",
//         "contentSelector",
//         "imageSelector",
//         "removeSelector",
//     ];
//
//     return (
//         <div className="source-wrap">
//             {/* TITLE */}
//             <h1 className="source-title">
//                 {editing ? "✏️ Edit Source" : "➕ Add New Source"}
//             </h1>
//
//             {/* STEPS */}
//             <div className="source-steps">
//                 <div className={`source-step ${step === 1 ? "active" : ""}`}>
//                     <strong>Bước 1</strong>
//                     <div className="text-sm text-gray-600">
//                         Cấu hình domain & link selectors
//                     </div>
//                 </div>
//
//                 <div className={`source-step ${step === 2 ? "active" : ""}`}>
//                     <strong>Bước 2</strong>
//                     <div className="text-sm text-gray-600">
//                         Preview nội dung bài viết
//                     </div>
//                 </div>
//             </div>
//
//             {/* CARD */}
//             <div className="source-card">
//                 <form onSubmit={handleSave} className="source-form">
//                     {/* ================= STEP 1 ================= */}
//                     {step === 1 && (
//                         <>
//                             <FormField label="Category">
//                                 <select
//                                     name="categoryId"
//                                     value={form.categoryId}
//                                     onChange={handleChange}
//                                     className="source-input"
//                                 >
//                                     <option value="">-- Select Category --</option>
//                                     {categories.map((c) => (
//                                         <option key={c.id} value={c.id}>
//                                             {c.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </FormField>
//
//                             <FormField label="Domain">
//                                 <input
//                                     name="domain"
//                                     value={form.domain}
//                                     onChange={handleChange}
//                                     className="source-input"
//                                     placeholder="https://vnexpress.net"
//                                 />
//                             </FormField>
//
//                             <FormField label="Path">
//                                 <input
//                                     name="path"
//                                     value={form.path}
//                                     onChange={handleChange}
//                                     className="source-input"
//                                     placeholder="/the-thao"
//                                 />
//                             </FormField>
//
//                             <FormField label="Link Selector">
//                                 <input
//                                     name="linkSelector"
//                                     value={form.linkSelector}
//                                     onChange={handleChange}
//                                     className="source-input"
//                                     placeholder="article a"
//                                 />
//                             </FormField>
//
//                             <FormField label="Preview Limit">
//                                 <input
//                                     type="number"
//                                     name="limit"
//                                     min="1"
//                                     value={form.limit}
//                                     onChange={handleChange}
//                                     className="source-input"
//                                 />
//                             </FormField>
//
//                             <div className="source-btn-row">
//                                 <button
//                                     type="button"
//                                     onClick={handlePreviewLinks}
//                                     className="source-btn-preview"
//                                 >
//                                     Preview Links →
//                                 </button>
//                             </div>
//                         </>
//                     )}
//
//                     {/* ================= STEP 2 ================= */}
//                     {step === 2 && (
//                         <>
//                             <button
//                                 type="button"
//                                 className="source-btn-back"
//                                 onClick={() => setStep(1)}
//                             >
//                                 ← Quay lại Bước 1
//                             </button>
//
//                             {/* LINK LIST */}
//                             <FormField label="Preview Links">
//                                 <div className="source-links-box">
//                                     {links.map((link) => (
//                                         <div
//                                             key={link}
//                                             onClick={() => setSelectedUrl(link)}
//                                             className={`source-link-item ${
//                                                 selectedUrl === link ? "active" : ""
//                                             }`}
//                                         >
//                                             {link}
//                                         </div>
//                                     ))}
//                                 </div>
//                             </FormField>
//
//                             <FormField label="Source Title (hiển thị trong admin)">
//                                 <input
//                                     name="title"
//                                     value={form.title}
//                                     onChange={handleChange}
//                                     className="source-input"
//                                     placeholder="VD: VnExpress - Thể thao"
//                                 />
//                             </FormField>
//
//                             {/* Selector fields */}
//                             {selectorFields.map((key) => (
//                                 <FormField label={key} key={key}>
//                                     <input
//                                         name={key}
//                                         value={form[key] || ""}
//                                         onChange={handleChange}
//                                         className="source-input"
//                                     />
//                                 </FormField>
//                             ))}
//
//                             {/* ACTION BUTTONS */}
//                             <div className="source-btn-row">
//                                 <button
//                                     type="button"
//                                     onClick={handlePreviewArticle}
//                                     className="source-btn-preview"
//                                 >
//                                     Preview Article
//                                 </button>
//
//                                 <button type="submit" className="source-btn-save">
//                                     Save Source
//                                 </button>
//                             </div>
//
//                             {/* ARTICLE PREVIEW */}
//                             {articlePreview && (
//                                 <div className="source-article-preview">
//                                     <h3>{articlePreview.title}</h3>
//                                     <p>{articlePreview.description}</p>
//
//                                     {articlePreview.imageUrl && (
//                                         <img
//                                             src={articlePreview.imageUrl}
//                                             className="source-preview-img"
//                                         />
//                                     )}
//
//                                     <div
//                                         className="prose text-sm max-w-none"
//                                         dangerouslySetInnerHTML={{
//                                             __html: articlePreview.contentHtml?.slice(0, 2000),
//                                         }}
//                                     />
//                                 </div>
//                             )}
//                         </>
//                     )}
//                 </form>
//             </div>
//         </div>
//     );
// }
//
// /* FIELD WRAPPER */
// function FormField({ label, children }) {
//     return (
//         <div className="source-field">
//             <label>{label}</label>
//             {children}
//         </div>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import { previewLinks, previewArticle } from "@/services/sourceApi";
import { fetchCategories } from "@/services/categoryApi";
import { toast } from "react-toastify";
import "@/styles/admin/source-form.css";

export default function SourceForm({ editing, onSaved }) {
    const [step, setStep] = useState(1);

    const [categories, setCategories] = useState([]);
    const [links, setLinks] = useState([]);
    const [selectedUrl, setSelectedUrl] = useState("");
    const [articlePreview, setArticlePreview] = useState(null);

    const emptyForm = {
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

    const [form, setForm] = useState(emptyForm);

    /** LOAD CATEGORIES */
    useEffect(() => {
        fetchCategories().then((res) => setCategories(res || []));
    }, []);

    /** IF EDIT */
    useEffect(() => {
        if (editing) {
            setForm({
                ...emptyForm,
                ...editing,
                categoryId: editing.articleCategory?.id || editing.categoryId || "",
            });
        } else setForm(emptyForm);
    }, [editing]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: name === "limit" || name === "status" ? Number(value) : value,
        }));
    };

    /** STEP 1 → Preview Links */
    const handlePreviewLinks = async () => {
        try {
            const res = await previewLinks({
                domain: form.domain,
                path: form.path,
                linkSelector: form.linkSelector,
                limit: form.limit,
            });

            setLinks(res || []);
            setSelectedUrl((res || [])[0]);
            setStep(2);
        } catch (err) {
            toast.error("Preview links failed!");
        }
    };

    /** STEP 2 → Preview Article */
    const handlePreviewArticle = async () => {
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
            toast.error("Preview article failed!");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSaved(form);
    };

    return (
        <div className="sf-wrap">
            {/* HEADER */}
            <div className="sf-header">
                <h1 className="sf-title">
                    {editing ? "Chỉnh sửa Source" : "Thêm Source mới"}
                </h1>
            </div>

            {/* CARD */}
            <form onSubmit={handleSubmit} className="sf-card sf-form">

                {/* ===== STEP PROGRESS ===== */}
                <div className="sf-steps">
                    <div className={`sf-step ${step === 1 ? "active" : ""}`}>
                        <span>1</span> Cấu hình Selector
                    </div>
                    <div className={`sf-step ${step === 2 ? "active" : ""}`}>
                        <span>2</span> Preview bài viết
                    </div>
                </div>

                {/* ============= STEP 1 ============= */}
                {step === 1 && (
                    <>
                        <div className="sf-field">
                            <label>Category</label>
                            <select
                                name="categoryId"
                                value={form.categoryId}
                                onChange={handleChange}
                                className="sf-input"
                            >
                                <option value="">-- Chọn Category --</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} (ID: {c.id})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="sf-field">
                            <label>Domain</label>
                            <input
                                name="domain"
                                value={form.domain}
                                onChange={handleChange}
                                className="sf-input"
                                placeholder="https://vnexpress.net"
                            />
                        </div>

                        <div className="sf-field">
                            <label>Path</label>
                            <input
                                name="path"
                                value={form.path}
                                onChange={handleChange}
                                className="sf-input"
                                placeholder="/the-thao"
                            />
                        </div>

                        <div className="sf-field">
                            <label>Link Selector</label>
                            <input
                                name="linkSelector"
                                value={form.linkSelector}
                                onChange={handleChange}
                                className="sf-input"
                                placeholder="article a"
                            />
                        </div>

                        <div className="sf-field">
                            <label>Limit Preview</label>
                            <input
                                type="number"
                                min="1"
                                name="limit"
                                value={form.limit}
                                onChange={handleChange}
                                className="sf-input"
                            />
                        </div>

                        <button
                            type="button"
                            className="sf-btn-primary"
                            onClick={handlePreviewLinks}
                        >
                            Preview Links →
                        </button>
                    </>
                )}

                {/* ============= STEP 2 ============= */}
                {step === 2 && (
                    <>
                        <button
                            type="button"
                            className="sf-btn-back"
                            onClick={() => setStep(1)}
                        >
                            ← Quay lại Step 1
                        </button>

                        {/* PREVIEW LINKS */}
                        <div className="sf-field">
                            <label>Preview Links</label>
                            <div className="sf-link-list">
                                {links.map((link) => (
                                    <div
                                        key={link}
                                        className={`sf-link-item ${
                                            link === selectedUrl ? "active" : ""
                                        }`}
                                        onClick={() => setSelectedUrl(link)}
                                    >
                                        {link}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* TITLE */}
                        <div className="sf-field">
                            <label>Source Title</label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="sf-input"
                                placeholder="VD: VnExpress - Thể thao"
                            />
                        </div>

                        {/* SELECTORS */}
                        {[
                            "titleSelector",
                            "descriptionSelector",
                            "contentSelector",
                            "imageSelector",
                            "removeSelector",
                        ].map((key) => (
                            <div className="sf-field" key={key}>
                                <label>{key}</label>
                                <input
                                    name={key}
                                    value={form[key] || ""}
                                    onChange={handleChange}
                                    className="sf-input"
                                />
                            </div>
                        ))}

                        <button
                            type="button"
                            className="sf-btn-outline"
                            onClick={handlePreviewArticle}
                        >
                            Preview Article
                        </button>

                        <button className="sf-btn-primary">Save Source</button>

                        {/* ARTICLE PREVIEW */}
                        {articlePreview && (
                            <div className="sf-article-preview">
                                <h3>{articlePreview.title}</h3>
                                <p>{articlePreview.description}</p>

                                {articlePreview.imageUrl && (
                                    <img
                                        src={articlePreview.imageUrl}
                                        className="sf-article-img"
                                    />
                                )}

                                <div
                                    className="sf-article-content"
                                    dangerouslySetInnerHTML={{
                                        __html: articlePreview.contentHtml?.slice(
                                            0,
                                            1200
                                        ),
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
