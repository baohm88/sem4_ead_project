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
    const [articles, setArticles] = useState([]);

    const [recentCat, setRecentCat] = useState([]);
    const [recentArt, setRecentArt] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function load() {
            try {
                // 👉 Lấy Categories
                const resC = await fetch("/api/categories");
                const up1 = await resC.json();
                const catList = Array.isArray(up1?.data) ? up1.data : [];

                // 👉 Lấy Articles
                const resA = await fetch("/api/articles");
                const up2 = await resA.json();
                const artList = Array.isArray(up2) ? up2 : [];

                if (!mounted) return;

                setCategories(catList);
                setArticles(artList);

                // Stats
                setStats({
                    categories: catList.length,
                    articles: artList.length,
                    sources: 4, // nếu có bảng sources sau này cập nhật thật
                });

                // 5 Categories cập nhật gần nhất
                setRecentCat(
                    catList.slice(0, 5).map((c) => ({
                        id: c.id,
                        name: c.name,
                        date: c.updatedAt
                            ? new Date(c.updatedAt).toLocaleString("vi-VN")
                            : "—",
                    }))
                );

                // 5 Articles gần nhất
                setRecentArt(
                    artList.slice(0, 5).map((a) => ({
                        id: a.id,
                        name: a.title,
                        date: a.updatedAt
                            ? new Date(a.updatedAt).toLocaleString("vi-VN")
                            : "—",
                    }))
                );
            } catch (err) {
                console.error(err);
                if (!mounted) return;

                setCategories([]);
                setArticles([]);
                setRecentCat([]);
                setRecentArt([]);

                setStats({
                    categories: 0,
                    articles: 0,
                    sources: 0,
                });
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();
        return () => {
            mounted = false;
        };
    }, []);

    // AreaChart demo
    const dataDemo = [
        { name: "Jan", construction: 20000, operations: 10000, alumni: 0 },
        { name: "Feb", construction: 120000, operations: 25000, alumni: 0 },
        { name: "Mar", construction: 420000, operations: 60000, alumni: 5000 },
        { name: "Apr", construction: 90000, operations: 180000, alumni: 15000 },
        { name: "May", construction: 110000, operations: 230000, alumni: 40000 },
        { name: "Jun", construction: 80000, operations: 260000, alumni: 120000 },
    ];

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

            {/* AREA CHART */}
            <Card
                className="dash-card mb-32"
                style={{ borderRadius: 20, overflow: "hidden" }}
            >
                <h2 className="dash-section-title">Tổng quan theo nguồn ngân sách</h2>
                <div className="chart-box" style={{ height: 320, padding: 8 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={areaData}
                            margin={{ top: 24, right: 24, left: 8, bottom: 8 }}
                        >
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
                            <XAxis
                                dataKey="name"
                                tick={{ fill: "#7A7490" }}
                                axisLine={false}
                                tickLine={false}
                            />
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

                    {/* Recent Categories */}
                    <h3 className="recent-subtitle">Categories cập nhật gần đây</h3>
                    {recentCat.map((item) => (
                        <div key={item.id} className="recent-item">
                            <p className="recent-name">{item.name}</p>
                            <span className="recent-date">{item.date}</span>
                        </div>
                    ))}
                    {recentCat.length === 0 && (
                        <p className="recent-empty">Không có categories</p>
                    )}

                    <hr style={{ margin: "20px 0", opacity: 0.4 }} />

                    {/* Recent Articles */}
                    <h3 className="recent-subtitle">Articles cập nhật gần đây</h3>
                    {recentArt.map((item) => (
                        <div key={item.id} className="recent-item">
                            <p className="recent-name">{item.name}</p>
                            <span className="recent-date">{item.date}</span>
                        </div>
                    ))}
                    {recentArt.length === 0 && (
                        <p className="recent-empty">Không có bài viết</p>
                    )}
                </div>
            </Card>
        </div>
    );
}
