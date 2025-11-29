import { getPublicArticleBySlug } from "@/services/articleApi";

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  const res = await getPublicArticleBySlug(slug);
  const article = res?.data;

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
        <span>📌 {article.categoryName}</span>
        <span>📰 {article.sourceName}</span>
      </div>

      <p className="text-lg text-gray-600">{article.description}</p>

      {/* Render content dạng HTML */}
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}
