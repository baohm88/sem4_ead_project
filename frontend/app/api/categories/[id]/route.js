import prisma from "@/lib/prisma";

export async function GET(_, { params }) {
    const { id } = params;

    const category = await prisma.category.findUnique({
        where: { id: Number(id) },
    });

    return Response.json(category);
}

export async function PUT(req, { params }) {
    const { id } = params;
    const body = await req.json();
    const { name, slug } = body;

    const updated = await prisma.category.update({
        where: { id: Number(id) },
        data: { name, slug },
    });

    return Response.json(updated);
}

export async function DELETE(_, { params }) {
    const { id } = params;

    await prisma.category.delete({
        where: { id: Number(id) },
    });

    return Response.json({ message: "Deleted" });
}
