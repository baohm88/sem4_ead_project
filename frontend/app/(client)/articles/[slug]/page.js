"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "@/styles/client/article.css";

// Dummy data
const dummy_articles = [
    {
        id: 1,
        title: "Apple ra mắt iPhone 16",
        slug: "apple-ra-mat-iphone-16",
        summary:
            "Apple vừa công bố iPhone 16 với chip A18, camera nâng cấp mạnh và thời lượng pin dài hơn, đánh dấu bước chuyển mình của thế hệ iPhone mới.",
        category_name: "Công nghệ",
        source_name: "VnExpress",
        published_at: "25/11/2025 08:30",
        author: "Minh Đức",
        image:
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-cam_3.jpg",
        caption: "Ảnh: VnExpress",
        content_html: `
    <p>Tại sự kiện thường niên diễn ra rạng sáng 25/11 (giờ Việt Nam), Apple đã chính thức trình làng <strong>iPhone 16</strong> – dòng sản phẩm được kỳ vọng tạo nên bước đột phá về hiệu năng và nhiếp ảnh di động. Sự kiện thu hút hàng triệu lượt xem trực tuyến, cho thấy sức nóng của thế hệ iPhone mới.</p>

    <p>Điểm nhấn lớn nhất trên iPhone 16 là chip <strong>A18</strong>, được sản xuất trên tiến trình 3 nm thế hệ mới. Theo Apple, hiệu năng CPU tăng khoảng 20% và GPU mạnh hơn 30% so với phiên bản tiền nhiệm. Việc tối ưu điện năng giúp thiết bị vận hành mượt mà hơn, đặc biệt khi chơi game đồ họa cao hoặc quay video độ phân giải lớn.</p>

    <h2>Camera cải tiến mạnh</h2>

    <p>Bộ đôi camera sau trên iPhone 16 tiếp tục được nâng cấp với cảm biến 48 MP thế hệ mới. Apple cho biết thuật toán xử lý hình ảnh Photonic Engine đã được cải thiện, giúp khả năng chụp đêm sáng và chi tiết hơn.</p>

    <p>Điểm đáng chú ý là khả năng quay video <strong>8K 30fps</strong>, lần đầu xuất hiện trên dòng iPhone. Các chuyên gia nhận định Apple đang muốn tiến sâu vào thị trường quay phim bán chuyên, cạnh tranh trực tiếp với dòng flagship Android.</p>

    <blockquote>
        “Camera trên iPhone 16 cho thấy sự đầu tư nghiêm túc của Apple vào mảng nhiếp ảnh di động. Đây có thể xem là nâng cấp đáng giá nhất trong nhiều năm,” – chuyên gia công nghệ Daniel Ives nhận định.
    </blockquote>

    <h2>Thiết kế không thay đổi nhiều nhưng tối ưu trải nghiệm</h2>

    <p>Ngoại hình của iPhone 16 không có nhiều khác biệt so với thế hệ iPhone 15. Tuy nhiên, Apple cho biết họ đã tinh chỉnh chất liệu khung viền, giúp máy bền hơn và chống trầy xước tốt hơn. Màn hình vẫn sử dụng tấm nền OLED nhưng độ sáng tối đa tăng nhẹ, hỗ trợ hiển thị ngoài trời tốt hơn.</p>

    <p>Nút hành động Action Button được mở rộng, hỗ trợ gán nhiều chức năng hơn như mở nhanh camera, ghi chú, dịch thuật hay kích hoạt Siri.</p>

    <h2>Pin lâu hơn – sạc nhanh hơn</h2>

    <p>Một trong những thay đổi được người dùng quan tâm là dung lượng pin tăng khoảng 8–12% tùy phiên bản. Apple cho biết iPhone 16 có thể kéo dài thêm trung bình 2 giờ sử dụng so với iPhone 15.</p>

    <p>Công nghệ sạc nhanh cũng được nâng cấp, hỗ trợ sạc 50% chỉ trong 20 phút với bộ sạc 35W mới.</p>

    <h2>Giá bán và thời điểm lên kệ</h2>

    <p>Theo công bố, iPhone 16 sẽ mở bán tại hơn 30 thị trường vào ngày <strong>5/12</strong>. Tại Mỹ, giá khởi điểm từ <strong>799 USD</strong> cho phiên bản tiêu chuẩn. Các nhà bán lẻ tại Việt Nam dự kiến mở chương trình đặt trước từ đầu tháng 12.</p>

    <p>Giới phân tích nhận định với những nâng cấp lớn về hiệu năng và camera, iPhone 16 có thể trở thành dòng máy bán chạy nhất của Apple trong năm 2025.</p>

    <p><em>Theo dõi VnExpress để cập nhật giá bán và đánh giá chi tiết iPhone 16 trong thời gian tới.</em></p>
`,

    },
];

export default function ArticleDetailPage() {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        if (!slug) return;
        const found = dummy_articles.find(a => a.slug === slug);
        setArticle(found || null);
    }, [slug]);

    if (!article)
        return <p className="p-10 text-red-500 text-center text-xl">Không tìm thấy bài viết</p>;

    return (
        <div className="article-container">

            {/* LEFT COLUMN */}
            <div>
                <h1 className="article-title">{article.title}</h1>

                <div className="article-meta">
                    <span>{article.source_name}</span>
                    <span>{article.published_at}</span>
                    <span>{article.author}</span>
                </div>

                <p className="article-summary">{article.summary}</p>

                <img src={article.image} className="article-image" />
                <p className="article-caption">{article.caption}</p>

                <div
                    className="article-content"
                    dangerouslySetInnerHTML={{ __html: article.content_html }}
                />

                {/* RELATED */}
                <div className="related-box">
                    <h2 className="related-title">Tin liên quan</h2>
                    <ul className="related-list">
                        {dummy_articles.map(a => (
                            <li key={a.id}>
                                <a href={`/articles/${a.slug}`}>{a.title}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* COMMENTS */}
                <div className="comment-box">
                    <h3 className="comment-title">Bình luận</h3>

                    <textarea className="comment-textarea" rows={4} placeholder="Nhập bình luận..." />
                    <button className="comment-btn">Gửi bình luận</button>
                </div>
            </div>

            {/* RIGHT SIDEBAR */}
            {/* ===================== RIGHT SIDEBAR ===================== */}
            <div className="space-y-10">

                {/* 🔥 XEM NHIỀU NHẤT */}
                <div className="sidebar-box">
                    <h3 className="sidebar-title">📈 Xem nhiều</h3>
                    <ul className="sidebar-list">
                        <li><a href="#">1. Việt Nam có iPhone 16 giá bao nhiêu?</a></li>
                        <li><a href="#">2. Tesla Model Z bị cháy pin tại Mỹ</a></li>
                        <li><a href="#">3. Messsi xác nhận gia hạn hợp đồng</a></li>
                        <li><a href="#">4. Giá vàng biến động mạnh đầu tháng 3</a></li>
                        <li><a href="#">5. Hà Nội đề xuất mở thêm 3 tuyến metro</a></li>
                    </ul>
                </div>

                {/* 💬 GÓC NHÌN */}
                <div className="sidebar-box">
                    <h3 className="sidebar-title">💬 Góc nhìn</h3>
                    <ul className="sidebar-list">
                        <li><a href="#">Tại sao công nghệ AI sẽ thay đổi thị trường lao động?</a></li>
                        <li><a href="#">Xe điện có phải lựa chọn hợp lý năm 2025?</a></li>
                        <li><a href="#">Văn hóa đọc trong thời đại TikTok</a></li>
                    </ul>
                </div>

                {/* 🎙 PODCAST */}
                <div className="sidebar-box">
                    <h3 className="sidebar-title">🎙 Podcast</h3>
                    <img
                        src="https://i1-vnexpress.vnecdn.net/2024/01/11/podcast.jpg?w=800"
                        style={{ width: "100%", borderRadius: 6 }}
                    />
                    <p className="mt-2 font-medium">Tương lai xe điện tại Việt Nam</p>
                </div>

                {/* 🎥 VIDEO NỔI BẬT */}
                <div className="sidebar-box">
                    <h3 className="sidebar-title">🎥 Video nổi bật</h3>
                    <img
                        src="https://i1-vnexpress.vnecdn.net/2024/01/17/video-tech.jpg?w=800"
                        style={{ width: "100%", borderRadius: 6 }}
                    />
                    <p className="mt-2 font-medium">Trên tay iPhone 16 – màu mới, chip mới</p>
                </div>

                {/* 🏷 CHỦ ĐỀ HOT */}
                <div className="sidebar-box">
                    <h3 className="sidebar-title">🔥 Chủ đề hot</h3>
                    <div className="flex flex-wrap gap-2">
                        <a className="tag-item" href="#">iPhone 16</a>
                        <a className="tag-item" href="#">Tesla</a>
                        <a className="tag-item" href="#">Kinh tế 2025</a>
                        <a className="tag-item" href="#">BĐS</a>
                        <a className="tag-item" href="#">Chứng khoán</a>
                        <a className="tag-item" href="#">AI</a>
                    </div>
                </div>

                {/* 📚 BOX TIN THEO CHUYÊN MỤC */}
                <div className="sidebar-box">
                    <h3 className="sidebar-title">📰 Công nghệ</h3>
                    <ul className="sidebar-list">
                        <li><a href="#">Samsung chuẩn bị ra mắt Galaxy S26</a></li>
                        <li><a href="#">OpenAI giới thiệu GPT-6</a></li>
                        <li><a href="#">Google Pixel 10 rò rỉ cấu hình</a></li>
                    </ul>
                </div>

                <div className="sidebar-box">
                    <h3 className="sidebar-title">📉 Kinh doanh</h3>
                    <ul className="sidebar-list">
                        <li><a href="#">Lãi suất ngân hàng tiếp tục giảm</a></li>
                        <li><a href="#">Startup Việt gọi vốn 15 triệu USD</a></li>
                        <li><a href="#">Doanh số xe điện tăng 40%</a></li>
                    </ul>
                </div>

            </div>

        </div>
    );
}
