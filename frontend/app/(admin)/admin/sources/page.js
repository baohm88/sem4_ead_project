"use client";
import { useEffect, useState } from "react";
import SourceTable from "../../../../components/admin/SourceTable";
import SourceModal from "../../../../components/admin/SourceModal";
import {
  getSources,
  createSource,
  updateSource,
  deleteSource,
} from "../../../../services/sourceApi";

export default function SourcesPage() {
  const [sources, setSources] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const load = async () => {
    const data = await getSources();
    setSources(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (form) => {
    if (editData) await updateSource(editData.id, form);
    else await createSource(form);
    setModalOpen(false);
    setEditData(null);
    load();
  };

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
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setModalOpen(true)}
        >
          + Add Source
        </button>
      </div>

      <SourceTable
        sources={sources}
        onEdit={(src) => {
          setEditData(src);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <SourceModal
        show={modalOpen}
        data={editData}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={handleSave}
      />
    </div>
  );
}
