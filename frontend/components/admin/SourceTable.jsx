"use client";

export default function SourceTable({
                                        sources,
                                        onEdit,
                                        onDelete,
                                        IconEdit,
                                        IconDelete
                                    }) {
    return (
        <table className="src-table">
            <thead>
            <tr>
                <th>Title</th>
                <th>Domain</th>
                <th>Path</th>
                <th>Status</th>
                <th style={{ width: 120 }}>Action</th>
            </tr>
            </thead>

            <tbody>
            {sources.map((src) => (
                <tr key={src.id}>
                    <td className="src-td-strong">{src.title}</td>
                    <td>{src.domain}</td>
                    <td>{src.path}</td>

                    <td>
                            <span className={`src-badge ${src.status === 1 ? "active" : "inactive"}`}>
                                {src.status === 1 ? "Active" : "Inactive"}
                            </span>
                    </td>

                    <td>
                        <div className="src-action-row">
                            <button className="neo-icon-btn edit" onClick={() => onEdit(src)}>
                                <IconEdit />
                            </button>

                            <button className="neo-icon-btn delete" onClick={() => onDelete(src.id)}>
                                <IconDelete />
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
