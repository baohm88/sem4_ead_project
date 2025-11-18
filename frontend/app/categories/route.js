import prisma from "@/lib/prisma";

export async function GET() {
    const categories = await prisma.category.findMany({
        orderBy: { id: "asc" }
    });

    return Response.json(categories);
}

export async function POST(req) {
    const { name } = await req.json();

    const newCat = await prisma.category.create({
        data: { name }
    });

    return Response.json(newCat);
}
