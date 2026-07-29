"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, fetchUser } from "@/redux/authSliceTunk/authSlice";
import {
  LayoutDashboard,
  PackagePlus,
  Users,
  ReceiptText,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const navLinks = [
  { name: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Insert Product", path: "/admin/dashboard/insertProduct", icon: PackagePlus },
  { name: "User Roles", path: "/admin/dashboard/adminUserRole", icon: Users },
  { name: "Orders & Transactions", path: "/admin/dashboard/orders", icon: ReceiptText },
];

export default function AdminDashboardLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!loading && user) {
      if (user.role !== "admin") {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-400 animate-pulse">Loading admin panel…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-neutral-50 font-sans">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 w-64 bg-neutral-950 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
          <Link
            href="/"
            className="text-base font-serif font-bold text-white tracking-tight hover:opacity-80 transition-opacity"
          >
            BLITZ STORE
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-neutral-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Identity */}
        <div className="px-6 py-5 border-b border-neutral-800 space-y-1">
          <div className="w-10 h-10 rounded-full bg-neutral-800 text-white flex items-center justify-center text-sm font-bold font-serif">
            {user.name?.[0]?.toUpperCase() || "A"}
          </div>
          <p className="font-semibold text-sm text-white mt-2 leading-tight">{user.name}</p>
          <p className="text-[10px] text-neutral-500 truncate">{user.email}</p>
          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold bg-neutral-800 text-neutral-400 border border-neutral-700">
            <ShieldCheck className="w-2.5 h-2.5" />
            {user.isRoot ? "Root Admin" : "Admin"}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-white text-neutral-950"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-neutral-950" : "text-neutral-500 group-hover:text-neutral-300"}`} />
                <span className="flex-1">{link.name}</span>
                {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
              </Link>
            );
          })}

          {/* Root-only settings link */}
          {user.isRoot && (
            <Link
              href="/admin/dashboard/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-all"
            >
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Root Settings</span>
            </Link>
          )}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-neutral-800">
          <button
            onClick={() => dispatch(logoutUser())}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-8 py-3.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-neutral-400 hover:text-white transition-colors p-1"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="font-semibold text-white">Admin Operations</span>
              <span>/</span>
              <span className="capitalize">{pathname?.split("/").pop() || "Dashboard"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium bg-neutral-800 border border-neutral-700 text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live System</span>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium border border-neutral-700 transition-all"
            >
              <span>Storefront</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
