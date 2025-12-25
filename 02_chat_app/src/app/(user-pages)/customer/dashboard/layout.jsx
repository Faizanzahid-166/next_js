"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/redux/authSliceTunk/authSlice";
import { useEffect } from "react";
import { fetchMe } from "@/redux/authSliceTunk/authSlice";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading } = useSelector((state) => state.auth);

  // Load user before showing dashboard
  useEffect(() => {
    if (!user) {
      dispatch(fetchMe());
    } else {
      // Role-based redirect
      if (user.role === "admin") {
        router.replace("/admin/dashboard");
      } else if (user.role === "customer") {
        router.replace("/customer/dashboard");
      } else {
        router.replace("/login"); // fallback
      }
    }
  }, [user, dispatch, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Left Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>

        <nav className="space-y-2">
          <Link className="block px-3 py-2 rounded-lg hover:bg-gray-100" href="/dashboard">
            Profile Overview
          </Link>

          <Link className="block px-3 py-2 rounded-lg hover:bg-gray-100" href="/chat-page">
            My Chat App
          </Link>

          <Link className="block px-3 py-2 rounded-lg hover:bg-gray-100" href="/chat-window">
            chat window
          </Link>

          {user.role === "customer" && (
            <Link
              className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-green-600"
              href="/customer/dashboard/admin-request"
            >
              Request Admin Access
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

      {/* Right Side Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
