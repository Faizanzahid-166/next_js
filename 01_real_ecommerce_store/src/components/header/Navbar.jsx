"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { logoutUser, fetchUser } from "@/redux/authSliceTunk/authSlice";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Store", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Profile", path: user?.role === "customer" ? "/customer/dashboard" : "/admin/dashboard"  },
    { name: "Cart", path: "/cart" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    dispatch(logoutUser());
    window.location.href = "/";
  };

  return (
    <nav className="bg-gray-700 text-white px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">

        {/* LEFT: LOGO */}
        <div className="text-2xl font-bold">
          Blitz E-Commerce
        </div>

        {/* CENTER: NAV LINKS */}
        <ul className="hidden md:flex gap-8 items-center absolute left-1/2 transform -translate-x-1/2">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.path}
                className="hover:text-red-400 transition"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT: AUTH */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-yellow-300 font-semibold">
                {user.name}
              </span>

              <span className="text-green-300 text-sm">
                {user.role}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-1 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:text-blue-400 transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700 transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU */}
        <MobileMenu
          user={user}
          handleLogout={handleLogout}
          navLinks={navLinks}
        />
      </div>
    </nav>
  );
}
