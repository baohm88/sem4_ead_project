"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import "@/styles/admin/admin-layout.css";
import "@/styles/admin/sidebar.css";
import ToastProvider from "@/components/admin/ToastProvider";

export default function AdminLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <ToastProvider>
            <div className={`admin-layout ${collapsed ? "collapsed" : ""}`}>
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

                <div className="admin-content">
                    <header className="admin-header">
                        <div className="wrap">
                            <Topbar />
                        </div>
                    </header>

                    <main className="admin-main">{children}</main>
                </div>
            </div>
        </ToastProvider>
    );
}
