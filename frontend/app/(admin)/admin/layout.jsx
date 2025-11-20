import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import "@/styles/admin/admin-layout.css";

export default function AdminLayout({ children }) {
    return (
        <div className="admin-layout">
            <Sidebar />
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
