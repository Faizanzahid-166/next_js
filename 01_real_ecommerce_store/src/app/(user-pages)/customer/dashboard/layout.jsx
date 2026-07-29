"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, fetchUser } from "@/redux/authSliceTunk/authSlice";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Package,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const navLinks = [
  { name: "Dashboard", path: "/customer/dashboard", icon: LayoutDashboard },
  { name: "My Cart", path: "/customer/dashboard/cart", icon: ShoppingCart },
  { name: "Checkout", path: "/customer/dashboard/orderPlace", icon: CreditCard },
  { name: "My Orders", path: "/customer/dashboard/orders", icon: Package },
];

export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      dispatch(fetchUser());
      return;
    }
    if (!pathname) return;
    if (user.role === "admin" && !pathname.startsWith("/admin")) {
      router.replace("/admin/dashboard");
    } else if (user.role === "customer" && !pathname.startsWith("/customer")) {
      router.replace("/customer/dashboard");
    }
  }, [user, loading, pathname, dispatch, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-400 animate-pulse">Loading your dashboard…</p>
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
        className={`fixed top-0 left-0 h-full z-40 w-64 bg-white border-r border-border/40 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="px-6 py-5 border-b border-border/40 flex items-center justify-between">
          <Link
            href="/"
            className="text-base font-serif font-bold text-neutral-900 tracking-tight hover:opacity-80 transition-opacity"
          >
            BLITZ STORE
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity */}
        <div className="px-6 py-5 border-b border-border/40 space-y-1">
          <div className="w-10 h-10 rounded-full bg-neutral-950 text-white flex items-center justify-center text-sm font-bold font-serif">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <p className="font-semibold text-sm text-neutral-900 mt-2 leading-tight">{user.name}</p>
          <p className="text-[10px] text-neutral-400 truncate">{user.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold bg-neutral-100 text-neutral-500 border border-border/40">
            Customer
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
                    ? "bg-neutral-950 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-neutral-400 group-hover:text-neutral-700"}`} />
                <span className="flex-1">{link.name}</span>
                {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-border/40">
          <button
            onClick={() => dispatch(logoutUser())}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-border/40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-neutral-500 hover:text-neutral-900 transition-colors p-1"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="font-semibold text-neutral-900">Customer Portal</span>
              <span>/</span>
              <span className="capitalize">{pathname?.split("/").pop() || "Dashboard"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all"
            >
              <span>Visit Storefront</span>
              <ChevronRight className="w-3.5 h-3.5" />
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
