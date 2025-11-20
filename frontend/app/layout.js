import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/* FONT SETUP */
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    display: "swap",
});

/* META */
export const metadata = {
    title: "Admin Panel",
    description: "Dashboard Management System",
};

/* ROOT LAYOUT */
export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="admin-body antialiased">
        {children}
        </body>
        </html>
    );
}
