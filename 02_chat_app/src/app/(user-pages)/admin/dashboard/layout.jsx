"use client";

import Link from "next/link";

export default function AdminDashboardLayout({ children }) {
  // You can replace these with props if needed
  const user = {
    name: "Admin User",
    role: "admin",
    isRoot: true,
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logout clicked");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-bold mb-2">Admin Dashboard</h2>

        <p className="text-sm text-gray-500">
          {user.isRoot ? "Root Admin" : "Admin"}
        </p>

        <nav className="space-y-2 mt-6">
          <Link
            href="/admin/dashboard"
            className="block px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            Overview
          </Link>

          <Link
            href="/admin/dashboard/users"
            className="block px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            Users
          </Link>

          <Link
            href="/admin/dashboard/products"
            className="block px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            Products
          </Link>

          <Link
            href="/admin/dashboard/orders"
            className="block px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            Orders
          </Link>

          {user.isRoot && (
            <Link
              href="/admin/dashboard/settings"
              className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-red-600"
            >
              Root Settings
            </Link>
          )}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-6 w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
