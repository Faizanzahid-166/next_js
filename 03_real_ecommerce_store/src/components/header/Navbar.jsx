"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { logoutUser, fetchUser } from "@/redux/authSliceTunk/authSlice";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Load logged-in user on page refresh
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Store", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Profile", path: "/profile" },
    { name: "Cart", path: "/cart" },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });

    dispatch(logoutUser());
    window.location.href = "/";
  };

  return (
    <nav className="bg-gray-700 text-white px-6 py-4 flex items-center justify-between">
      <div className="text-2xl font-bold">Blitz E-Commerce</div>

      {/* DESKTOP NAV */}
      <ul className="hidden md:flex gap-6 items-center">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link href={link.path} className="hover:text-red-400">
              {link.name}
            </Link>
          </li>
        ))}

        {user ? (
          <>
            <li className="font-semibold text-yellow-300">{user.name}</li>
            <li className="font-semibold text-green-300">{user.role}</li>

            <li>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/signup">Signup</Link></li>
          </>
        )}
      </ul>

      {/* MOBILE MENU */}
      <MobileMenu 
        user={user} 
        handleLogout={handleLogout} 
        navLinks={navLinks} 
      />
    </nav>
  );
}
