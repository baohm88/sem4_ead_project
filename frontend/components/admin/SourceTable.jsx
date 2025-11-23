"use client";

export default function SourceTable({ sources, onEdit, onDelete }) {
  return (
    <table className="w-full border text-sm">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="p-2 border">Title</th>
          <th className="p-2 border">Domain</th>
          <th className="p-2 border">Path</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border w-24 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {sources.map(src => (
          <tr key={src.id} className="hover:bg-gray-50">
            <td className="p-2 border">{src.title}</td>
            <td className="p-2 border">{src.domain}</td>
            <td className="p-2 border">{src.path}</td>
            <td className="p-2 border">
              <span className={`px-2 py-1 text-xs rounded 
                ${src.status === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {src.status === 1 ? "Active" : "Inactive"}
              </span>
            </td>
            <td className="p-2 border text-center">
              <button onClick={() => onEdit(src)} className="text-blue-600">Edit</button>
              <button onClick={() => onDelete(src.id)} className="text-red-600 ml-2">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}