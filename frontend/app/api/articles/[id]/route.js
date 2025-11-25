import prisma from "@/lib/prisma";

// ---------------------------------------------------------
// 🧩 Utility: convert BigInt → Number
// ---------------------------------------------------------
function toSafe(obj) {
    if (!obj) return obj;

    return {
        ...obj,
        id: Number(obj.id),
        categoryId: obj.categoryId ? Number(obj.categoryId) : null,
        sourceId: obj.sourceId ? Number(obj.sourceId) : null,
    };
}

// ---------------------------------------------------------
// 🔵 GET ONE ARTICLE
// ---------------------------------------------------------
export async function GET(req, props) {
    try {
        const { id } = await props.params;
        const articleId = Number(id);

        const article = await prisma.articles.findUnique({
            where: { id: articleId }
        });

        if (!article) {
            return Response.json(
                { success: false, error: "Article not found" },
                { status: 404 }
            );
        }

        return Response.json(
            { success: true, data: toSafe(article) },
            { status: 200 }
        );

    } catch (err) {
        console.error("GET ARTICLE ERROR:", err);
        return Response.json(
            { success: false, error: "Server error" },
            { status: 500 }
        );
    }
}

// ---------------------------------------------------------
// 🟡 UPDATE ARTICLE
// ---------------------------------------------------------
export async function PUT(req, props) {
    try {
        const { id } = await props.params;
        const articleId = Number(id);

        const body = await req.json();

        const updated = await prisma.articles.update({
            where: { id: articleId },
            data: {
                title: body.title,
                slug: body.slug,
                description: body.description,
                content: body.content,
                content_raw: body.content_raw,
                image_url: body.image_url,
                url: body.url,
                status: body.status,
                categoryId: body.categoryId ? BigInt(body.categoryId) : null,
                sourceId: body.sourceId ? BigInt(body.sourceId) : null,
            }
        });

        return Response.json(
            { success: true, data: toSafe(updated) },
            { status: 200 }
        );

    } catch (err) {
        console.error("UPDATE ARTICLE ERROR:", err);
        return Response.json(
            { success: false, error: "Server error" },
            { status: 500 }
        );
    }
}

// ---------------------------------------------------------
// 🔴 DELETE ARTICLE
// ---------------------------------------------------------
export async function DELETE(req, props) {
    try {
        const { id } = await props.params;
        const articleId = Number(id);

        await prisma.articles.delete({
            where: { id: articleId }
        });

        return Response.json(
            { success: true, message: "Article deleted" },
            { status: 200 }
        );

    } catch (err) {
        console.error("DELETE ARTICLE ERROR:", err);
        return Response.json(
            { success: false, error: "Server error" },
            { status: 500 }
        );
    }
}
