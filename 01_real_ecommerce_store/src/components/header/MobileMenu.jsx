"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag } from "lucide-react";

export default function MobileMenu({ navLinks, user, handleLogout, cartCount = 0 }) {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  return (
    <div className="relative md:hidden flex items-center gap-2 ml-auto">
      {/* Small cart bag on the mobile bar too for easy access */}
      {user && user.role === "customer" && (
        <Link
          href="/customer/dashboard/cart"
          className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md"
          onClick={closeMenu}
          aria-label="Open cart"
        >
          <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold leading-none text-white bg-primary rounded-full transform translate-x-1/3 -translate-y-1/3">
              {cartCount}
            </span>
          )}
        </Link>
      )}

      {/* Menu Button */}
      <button
        onClick={toggle}
        className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus:outline-none rounded-md"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute top-full right-0 left-0 mt-2 bg-background/95 backdrop-blur-md border border-border/80 rounded-xl shadow-lg p-4 flex flex-col gap-4 animate-fadeIn z-50">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={closeMenu}
                className="py-2.5 px-3 rounded-md text-sm font-medium hover:bg-secondary text-foreground transition-colors flex justify-between items-center"
              >
                <span>{link.name}</span>
                {link.name === "Cart" && cartCount > 0 && (
                  <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="border-t border-border/40 pt-4 flex flex-col gap-3">
            {user ? (
              <div className="flex flex-col gap-2">
                <div className="px-3 text-xs text-muted-foreground font-medium break-words">
                  Signed in as <span className="text-foreground">{user.name}</span> ({user.role})
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="w-full bg-secondary hover:bg-secondary/80 text-foreground py-2 rounded-md text-sm font-medium border border-border transition-colors mt-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="py-2 rounded-md text-sm font-medium text-center border border-border hover:bg-secondary transition-colors"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium text-center hover:bg-primary/90 transition-colors"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
