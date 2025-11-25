"use client"; // 👈 QUAN TRỌNG: Thêm dòng này ở đầu file

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import "@/styles/admin/admin-layout.css";
import "@/styles/admin/sidebar.css";


export default function AdminLayout({ children }) {
    // Khởi tạo state quản lý đóng/mở
    const [collapsed, setCollapsed] = useState(false);

    return (
        // Thêm class 'collapsed' vào div cha để CSS Grid hoạt động
        <div className={`admin-layout ${collapsed ? 'collapsed' : ''}`}>

            {/* Truyền state và hàm set xuống Sidebar */}
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
    );
}