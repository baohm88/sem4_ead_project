"use client";
import { useState } from "react";

export default function BotCard({ title, desc, startApi }) {
  const [loading, setLoading] = useState(false);

  const runBot = async () => {
    setLoading(true);
    const res = await fetch(startApi, { method: "POST" });
    const data = await res.json();
    alert(data.message);
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <h2 className="text-xl font-bold mb-1">{title}</h2>
      <p className="text-gray-600 text-sm mb-3">{desc}</p>

      <button
        disabled={loading}
        onClick={runBot}
        className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
      >
        {loading ? "Running..." : "Run Now"}
      </button>
    </div>
  );
}
