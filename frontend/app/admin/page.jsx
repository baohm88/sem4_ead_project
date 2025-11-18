"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/admin/Card";
import {
    MdTrendingUp,
    MdCategory,
    MdArticle,
    MdSource,
} from "react-icons/md";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

import "@/styles/admin/dashboard.css";
import "@/styles/admin/card.css";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        categories: 0,
        articles: 0,
        sources: 0,
    });

    const [categories, setCategories] = useState([]);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function load() {
            try {
                const res = await fetch("/api/categories");
                const cat = await res.json();

                const list = Array.isArray(cat) ? cat : [];
                if (!mounted) return;

                setCategories(list);

                setStats({
                    categories: list.length,
                    articles: 12, // dữ liệu giả
                    sources: 4,   // dữ liệu giả
                });

                setRecent(
                    list.slice(0, 5).map((c) => ({
                        id: c?.id,
                        name: c?.name,
                        date: new Date().toLocaleDateString("vi-VN"),
                    }))
                );
            } catch (err) {
                console.error(err);
                if (!mounted) return;
                setCategories([]);
                setStats({ categories: 0, articles: 12, sources: 4 });
                setRecent([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();
        return () => {
            mounted = false;
        };
    }, []);

    // Demo data cho area chart giống ảnh. Thay bằng dữ liệu thực nếu có.
    // Gợi ý cấu trúc: { name: 'Jan', construction: number, operations: number, alumni: number }
    const dataDemo = [
        { name: "Jan", construction: 20000, operations: 10000, alumni: 0 },
        { name: "Feb", construction: 120000, operations: 25000, alumni: 0 },
        { name: "Mar", construction: 420000, operations: 60000, alumni: 5000 },
        { name: "Apr", construction: 90000, operations: 180000, alumni: 15000 },
        { name: "May", construction: 110000, operations: 230000, alumni: 40000 },
        { name: "Jun", construction: 80000, operations: 260000, alumni: 120000 },
    ];

    // Nếu muốn xây từ categories, có thể map tùy ý. Ở đây dùng demo để lên layout giống ảnh.
    const areaData = useMemo(() => dataDemo, []);

    if (loading) {
        return (
            <div className="dash-wrap">
                <Card>
                    <p>Đang tải dashboard...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="dash-wrap fade-in">
            {/* HEADER */}
            <div className="dash-header">
                <h1 className="dash-title">
                    <MdTrendingUp className="dash-title-icon" />
                    <span>Dashboard</span>
                </h1>
            </div>

            {/* STATS GRID */}
            <div className="dash-grid">
                <Card className="stat-card stat-blue">
                    <div className="stat-row">
                        <div>
                            <p className="stat-label">Categories</p>
                            <p className="stat-value">{stats.categories}</p>
                        </div>
                        <MdCategory className="stat-icon stat-icon-blue" />
                    </div>
                </Card>

                <Card className="stat-card stat-purple">
                    <div className="stat-row">
                        <div>
                            <p className="stat-label">Articles</p>
                            <p className="stat-value">{stats.articles}</p>
                        </div>
                        <MdArticle className="stat-icon stat-icon-purple" />
                    </div>
                </Card>

                <Card className="stat-card stat-green">
                    <div className="stat-row">
                        <div>
                            <p className="stat-label">Sources</p>
                            <p className="stat-value">{stats.sources}</p>
                        </div>
                        <MdSource className="stat-icon stat-icon-green" />
                    </div>
                </Card>
            </div>

            {/* AREA CHART giống ảnh mẫu */}
            <Card className="dash-card mb-32" style={{ borderRadius: 20, overflow: "hidden" }}>
                <h2 className="dash-section-title">Tổng quan theo nguồn ngân sách</h2>
                <div className="chart-box" style={{ height: 320, padding: 8 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={areaData} margin={{ top: 24, right: 24, left: 8, bottom: 8 }}>
                            <defs>
                                <linearGradient id="gradConstruction" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#31C4F3" stopOpacity={0.9} />
                                    <stop offset="95%" stopColor="#31C4F3" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="gradOperations" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4F66FF" stopOpacity={0.9} />
                                    <stop offset="95%" stopColor="#4F66FF" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="gradAlumni" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#27D7A1" stopOpacity={0.9} />
                                    <stop offset="95%" stopColor="#27D7A1" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" stroke="#E9E7F0" />
                            <XAxis dataKey="name" tick={{ fill: "#7A7490" }} axisLine={false} tickLine={false} />
                            <YAxis
                                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                                tick={{ fill: "#7A7490" }}
                                axisLine={false}
                                tickLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip
                                formatter={(val) => [`$${Number(val).toLocaleString()}`, ""]}
                                labelFormatter={(l) => `Thời gian: ${l}`}
                                contentStyle={{
                                    borderRadius: 12,
                                    border: "1px solid #EEE",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                }}
                            />
                            <Legend
                                verticalAlign="top"
                                align="center"
                                wrapperStyle={{ paddingBottom: 8 }}
                                iconType="triangle"
                            />

                            {/* Thêm stackId="1" cho 3 Area nếu muốn stack */}
                            <Area
                                type="monotone"
                                dataKey="construction"
                                name="Construction"
                                stroke="#31C4F3"
                                fill="url(#gradConstruction)"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="operations"
                                name="Operations"
                                stroke="#4F66FF"
                                fill="url(#gradOperations)"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="alumni"
                                name="Alumni"
                                stroke="#27D7A1"
                                fill="url(#gradAlumni)"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* RECENT ACTIVITY */}
            <Card className="dash-card">
                <h2 className="dash-section-title">Hoạt động gần đây</h2>
                <div className="recent-list">
                    {recent.map((item) => (
                        <div
                            key={item?.id ?? `${item?.name}-${item?.date}`}
                            className="recent-item"
                        >
                            <p className="recent-name">{item?.name ?? "—"}</p>
                            <span className="recent-date">{item?.date ?? ""}</span>
                        </div>
                    ))}

                    {recent.length === 0 && (
                        <p className="recent-empty">Không có dữ liệu</p>
                    )}
                </div>
            </Card>
        </div>
    );
}
