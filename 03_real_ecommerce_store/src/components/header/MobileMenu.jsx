"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileMenu({ navLinks, user, handleLogout }) {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  return (
    <div className="md:hidden relative">
      {/* Menu Button */}
      <button
        onClick={toggle}
        className="text-3xl focus:outline-none"
      >
        {open ? "✖" : "☰"}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute top-14 right-0 bg-gray-800 text-white w-56 p-5 rounded-xl shadow-lg flex flex-col gap-4 animate-fadeIn z-50">

          {/* Navigation Links */}
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={closeMenu}
              className="py-2 px-3 rounded hover:bg-gray-600"
            >
              {link.name}
            </Link>
          ))}

          {/* Auth Buttons */}
          {user ? (
            <button
              onClick={() => {
                handleLogout();
                closeMenu();
              }}
              className="bg-red-600 mt-2 py-2 rounded text-center hover:bg-red-700"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                onClick={closeMenu}
                className="py-2 rounded hover:bg-gray-600"
              >
                Login
              </Link>

              <Link
                href="/signup"
                onClick={closeMenu}
                className="py-2 rounded hover:bg-gray-600"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}

      {/* Small fade-in effect */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
