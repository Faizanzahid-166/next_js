"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/redux/authSliceTunk/authSlice";
import { useEffect } from "react";
import { fetchUser } from "@/redux/authSliceTunk/authSlice";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname(); // ✅ correct
  const { user, loading } = useSelector((state) => state.auth);

  // Load user before showing dashboard

  useEffect(() => {
    // wait until auth is resolved
    if (loading) return;

    if (!user) {
      dispatch(fetchUser());
      return;
    }

    if (!pathname) return;

    if (user.role === "admin" && !pathname.startsWith("/admin")) {
      router.replace("/admin/dashboard");
    } else if (
      user.role === "customer" &&
      !pathname.startsWith("/customer")
    ) {
      router.replace("/customer/dashboard");
    }
  }, [user, loading, pathname, dispatch, router]);



  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

    const navLinks = [
      { name: "Dashboard", path: "/customer/dashboard" },
      { name: "Cart", path: "/customer/dashboard/cart" },
      { name: "Checkout", path: "/customer/dashboard/orderPlace" },
      { name: "Orders", path: "/customer/dashboard/orders" },
    ];

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Left Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>

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
