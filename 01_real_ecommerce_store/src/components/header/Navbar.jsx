"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { logoutUser, fetchUser } from "@/redux/authSliceTunk/authSlice";
import { fetchCart } from "@/redux/productsSliceTunk/cartSliceTunk";
import MobileMenu from "./MobileMenu";
import { ShoppingBag, User } from "lucide-react";

export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart || { items: [] });

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // Fetch cart when user mounts or logs in
  useEffect(() => {
    if (user && user.role === "customer") {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  const cartCount = items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Store", path: "/products" },
    { name: "About", path: "/about" },
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
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/85 border-b border-border/40 text-foreground transition-all duration-200">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">

        {/* LEFT: LOGO */}
        <Link href="/" className="text-xl font-serif font-semibold tracking-tight hover:opacity-90 transition-opacity">
          BLITZ STORE
        </Link>

        {/* CENTER: NAV LINKS */}
        <ul className="hidden md:flex gap-8 items-center absolute left-1/2 transform -translate-x-1/2">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.path}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT: AUTH & CART */}
        <div className="hidden md:flex items-center gap-5">
          {/* Cart Icon Link for Customers */}
          {user && user.role === "customer" && (
            <Link
              href="/customer/dashboard/cart"
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-primary rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href={user.role === "customer" ? "/customer/dashboard" : "/admin/dashboard"}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/80 hover:bg-secondary text-secondary-foreground text-xs font-medium border border-border/50 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{user.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground ml-0.5">({user.role})</span>
              </Link>

              <button
                onClick={handleLogout}
                className="border border-border text-foreground hover:bg-secondary px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Signup
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE MENU */}
        <MobileMenu
          user={user}
          handleLogout={handleLogout}
          navLinks={[
            ...navLinks,
            { name: "Profile", path: user?.role === "customer" ? "/customer/dashboard" : "/admin/dashboard" },
            { name: "Cart", path: user?.role === "customer" ? "/customer/dashboard/cart" : "/admin/dashboard" }
          ]}
          cartCount={cartCount}
        />
      </div>
    </nav>
  );
}
