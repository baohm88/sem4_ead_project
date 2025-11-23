import prisma from "@/lib/prisma";

const toPlain = (obj) =>
    JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? v.toString() : v)));

export async function GET(req, context) {
    try {
        const params = await context.params;
        const id = BigInt(params.id);

        const data = await prisma.category.findUnique({
            where: { id },
            include: { Articles: { select: { id: true } } },
        });

        if (!data) return Response.json({ error: "Không tìm thấy" }, { status: 404 });

        return Response.json(
            toPlain({
                id: data.id,
                name: data.name,
                slug: data.slug,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                postsCount: data.Articles.length,
            })
        );
    } catch (err) {
        console.error("DETAIL ERROR:", err);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PUT(req, context) {
    try {
        const params = await context.params;
        const id = BigInt(params.id);

        const { name, slug } = await req.json();
        if (!name || !slug)
            return Response.json({ error: "Name & slug required" }, { status: 400 });

        const dup = await prisma.category.findFirst({
            where: {
                OR: [{ name }, { slug }],
                NOT: { id },
            },
        });

        if (dup)
            return Response.json({ error: "Tên hoặc slug đã tồn tại!" }, { status: 400 });

        const updated = await prisma.category.update({
            where: { id },
            data: { name, slug },
        });

        return Response.json(toPlain(updated));
    } catch (err) {
        console.error("UPDATE ERROR:", err);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req, context) {
    try {
        const params = await context.params;
        const id = BigInt(params.id);

        // Không xoá bài viết → Prisma tự SetNull
        await prisma.category.delete({ where: { id } });

        return Response.json({ success: true });
    } catch (err) {
        console.error("DELETE ERROR:", err);
        return Response.json({ error: "Không thể xoá category" }, { status: 500 });
    }
}
