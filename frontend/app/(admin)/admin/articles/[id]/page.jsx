// "use client";
//
// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
//
// // 👉 CSS
// import "@/styles/admin/article_news.css";
// import "@/styles/admin/category-view.css";
//
// /* ============================================================
//    🔥 DUMMY ARTICLES — NHÚNG TRỰC TIẾP
// ============================================================ */
// const DUMMY_ARTICLES = [
//     {
//         id: 1,
//         title: "Apple ra mắt iPhone 16 với nhiều công nghệ vượt trội",
//         summary: "iPhone 16 chính thức trình làng với chip A18, camera nâng cấp và thời lượng pin tốt hơn.",
//         category_name: "Công nghệ",
//         source_name: "VnExpress",
//         author: "Minh Đức",
//         published_at: "25/11/2025 • 08:30",
//         image:
//             "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro_1.png",
//         content_html: `
//             <p>Apple vừa chính thức giới thiệu dòng <strong>iPhone 16</strong> tại sự kiện thường niên.</p>
//             <p>Chip <strong>A18</strong> mang lại hiệu năng CPU tăng 20%, GPU tăng 30%.</p>
//             <h2>Camera nâng cấp mạnh</h2>
//             <p>Camera 48 MP cải thiện khả năng chụp đêm và quay 8K.</p>
//             <h2>Pin lâu hơn – sạc nhanh hơn</h2>
//             <p>Thời lượng pin tăng trung bình 2 giờ.</p>
//         `,
//     },
//     {
//         id: 2,
//         title: "Cổ phiếu Tesla tăng mạnh sau khi ra mắt mẫu xe điện mới",
//         summary: "Giá cổ phiếu Tesla tăng 12% sau sự kiện công bố xe điện Model Z.",
//         category_name: "Kinh tế",
//         source_name: "CafeF",
//         author: "Hữu Thắng",
//         published_at: "24/11/2025 • 14:20",
//         image:
//             "https://i1-vnexpress.vnecdn.net/2024/01/10/tesla.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=893fa2ba233c6f89c24e8de7d2d6b3e5",
//         content_html: `
//             <p>Tesla ra mắt <strong>Model Z</strong> với khả năng sạc nhanh 300 km chỉ trong 10 phút.</p>
//             <p>Cổ phiếu tăng 12% ngay sau sự kiện.</p>
//             <h2>Mẫu xe mới có gì đặc biệt?</h2>
//             <ul>
//                 <li>Quãng đường 780 km</li>
//                 <li>Sạc nhanh 300 km/10 phút</li>
//                 <li>Giá từ 39.000 USD</li>
//             </ul>
//         `,
//     },
// ];
//
// /* ============================================================
//    🔥 VIEW ARTICLE PAGE
// ============================================================ */
// export default function ArticleView() {
//     const { id } = useParams();
//     const router = useRouter();
//
//     const [article, setArticle] = useState(null);
//     const [showDeletePopup, setShowDeletePopup] = useState(false);
//
//     useEffect(() => {
//         if (!id) return;
//         const found = DUMMY_ARTICLES.find(a => a.id === Number(id));
//         setArticle(found || null);
//     }, [id]);
//
//     if (!article) return <p className="p-6">Không tìm thấy bài viết…</p>;
//
//     return (
//         <div className="art-view-container fade-in">
//
//             {/* =====================================================
//                 🔝 HEADER GLASS EFFECT
//             ===================================================== */}
//             <div className="cv-header">
//                 {/* BACK */}
//                 <button
//                     className="cv-btn-back"
//                     onClick={() => router.push("/admin/articles/list")}
//                 >
//                     <svg viewBox="0 0 24 24" className="view-icon">
//                         <path d="M15 18l-6-6 6-6" strokeWidth="2" stroke="currentColor" fill="none" />
//                     </svg>
//                     Quay lại
//                 </button>
//
//                 {/* ACTIONS */}
//                 <div className="cv-actions-right">
//                     <button
//                         className="cv-btn-edit"
//                         onClick={() => router.push(`/admin/articles/${id}/edit`)}
//                     >
//                         <svg viewBox="0 0 24 24" className="view-icon">
//                             <path
//                                 d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 fill="none"
//                             />
//                         </svg>
//                         Sửa
//                     </button>
//
//                     <button
//                         className="cv-btn-delete"
//                         onClick={() => setShowDeletePopup(true)}
//                     >
//                         <svg viewBox="0 0 24 24" className="view-icon">
//                             <path
//                                 d="M6 7h12M10 11v6M14 11v6M9 7l1-2h4l1 2M5 7h14l-1 13H6L5 7z"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 fill="none"
//                             />
//                         </svg>
//                         Xoá
//                     </button>
//                 </div>
//             </div>
//
//             {/* =====================================================
//                 ARTICLE BODY
//             ===================================================== */}
//             <article className="news-container">
//
//                 <h1 className="news-title">{article.title}</h1>
//
//                 {article.summary && (
//                     <p className="news-summary">{article.summary}</p>
//                 )}
//
//                 <div className="news-meta">
//                     <span>📌 {article.category_name}</span>
//                     <span>📰 {article.source_name}</span>
//                     <span>✍ {article.author}</span>
//                     <span>⏱ {article.published_at}</span>
//                 </div>
//
//                 {article.image && (
//                     <div className="news-image-wrap">
//                         <img
//                             src={article.image}
//                             alt={article.title}
//                             className="news-image"
//                         />
//                     </div>
//                 )}
//
//                 <div
//                     className="news-content prose max-w-none"
//                     dangerouslySetInnerHTML={{ __html: article.content_html }}
//                 />
//             </article>
//
//             {/* =====================================================
//                 DELETE POPUP
//             ===================================================== */}
//             {showDeletePopup && (
//                 <div className="neo-popup-overlay">
//                     <div className="neo-popup">
//                         <div className="neo-popup-icon">
//                             <svg viewBox="0 0 24 24">
//                                 <path
//                                     d="M12 9v4m0 4h.01M12 2l9 18H3L12 2z"
//                                     stroke="currentColor"
//                                     strokeWidth="2"
//                                     fill="none"
//                                 />
//                             </svg>
//                         </div>
//
//                         <h3>Xoá bài viết?</h3>
//
//                         <p>
//                             Bạn chắc chắn muốn xoá bài viết <br />
//                             <strong>{article.title}</strong> ?
//                         </p>
//
//                         <div className="neo-popup-actions">
//                             <button
//                                 className="neo-cancel"
//                                 onClick={() => setShowDeletePopup(false)}
//                             >
//                                 Huỷ
//                             </button>
//
//                             <button
//                                 className="neo-delete"
//                                 onClick={() => router.push("/admin/articles/list")}
//                             >
//                                 Xoá luôn
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//
//         </div>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { api } from "@/services/api";
import "@/styles/admin/article-detail.css";

export default function ArticleDetailPage({ params }) {

    const { id } = use(params);
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    // ========================= LOAD ARTICLE ===========================
    const loadArticle = async () => {
        try {
            const res = await api.get(`/articles/${id}`);
            console.log("article", res);
            // axios interceptor -> res = { success, message, data }
            setArticle(res.data);
        } catch (err) {
            console.error("❌ Failed to load article:", err);
            setArticle(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArticle();
    }, [id]);

    // ========================= UI RENDER ==============================
    if (loading)
        return <p className="p-6 text-gray-500 text-sm">Đang tải bài viết…</p>;

    if (!article)
        return (
            <div className="p-6">
                <p className="text-red-500">Không tìm thấy bài viết.</p>
                <Link
                    href="/admin/articles/list"
                    className="underline text-blue-600 text-sm"
                >
                    ← Quay lại danh sách
                </Link>
            </div>
        );

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3">
                <h1 className="text-2xl font-bold text-gray-800">
                    Chi tiết bài viết #{article.id}
                </h1>

                <div className="flex gap-2">
                    <Link
                        href="/admin/articles/list"
                        className="px-3 py-1 bg-gray-100 border rounded hover:bg-gray-200 text-sm"
                    >
                        ← Quay lại
                    </Link>

                    <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                        ✏️ Chỉnh sửa
                    </Link>
                </div>
            </div>

            {/* INFO PANEL */}
            <div className="bg-white shadow rounded-lg p-4 space-y-3">
                <div className="text-sm">
                    <strong>Status:</strong>{" "}
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${article.status}`}>
            {article.status}
          </span>
                </div>

                <div className="text-sm">
                    <strong>Category:</strong>{" "}
                    {article.articleCategory?.name || "—"}
                </div>

                <div className="text-sm">
                    <strong>URL:</strong>{" "}
                    <a
                        href={article.url}
                        target="_blank"
                        className="text-blue-600 underline break-all"
                    >
                        {article.url}
                    </a>
                </div>

                <div className="text-sm text-gray-500">
                    <strong>Created:</strong>{" "}
                    {new Date(article.createdAt).toLocaleString("vi-VN")}
                </div>
            </div>

            {/* TITLE */}
            <h2 className="text-3xl font-bold">{article.title}</h2>

            {/* IMAGE */}
            {article.imageUrl && (
                <img
                    src={article.imageUrl}
                    alt="thumbnail"
                    className="w-full max-h-[420px] object-cover rounded"
                />
            )}

            {/* DESCRIPTION */}
            <p className="text-lg text-gray-600 leading-relaxed">
                {article.description}
            </p>

            {/* CONTENT HTML RENDER */}
            <div
                className="prose prose-lg max-w-full leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
            />
        </div>
    );
}