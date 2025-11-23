import prisma from "@/lib/prisma";

const toPlain = (obj) =>
    JSON.parse(JSON.stringify(obj, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
    ));

export async function GET() {
    try {
        const sources = await prisma.source.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                slug: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        return Response.json(toPlain(sources));
    } catch (err) {
        console.error("GET /sources ERROR:", err);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { name, slug } = await req.json();

        if (!name || !slug)
            return Response.json({ error: "Name & slug required" }, { status: 400 });

        const exists = await prisma.source.findFirst({
            where: { OR: [{ name }, { slug }] },
        });

        if (exists)
            return Response.json({ error: "Tên hoặc slug đã tồn tại!" }, { status: 400 });

        const created = await prisma.source.create({
            data: { name, slug },
        });

        return Response.json(toPlain(created));
    } catch (err) {
        console.error("POST /sources ERROR:", err);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}
