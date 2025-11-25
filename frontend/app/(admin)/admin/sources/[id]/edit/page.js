import SourceFormPage from "@/components/admin/SourceForm";
import { getSourceById } from "@/services/sourceApi";

export default async function EditSourcePage({ params }) {
  const { id } = await params; // ⬅ unwrap Promise

  const data = await getSourceById(id);

  return <SourceFormPage editData={data} />;
}