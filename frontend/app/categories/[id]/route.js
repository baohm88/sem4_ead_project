import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
    const id = Number((await params).id);

    const category = await prisma.category.findUnique({
        where: { id }
    });

    return Response.json(category);
}

export async function PUT(req, { params }) {
    const id = Number((await params).id);
    const { name } = await req.json();

    const updated = await prisma.category.update({
        where: { id },
        data: { name }
    });

    return Response.json(updated);
}

export async function DELETE(req, { params }) {
    const id = Number((await params).id);

    await prisma.category.delete({ where: { id } });

    return Response.json({ message: "Deleted" });
}
