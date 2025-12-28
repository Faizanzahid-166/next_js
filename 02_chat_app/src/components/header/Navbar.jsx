"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchMe, logoutUser } from "@/redux/authSliceTunk/authSlice";
import MobileMenu from "./MobileMenu";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  

  // Fetch user once on mount
  useEffect(() => {
    if (!user) {
      dispatch(fetchMe());
    }
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/login");
  };

  // Dashboard path based on role
  const profilePath = user
    ? user.role === "admin"
      ? "/admin/dashboard"
      : "/customer/dashboard"
    : "/login";

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
     { name: "Contact", path: "/contact" },
    { name: "Profile", path: profilePath },
  ];

  return (
    <nav className="bg-black text-white px-6 py-4 flex items-center">
      {/* Logo */}
      <div className="text-2xl font-bold flex-shrink-0">Blitz Chat App</div>

      {/* Center links */}
      <ul className="flex-1 flex justify-center gap-6">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link href={link.path} className="hover:text-red-400">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="font-semibold text-yellow-300">{user.name}</span>
            <span className="font-semibold text-green-300 capitalize">{user.role}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-red-400">
              Login
            </Link>
            <Link href="/signup" className="hover:text-red-400">
              Signup
            </Link>
          </>
        )}

        {/* Mobile menu */}
        <MobileMenu user={user} handleLogout={handleLogout} navLinks={navLinks} />
      </div>
    </nav>
  );
}
