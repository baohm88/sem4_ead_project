// app/(client)/page.js

async function fetchArticles() {
  // Fake data
  const dummy_articles = [
    {
      id: 1,
      title: "Apple ra mắt iPhone 16",
      slug: "apple-ra-mat-iphone-16",
      summary: "Apple chính thức giới thiệu iPhone 16 với nhiều nâng cấp vượt trội.",
      category_name: "Công nghệ",
      source_name: "VnExpress"
    },
    {
      id: 2,
      title: "Cổ phiếu Tesla tăng mạnh",
      slug: "co-phieu-tesla-tang-manh",
      summary: "Giá cổ phiếu Tesla tăng cao sau khi Elon Musk công bố dòng xe mới.",
      category_name: "Kinh tế",
      source_name: "CafeF"
    },
    {
      id: 3,
      title: "Messi ghi bàn quyết định",
      slug: "messi-ghi-ban-quyet-dinh",
      summary: "Messi tiếp tục thể hiện phong độ đỉnh cao với bàn thắng quyết định.",
      category_name: "Thể thao",
      source_name: "24h Sport"
    }
  ];

  // ❗ Sau này bạn sẽ dùng fetch tới Spring Boot API:
  // const res = await fetch("http://localhost:8080/api/articles");

  return dummy_articles;
}

export default async function HomePage() {
  const articles = await fetchArticles();

  if (articles.length === 0) {
    return <p className="text-xl text-center">No Article yet.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Latest Articles</h1>
      <p className="text-gray-600">
        Tin mới nhất từ các nguồn bạn đã cấu hình trong admin.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <a
            key={article.id}
            href={`/articles/${article.slug}`}
            className="block rounded-lg bg-white p-5 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{article.title}</h2>
            <p className="mt-2 text-sm text-gray-500">{article.summary}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
              <span>{article.category_name}</span>
              <span>{article.source_name}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
