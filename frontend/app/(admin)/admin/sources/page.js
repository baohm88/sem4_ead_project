"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import SourceTable from "../../../../components/admin/SourceTable";
import { getSources, deleteSource } from "../../../../services/sourceApi";

export default function SourcesPage() {
  const [sources, setSources] = useState([]);

  const load = async () => {
    const data = await getSources();
    setSources(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Delete this source?")) {
      await deleteSource(id);
      load();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Sources Manager</h1>

        {/* 🆕 CHỈNH THÀNH LINK */}
        <Link
          href="/admin/sources/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Source
        </Link>
      </div>

      <SourceTable
        sources={sources}
        onEdit={(src) => {
          // 🛠 Edit chuyển sang dynamic route
          window.location.href = `/admin/sources/${src.id}/edit`;
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}
