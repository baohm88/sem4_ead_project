"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSources, updateSource } from "@/services/sourceApi";
import SourceForm from "@/components/admin/SourceForm";
import { toast } from "react-toastify";

export default function EditSourcePage() {
    const { id } = useParams();
    const router = useRouter();
    const [source, setSource] = useState(null);

    useEffect(() => {
        getSources().then((res) => {
            const found = res.data.find((s) => String(s.id) === String(id));
            setSource(found);
        });
    }, [id]);

    const handleSave = async (form) => {
        try {
            await updateSource(id, form);
            toast.success("Updated successfully!");
            router.push("/admin/sources");
        } catch (err) {
            toast.error("Update failed!");
        }
    };

    if (!source) return <div className="p-4">Loading...</div>;

    return <SourceForm editing={source} onSaved={handleSave} />;
}
