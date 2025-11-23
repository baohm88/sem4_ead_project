import prisma from "@/lib/prisma";

// BigInt → JSON
function toPlain(obj) {
    return JSON.parse(
        JSON.stringify(obj, (_, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    );
}

// ===========================================
// GET ALL ARTICLES (có Category name)
// ===========================================
export async function GET() {
    try {
        const articles = await prisma.articles.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                content: true,
                content_raw: true,
                image_url: true,
                url: true,
                status: true,
                categoryId: true,
                sourceId: true,
                createdAt: true,
                updatedAt: true,

                // ⭐ LẤY TÊN CATEGORY
                Category: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                    },
                },
            },
        });

        return Response.json(toPlain(articles));
    } catch (error) {
        console.error("API ERROR /api/articles:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

// ===========================================
// CREATE ARTICLE
// ===========================================
export async function POST(req) {
    try {
        const body = await req.json();

        const created = await prisma.articles.create({
            data: {
                title: body.title,
                slug: body.slug,
                description: body.description,
                content: body.content,
                content_raw: body.content_raw,
                image_url: body.image_url,
                url: body.url,
                status: body.status ?? "draft",
                categoryId: body.categoryId ? BigInt(body.categoryId) : null,
                sourceId: body.sourceId ? BigInt(body.sourceId) : null,
            },
        });

        return Response.json({ success: true, data: toPlain(created) });
    } catch (error) {
        console.error("CREATE ARTICLE ERROR:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
