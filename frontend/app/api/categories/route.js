import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // nếu alias @ chưa cấu hình, dùng đường dẫn tương đối: "../../../lib/prisma"

export const dynamic = "force-dynamic";

// GET (tùy chọn) – tiện test nhanh
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            select: { id: true, name: true },
            orderBy: { id: "asc" },
        });
        return NextResponse.json(categories);
    } catch (e) {
        console.error("GET /api/categories error:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST – tạo category mới
export async function POST(req) {
    try {
        const body = await req.json().catch(() => ({}));
        const name = typeof body?.name === "string" ? body.name.trim() : "";

        // Validate
        if (!name) {
            return NextResponse.json({ error: "Field 'name' is required" }, { status: 422 });
        }
        if (name.length > 255) {
            return NextResponse.json({ error: "Name exceeds 255 characters" }, { status: 422 });
        }

        // Tạo bản ghi
        const created = await prisma.category.create({
            data: { name },
            select: { id: true, name: true },
        });

        // 201 Created
        return NextResponse.json(created, { status: 201 });
    } catch (e) {
        console.error("POST /api/categories error:", e);
        // Nếu trùng unique constraint, có thể trả 409
        if (e?.code === "P2002") {
            return NextResponse.json({ error: "Category name already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
