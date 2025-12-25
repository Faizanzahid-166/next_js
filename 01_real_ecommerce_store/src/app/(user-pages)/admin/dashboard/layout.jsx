"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, fetchUser } from "@/redux/authSliceTunk/authSlice";

export default function AdminDashboardLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user, loading } = useSelector((state) => state.auth);

  // 🔐 Load user once
  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  // 🔐 Guard admin route
  useEffect(() => {
    if (!loading && user) {
      if (user.role !== "admin") {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  const navLinks = [
    { name: "Inser Product", path: "/admin/dashboard/insertProduct" },
    { name: "List of User", path: "/admin/dashboard/adminUserRole" },
    { name: "Customer Support", path: "/admin/dashboard/" },
    { name: "Order", path: "/admin/dashboard/" },
    { name: "Marketing Manager", path: "/admin/dashboard/" },
  ];

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg animate-pulse">
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-bold mb-2">Admin Dashboard</h2>

        <p className="text-sm text-gray-500">
          {user.isRoot ? "Root Admin" : "Admin"}
        </p>

        <nav className="space-y-2 mt-6">
          <ul>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.path}
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100 "
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

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
          onClick={() => dispatch(logoutUser())}
          className="mt-6 w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
