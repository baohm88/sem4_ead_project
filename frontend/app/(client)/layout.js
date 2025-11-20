import Link from "next/link";

// app/(client)/layout.js

export default function ClientLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            📰 My News
          </Link>
          <nav className="space-x-4 text-lg font-medium">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <a href="/admin" className="hover:text-blue-600">
              Admin Panel
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>

      <footer className="border-t mt-12">
        <div className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-gray-500">
          © 2025 My News. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
