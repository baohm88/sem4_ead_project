"use client";

import { useEffect, useState } from "react";
import SourceTable from "@/components/admin/SourceTable";
import { getSources, deleteSource } from "@/services/sourceApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import "@/styles/admin/source-list.css";

export default function SourcesPage() {
    const [sources, setSources] = useState([]);
    const router = useRouter();

    const load = async () => {
        const data = await getSources();
        setSources(data);
    };
    const IconEdit = () => (
        <svg className="neo-icon" viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
        </svg>
    );
    const IconDelete = () => (
        <svg className="neo-icon" viewBox="0 0 24 24">
            <path d="M6 7h12M10 11v6M14 11v6M9 7l1-2h4l1 2M5 7h14l-1 13H6L5 7z" />
        </svg>
    );
    useEffect(() => {
        load();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete this source?")) return;

        try {
            await deleteSource(id);
            toast.success("Deleted successfully!");
            load();
        } catch (err) {
            toast.error("Delete failed!");
        }
    };

    return (
        <div className="source-wrap">
            <div className="source-header">
                <h1 className="source-title">Sources Manager</h1>

                <button
                    className="source-btn-add"
                    onClick={() => router.push("/admin/sources/create")}
                >
                    + Add Source
                </button>
            </div>

            <div className="source-card">
                <div className="source-table-wrap">
                    <SourceTable
                        IconEdit={IconEdit}
                        IconDelete={IconDelete}
                        sources={sources}
                        onEdit={(src) =>
                            router.push(`/admin/sources/${src.id}/edit`)
                        }
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
}
