import prisma from "@/lib/prisma";

/* BigInt → string */
const toPlain = (obj) =>
    JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? v.toString() : v)));

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);

        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 20;
        const q = searchParams.get("q")?.trim().toLowerCase() || "";

        const where = q
            ? { OR: [{ name: { contains: q } }, { slug: { contains: q } }] }
            : {};

        const skip = (page - 1) * limit;

        const categories = await prisma.category.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: { Articles: { select: { id: true } } },
        });

        const total = await prisma.category.count({ where });

        const mapped = categories.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
            postsCount: c.Articles.length,
        }));

        return Response.json(
            toPlain({
                data: mapped,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            })
        );
    } catch (err) {
        console.error("GET /categories ERROR:", err);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { name, slug } = await req.json();

        if (!name || !slug)
            return Response.json({ error: "Name & slug required" }, { status: 400 });

        const exists = await prisma.category.findFirst({
            where: { OR: [{ name }, { slug }] },
        });

        if (exists)
            return Response.json({ error: "Tên hoặc slug đã tồn tại!" }, { status: 400 });

        const created = await prisma.category.create({
            data: { name, slug },
        });

        return Response.json(toPlain(created));
    } catch (err) {
        console.error("POST /categories ERROR:", err);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}
