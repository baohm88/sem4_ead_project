"use client";

import Link from "next/link";
import { useState } from "react";
import "@/styles/client/header.css";

export default function Header() {
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <header className="vn-header">

            {/* TOP BAR */}
            <div className="vn-topbar">
                <div className="vn-container vn-topbar-wrapper">
                    <div className="vn-top-left">
                        <Link href="/" className="vn-logo">VNEWS</Link>
                    </div>

                    <div className="vn-top-right">
                        <Link href="/video">Video</Link>
                        <Link href="/podcast">Podcast</Link>
                        <Link href="/kinh-doanh">Kinh doanh</Link>
                        <Link href="/suc-khoe">Sức khỏe</Link>
                    </div>
                </div>
            </div>

            {/* MAIN MENU */}
            <nav className="vn-navbar">
                <div className="vn-container vn-nav-wrapper">
                    <button
                        className="vn-menu-btn"
                        onClick={() => setOpenMenu(!openMenu)}
                    >
                        ☰
                    </button>

                    <ul className={`vn-menu ${openMenu ? "open" : ""}`}>
                        <li><Link href="/">Trang chủ</Link></li>
                        <li><Link href="/thoi-su">Thời sự</Link></li>
                        <li><Link href="/the-gioi">Thế giới</Link></li>
                        <li><Link href="/kinh-doanh">Kinh doanh</Link></li>
                        <li><Link href="/giai-tri">Giải trí</Link></li>
                        <li><Link href="/the-thao">Thể thao</Link></li>
                        <li><Link href="/cong-nghe">Công nghệ</Link></li>
                        <li><Link href="/doi-song">Đời sống</Link></li>
                        <li><Link href="/goc-nhin">Góc nhìn</Link></li>
                    </ul>
                </div>
            </nav>

        </header>
    );
}
