"use client";
import { useEffect, useState } from "react";

export default function LogModal({ open, onClose }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (open) fetchLogs();
  }, [open]);

  const fetchLogs = async () => {
    const res = await fetch("/api/v1/logs");
    setLogs(await res.json());
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center p-5">
      <div className="bg-white w-2/3 p-4 rounded shadow-lg max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">Bot Logs</h3>
          <button onClick={onClose} className="text-red-500 font-bold">✖ Close</button>
        </div>
        <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto max-h-[70vh]">
          {logs.join("\n")}
        </pre>
      </div>
    </div>
  );
}
