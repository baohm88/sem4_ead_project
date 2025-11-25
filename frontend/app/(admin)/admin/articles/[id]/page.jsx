"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// 👉 CSS
import "@/styles/admin/article_news.css";
import "@/styles/admin/category-view.css";

/* ============================================================
   🔥 DUMMY ARTICLES — NHÚNG TRỰC TIẾP
============================================================ */
const DUMMY_ARTICLES = [
    {
        id: 1,
        title: "Apple ra mắt iPhone 16 với nhiều công nghệ vượt trội",
        summary: "iPhone 16 chính thức trình làng với chip A18, camera nâng cấp và thời lượng pin tốt hơn.",
        category_name: "Công nghệ",
        source_name: "VnExpress",
        author: "Minh Đức",
        published_at: "25/11/2025 • 08:30",
        image:
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro_1.png",
        content_html: `
            <p>Apple vừa chính thức giới thiệu dòng <strong>iPhone 16</strong> tại sự kiện thường niên.</p>
            <p>Chip <strong>A18</strong> mang lại hiệu năng CPU tăng 20%, GPU tăng 30%.</p>
            <h2>Camera nâng cấp mạnh</h2>
            <p>Camera 48 MP cải thiện khả năng chụp đêm và quay 8K.</p>
            <h2>Pin lâu hơn – sạc nhanh hơn</h2>
            <p>Thời lượng pin tăng trung bình 2 giờ.</p>
        `,
    },
    {
        id: 2,
        title: "Cổ phiếu Tesla tăng mạnh sau khi ra mắt mẫu xe điện mới",
        summary: "Giá cổ phiếu Tesla tăng 12% sau sự kiện công bố xe điện Model Z.",
        category_name: "Kinh tế",
        source_name: "CafeF",
        author: "Hữu Thắng",
        published_at: "24/11/2025 • 14:20",
        image:
            "https://i1-vnexpress.vnecdn.net/2024/01/10/tesla.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=893fa2ba233c6f89c24e8de7d2d6b3e5",
        content_html: `
            <p>Tesla ra mắt <strong>Model Z</strong> với khả năng sạc nhanh 300 km chỉ trong 10 phút.</p>
            <p>Cổ phiếu tăng 12% ngay sau sự kiện.</p>
            <h2>Mẫu xe mới có gì đặc biệt?</h2>
            <ul>
                <li>Quãng đường 780 km</li>
                <li>Sạc nhanh 300 km/10 phút</li>
                <li>Giá từ 39.000 USD</li>
            </ul>
        `,
    },
];

/* ============================================================
   🔥 VIEW ARTICLE PAGE
============================================================ */
export default function ArticleView() {
    const { id } = useParams();
    const router = useRouter();

    const [article, setArticle] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);

    useEffect(() => {
        if (!id) return;
        const found = DUMMY_ARTICLES.find(a => a.id === Number(id));
        setArticle(found || null);
    }, [id]);

    if (!article) return <p className="p-6">Không tìm thấy bài viết…</p>;

    return (
        <div className="art-view-container fade-in">

            {/* =====================================================
                🔝 HEADER GLASS EFFECT
            ===================================================== */}
            <div className="cv-header">
                {/* BACK */}
                <button
                    className="cv-btn-back"
                    onClick={() => router.push("/admin/articles/list")}
                >
                    <svg viewBox="0 0 24 24" className="view-icon">
                        <path d="M15 18l-6-6 6-6" strokeWidth="2" stroke="currentColor" fill="none" />
                    </svg>
                    Quay lại
                </button>

                {/* ACTIONS */}
                <div className="cv-actions-right">
                    <button
                        className="cv-btn-edit"
                        onClick={() => router.push(`/admin/articles/${id}/edit`)}
                    >
                        <svg viewBox="0 0 24 24" className="view-icon">
                            <path
                                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                            />
                        </svg>
                        Sửa
                    </button>

                    <button
                        className="cv-btn-delete"
                        onClick={() => setShowDeletePopup(true)}
                    >
                        <svg viewBox="0 0 24 24" className="view-icon">
                            <path
                                d="M6 7h12M10 11v6M14 11v6M9 7l1-2h4l1 2M5 7h14l-1 13H6L5 7z"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                            />
                        </svg>
                        Xoá
                    </button>
                </div>
            </div>

            {/* =====================================================
                ARTICLE BODY
            ===================================================== */}
            <article className="news-container">

                <h1 className="news-title">{article.title}</h1>

                {article.summary && (
                    <p className="news-summary">{article.summary}</p>
                )}

                <div className="news-meta">
                    <span>📌 {article.category_name}</span>
                    <span>📰 {article.source_name}</span>
                    <span>✍ {article.author}</span>
                    <span>⏱ {article.published_at}</span>
                </div>

                {article.image && (
                    <div className="news-image-wrap">
                        <img
                            src={article.image}
                            alt={article.title}
                            className="news-image"
                        />
                    </div>
                )}

                <div
                    className="news-content prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.content_html }}
                />
            </article>

            {/* =====================================================
                DELETE POPUP
            ===================================================== */}
            {showDeletePopup && (
                <div className="neo-popup-overlay">
                    <div className="neo-popup">
                        <div className="neo-popup-icon">
                            <svg viewBox="0 0 24 24">
                                <path
                                    d="M12 9v4m0 4h.01M12 2l9 18H3L12 2z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                />
                            </svg>
                        </div>

                        <h3>Xoá bài viết?</h3>

                        <p>
                            Bạn chắc chắn muốn xoá bài viết <br />
                            <strong>{article.title}</strong> ?
                        </p>

                        <div className="neo-popup-actions">
                            <button
                                className="neo-cancel"
                                onClick={() => setShowDeletePopup(false)}
                            >
                                Huỷ
                            </button>

                            <button
                                className="neo-delete"
                                onClick={() => router.push("/admin/articles/list")}
                            >
                                Xoá luôn
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
