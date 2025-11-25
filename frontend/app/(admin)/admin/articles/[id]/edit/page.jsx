import prisma from "@/lib/prisma";
import ArticleForm from "@/components/admin/ArticleForm";   // ✅ THÊM DÒNG NÀY

export default async function EditArticlePage({ params }) {
    // 🔥 unwrap params Promise
    const { id } = await params;

    const article = await prisma.articles.findUnique({
        where: { id: BigInt(id) },
    });

    if (!article) {
        return <div className="cat-wrap">Không tìm thấy bài viết!</div>;
    }

    const safe = {
        ...article,
        id: Number(article.id),
        categoryId: article.categoryId ? Number(article.categoryId) : "",
        sourceId: article.sourceId ? Number(article.sourceId) : "",
    };

    return (
        <div className="cat-wrap">
            <ArticleForm mode="edit" initialData={safe} />
        </div>
    );
}
