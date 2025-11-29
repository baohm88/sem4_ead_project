// app/(client)/articles/[slug]/page.js

// Fake dummy data giống HomePage
const dummy_articles = [
  {
    id: 1,
    title: "Apple ra mắt iPhone 16",
    slug: "apple-ra-mat-iphone-16",
    summary: "Apple chính thức giới thiệu iPhone 16 với nhiều nâng cấp vượt trội.",
    content_html: "<p>Apple vừa công bố iPhone 16 với chip A18 cùng nhiều công nghệ mới...</p>",
    category_name: "Công nghệ",
    source_name: "VnExpress"
  },
  {
    id: 2,
    title: "Cổ phiếu Tesla tăng mạnh",
    slug: "co-phieu-tesla-tang-manh",
    summary: "Giá cổ phiếu Tesla tăng cao sau khi Elon Musk công bố dòng xe mới.",
    content_html: "<p>Sau buổi ra mắt xe điện thế hệ mới, Tesla đã tăng 10% giá trị thị trường...</p>",
    category_name: "Kinh tế",
    source_name: "CafeF"
  },
  {
    id: 3,
    title: "Messi ghi bàn quyết định",
    slug: "messi-ghi-ban-quyet-dinh",
    summary: "Messi tiếp tục thể hiện phong độ đỉnh cao với bàn thắng quyết định.",
    content_html: "<p>Trong trận đấu cuối tuần qua, Messi ghi bàn quyết định giúp đội nhà chiến thắng...</p>",
    category_name: "Thể thao",
    source_name: "24h Sport"
  }
];

// Hàm "fetch" articles tạm thời
async function fetchArticleBySlug(slug) {
  return dummy_articles.find((a) => a.slug === slug);
}

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
    console.log("article", article);

  if (!article) {
    return (
      <div className="text-center text-xl text-red-500 py-20">
        ❌ Article Not Found
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold">{article.title}</h1>

      <div className="text-gray-500 text-sm flex gap-4">
        <span>📌 {article.category_name}</span>
        <span>📰 {article.source_name}</span>
      </div>

      <p className="text-lg text-gray-600">{article.summary}</p>

      {/* Render content dạng HTML */}
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: article.content_html }}
      />
    </article>
  );
}
