"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "@/styles/admin/sidebar.css";

import {
    MdDashboard,
    MdCategory,
    MdMenu,
    MdClose,
    MdChevronLeft,
    MdChevronRight,
    MdBallot,
} from "react-icons/md";

// 1. NHẬN PROPS TỪ CHA (AdminLayout)
export default function Sidebar({ collapsed, setCollapsed }) {
    const pathname = usePathname();

    // mobile open (Giữ nguyên cái này vì mobile hoạt động độc lập)
    const [mobileOpen, setMobileOpen] = useState(false);

    // 2. XÓA DÒNG NÀY (Vì state giờ do AdminLayout quản lý)
    // const [collapsed, setCollapsed] = useState(false);

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: MdDashboard },
        { name: "Categories", href: "/admin/categories/list", icon: MdCategory },
        { name: "Sources", href: "/admin/sources", icon: MdCategory },
        { name: "Client", href: "/", icon: MdBallot },
    ];

    return (
        <>
            {/* Mobile button */}
            <button className="sb-toggle" onClick={() => setMobileOpen(true)}>
                <MdMenu size={24} />
            </button>

            {mobileOpen && (
                <div className="sb-overlay" onClick={() => setMobileOpen(false)} />
            )}

            {/* Logic hiển thị class dựa trên props collapsed truyền vào */}
            <aside
                className={`sidebar ${mobileOpen ? "is-open" : ""} ${
                    collapsed ? "is-collapsed" : ""
                }`}
            >
                <div className="sidebar-header">
                    <h2 className="brand">{collapsed ? "A" : "AdminPanel"}</h2>

                    <button
                        className="sb-close md-hidden"
                        onClick={() => setMobileOpen(false)}
                    >
                        <MdClose size={24} />
                    </button>

                    {/* Collapse btn desktop - GỌI HÀM SET TỪ CHA */}
                    <button
                        className="sb-collapse-btn lg-only"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? (
                            <MdChevronRight size={22} />
                        ) : (
                            <MdChevronLeft size={22} />
                        )}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        // Logic active: Nếu vào /admin/sources/add thì vẫn active mục Sources
                        // Bạn có thể sửa startsWith chính xác hơn nếu cần
                        const active = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`sidebar-item ${active ? "is-active" : ""}`}
                                onClick={() => setMobileOpen(false)}
                            >
                                <div className="sidebar-icon">
                                    <Icon size={22} />
                                </div>

                                {!collapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}