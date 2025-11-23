import prisma from "@/lib/prisma";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get("slug")?.trim();
        const id = searchParams.get("id"); // id của category đang edit

        if (!slug) return Response.json({ exists: false });

        const exists = await prisma.category.findFirst({
            where: {
                slug,
                ...(id ? { id: { not: BigInt(id) } } : {})
            }
        });

        return Response.json({ exists: !!exists });
    } catch (err) {
        console.error(err);
        return Response.json({ exists: false });
    }
}

