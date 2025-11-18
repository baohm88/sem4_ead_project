"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditCategory({ params }) {
    const router = useRouter();
    const { id } = params;

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");

    useEffect(() => {
        fetch(`/api/categories/${id}`)
            .then(res => res.json())
            .then(data => {
                setName(data.name);
                setSlug(data.slug);
            });
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();

        await fetch(`/api/categories/${id}`, {
            method: "PUT",
            body: JSON.stringify({ name, slug }),
        });

        router.push("/admin/categories");
    }

    return (
        <div className="p-5">
            <h1 className="text-xl font-bold mb-4">Edit Category</h1>

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    className="border p-2 w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    className="border p-2 w-full"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                />

                <button className="bg-green-600 px-4 py-2 text-white rounded">
                    Update
                </button>
            </form>
        </div>
    );
}
