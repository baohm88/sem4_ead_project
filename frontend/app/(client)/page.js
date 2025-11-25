// app/(client)/page.jsx
import Link from "next/link";

async function fetchArticles() {
    return [
        {
            id: 1,
            title: "Apple ra mắt iPhone 16 với nhiều nâng cấp mạnh",
            slug: "apple-ra-mat-iphone-16",
            summary:
                "Apple chính thức giới thiệu iPhone 16 với chip A18 và camera nâng cấp.",
            category_name: "Công nghệ",
            source_name: "VnExpress",
            image:
                "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-cam_3.jpg",
        },
        {
            id: 2,
            title: "Thị trường chứng khoán bật tăng mạnh",
            slug: "thi-truong-chung-khoan-bat-tang",
            summary: "VNIndex tăng 18 điểm nhờ lực đẩy nhóm ngân hàng.",
            category_name: "Kinh tế",
            source_name: "CafeF",
            image: "https://i1-kinhdoanh.vnecdn.net/2024/01/09/ck.jpg?w=1200&h=0&q=100",
        },
        {
            id: 3,
            title: "Messi ghi bàn quyết định phút 90+3",
            slug: "messi-ghi-ban-quyet-dinh",
            summary:
                "Messi tiếp tục phong độ đỉnh cao giúp CLB giành 3 điểm quan trọng.",
            category_name: "Thể thao",
            source_name: "Goal",
            image: "https://i1-thethao.vnecdn.net/2024/03/10/messi.jpg?w=1200&h=0&q=100",
        },
        {
            id: 4,
            title: "Giá vàng tăng trở lại sau nhiều ngày giảm",
            slug: "gia-vang-tang-tro-lai",
            summary: "Thị trường vàng trong nước ghi nhận mức tăng 400.000 đồng/lượng.",
            category_name: "Tài chính",
            source_name: "VnExpress",
            image:
                "https://i1-kinhdoanh.vnecdn.net/2024/03/01/gold.jpg?w=1200&h=0&q=100",
        },
        {
            id: 5,
            title: "Hà Nội chuẩn bị cho đợt lạnh mạnh nhất mùa",
            slug: "ha-noi-lanh-nhat-mua",
            summary: "Nhiệt độ dự báo giảm sâu xuống 12°C, người dân cần chú ý giữ ấm.",
            category_name: "Thời tiết",
            source_name: "VnExpress",
            image:
                "https://i1-vnexpress.vnecdn.net/2024/01/10/hanoi.jpg?w=1200&h=0&q=100",
        },
    ];
}

export default async function HomePage() {
    const articles = await fetchArticles();

    const headline = articles[0];
    const latest = articles.slice(1, 5);
    const sidebarTop = articles.slice(0, 5);

    return (
        <div className="container mx-auto px-3 md:px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* ================= LEFT COLUMN ================= */}
            <div className="md:col-span-5 space-y-6">
                {/* HEADLINE */}
                <div className="space-y-3">
                    <img
                        src={headline.image}
                        className="w-full h-64 object-cover rounded"
                    />
                    <h1 className="text-2xl font-bold leading-tight hover:text-red-600 cursor-pointer">
                        <Link href={`/articles/${headline.slug}`}>{headline.title}</Link>
                    </h1>
                    <p className="text-gray-600 text-sm">{headline.summary}</p>
                </div>

                {/* TIN NỔI BẬT */}
                <div>
                    <h2 className="text-xl font-bold border-b pb-2 mb-3">Tin nổi bật</h2>

                    <div className="space-y-4">
                        {latest.map((item) => (
                            <Link
                                key={item.id}
                                href={`/articles/${item.slug}`}
                                className="flex gap-3"
                            >
                                <img
                                    src={item.image}
                                    className="w-28 h-20 rounded object-cover"
                                />
                                <div>
                                    <h3 className="font-semibold hover:text-red-600">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">{item.summary}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= CENTER COLUMN ================= */}
            <div className="md:col-span-4 space-y-4">
                <h2 className="text-xl font-bold border-b pb-2">Tin mới nhất</h2>

                {articles.map((a) => (
                    <div key={a.id} className="pb-3 border-b">
                        <h3 className="font-semibold hover:text-red-600">
                            <Link href={`/articles/${a.slug}`}>{a.title}</Link>
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">{a.summary}</p>
                    </div>
                ))}
            </div>

            {/* ================= RIGHT COLUMN ================= */}
            <div className="md:col-span-3 space-y-6">
                {/* Sidebar "Xem nhiều" */}
                <div className="p-4 bg-gray-50 rounded border space-y-3">
                    <h3 className="font-bold text-lg">📈 Xem nhiều</h3>
                    <ul className="space-y-2 list-disc pl-5">
                        {sidebarTop.map((a) => (
                            <li key={a.id}>
                                <Link
                                    href={`/articles/${a.slug}`}
                                    className="hover:text-red-600"
                                >
                                    {a.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Box ý kiến */}
                <div className="p-4 bg-gray-50 rounded border space-y-3">
                    <h3 className="font-bold text-lg">💬 Góc nhìn</h3>
                    <p className="text-gray-700 text-sm">
                        Chuyên gia kinh tế: "Năm 2025 sẽ là năm bản lề chuyển dịch thị
                        trường lao động".
                    </p>
                    <p className="text-gray-700 text-sm">
                        Nhiều doanh nghiệp phải tái cấu trúc để giữ tăng trưởng.
                    </p>
                </div>
            </div>
        </div>
    );
}
