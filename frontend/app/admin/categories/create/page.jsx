"use client";

import { useState } from "react";

export default function CreateCategoryPage() {
    const [name, setName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [ok, setOk] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        setOk(false);

        const trimmed = name.trim();
        if (!trimmed) {
            setError("Name là bắt buộc.");
            return;
        }
        if (trimmed.length > 255) {
            setError("Name không được vượt quá 255 ký tự.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: trimmed }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data?.error || `Tạo thất bại (HTTP ${res.status}).`);
            } else {
                setOk(true);
                setName("");
                // Điều hướng về danh sách sau 800ms
                setTimeout(() => {
                    window.location.href = "/admin/categories";
                }, 800);
            }
        } catch (err) {
            setError("Không thể kết nối server. Kiểm tra API/Network.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div style={{ padding: 24, maxWidth: 560 }}>
            <h1>Tạo Category mới</h1>
            <p>Nhập tên category (tối đa 255 ký tự) và nhấn Tạo.</p>

            <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
                <div style={{ marginBottom: 12 }}>
                    <label htmlFor="name" style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
                        Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={255}
                        placeholder="Ví dụ: Books"
                        style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "1px solid #ccc",
                            borderRadius: 6,
                            fontSize: 14,
                        }}
                    />
                    <div style={{ marginTop: 6, fontSize: 12, color: "#666" }}>
                        {name.length}/255
                    </div>
                </div>

                {error && (
                    <div
                        style={{
                            background: "#ffeaea",
                            color: "#b30000",
                            padding: "8px 12px",
                            borderRadius: 6,
                            marginBottom: 12,
                            border: "1px solid #ffb3b3",
                        }}
                    >
                        {error}
                    </div>
                )}

                {ok && (
                    <div
                        style={{
                            background: "#eaffea",
                            color: "#167d00",
                            padding: "8px 12px",
                            borderRadius: 6,
                            marginBottom: 12,
                            border: "1px solid #b6f0b6",
                        }}
                    >
                        Tạo thành công! Đang chuyển về danh sách…
                    </div>
                )}

                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                            background: submitting ? "#999" : "#111",
                            color: "#fff",
                            padding: "10px 16px",
                            borderRadius: 6,
                            border: "none",
                            cursor: submitting ? "not-allowed" : "pointer",
                        }}
                    >
                        {submitting ? "Đang tạo..." : "Tạo"}
                    </button>

                    <a
                        href="/admin/categories"
                        style={{
                            padding: "10px 16px",
                            borderRadius: 6,
                            border: "1px solid #ccc",
                            color: "#333",
                            textDecoration: "none",
                            background: "#fff",
                        }}
                    >
                        Hủy
                    </a>
                </div>
            </form>
        </div>
    );
}
