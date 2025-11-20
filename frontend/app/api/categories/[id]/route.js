import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";  // Thêm import NextResponse để nhất quán

export async function GET(request, { params }) {
    const resolvedParams = await params;  // Unwrap params (Promise) đúng cách
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
        const item = await prisma.category.findUnique({ where: { id } });

        if (!item) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json(item);
    } catch (err) {
        console.error("GET Error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const resolvedParams = await params;  // Unwrap params
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
        const { name } = await request.json();

        if (!name || typeof name !== "string" || name.trim() === "") {
            return NextResponse.json({ error: "Name is required and must be a non-empty string" }, { status: 400 });
        }

        const updated = await prisma.category.update({
            where: { id },
            data: { name: name.trim() },
        });

        return NextResponse.json(updated);
    } catch (err) {
        console.error("PUT Error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const resolvedParams = await params;  // Unwrap params
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
        await prisma.category.delete({ where: { id } });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (err) {
        console.error("DELETE Error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
