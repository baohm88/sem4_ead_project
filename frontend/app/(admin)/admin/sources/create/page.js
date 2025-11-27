"use client";

import { useRouter } from "next/navigation";
import { createSource } from "@/services/sourceApi";
import SourceForm from "@/components/admin/SourceForm";
import { toast } from "react-toastify";

export default function CreateSourcePage() {
    const router = useRouter();

    const handleSave = async (form) => {
        try {
            await createSource(form);
            toast.success("Source created!");
            router.push("/admin/sources");
        } catch (err) {
            toast.error("Create failed!");
        }
    };

    return <SourceForm editing={null} onSaved={handleSave} />;
}
