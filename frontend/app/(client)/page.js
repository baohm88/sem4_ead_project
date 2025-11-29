import Link from "next/link";
import { getPublicArticles } from "@/services/articleApi";

export default async function HomePage() {
    // 🔥 Gọi API public articles
    const res = await getPublicArticles(0, 20);
    console.log("public articles", res);
    const raw = res?.data?.content || [];

    // 🔄 Convert sang format FE đang dùng
    const articles = raw.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        summary: a.description,
        category_name: a.articleCategory?.name,
        source_name: a.source?.title,
        image: a.imageUrl,
    }));

    if (articles.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                Chưa có bài viết nào.
            </div>
        );
    }

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