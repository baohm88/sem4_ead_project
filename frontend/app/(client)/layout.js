import "@/styles/client/layout.css";
import Header from "@/components/client/Header";
import Footer from "@/components/client/Footer";

export default function ClientLayout({ children }) {
    return (
        <div className="vn-app">
            <Header />

            <main className="vn-main">
                <div className="vn-container">
                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
}
