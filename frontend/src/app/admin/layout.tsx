'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
        <nav>
          <Link href="/admin" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
            Dashboard
          </Link>
          <Link href="/admin/books" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
            Books
          </Link>
          <Link href="/admin/orders" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
            Orders
          </Link>
          <Link href="/admin/settings" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
            Settings
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow">
          <div className="flex items-center justify-between p-4">
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>Admin Dashboard</div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}