"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "@/styles/admin/sidebar.css";

import { MdDashboard, MdCategory, MdMenu, MdClose } from "react-icons/md";

export default function Sidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: MdDashboard },
        { name: "Categories", href: "/admin/categories", icon: MdCategory },
    ];

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="sb-toggle"
                onClick={() => setOpen(true)}
                aria-label="Mở sidebar"
            >
                <MdMenu size={24} />
            </button>

            {/* Overlay (mobile) */}
            {open && <div className="sb-overlay" onClick={() => setOpen(false)} aria-hidden="true" />}

            {/* Sidebar */}
            <aside
                className={`sidebar ${open ? "is-open" : ""}`}
                aria-label="Thanh điều hướng quản trị"
            >
                <div className="sidebar-header">
                    <h2 className="brand">AdminPanel</h2>
                    <button
                        className="sb-close md-hidden"
                        onClick={() => setOpen(false)}
                        aria-label="Đóng sidebar"
                    >
                        <MdClose size={24} />
                    </button>
                </div>

                <nav className="sidebar-nav" role="navigation">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`sidebar-item ${active ? "is-active" : ""}`}
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
