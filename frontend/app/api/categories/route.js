import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { id: "asc" },
            select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return Response.json(categories);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { name } = await request.json();

        if (!name) {
            return Response.json({ error: "Name required" }, { status: 400 });
        }

        const newCategory = await prisma.category.create({
            data: { name }
        });

        return Response.json(newCategory, { status: 201 });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
