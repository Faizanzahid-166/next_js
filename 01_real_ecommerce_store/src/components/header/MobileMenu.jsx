"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag } from "lucide-react";

export default function MobileMenu({ navLinks, user, handleLogout, cartCount = 0 }) {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  return (
    <div className="relative md:hidden flex items-center gap-2 ml-auto shrink-0">
      {/* Small cart bag on the mobile bar too for easy access */}
      {user && user.role === "customer" && (
        <Link
          href="/customer/dashboard/cart"
          className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg"
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
        className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all focus:outline-none rounded-xl border border-border/60 bg-background/80 shadow-sm"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute top-full right-0 mt-2 w-[min(280px,calc(100vw-1rem))] bg-background/95 backdrop-blur-md border border-border/80 rounded-2xl shadow-xl p-3 sm:p-4 flex flex-col gap-3 animate-fadeIn z-50">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={closeMenu}
                className="flex items-center justify-between gap-2 py-2.5 px-3 rounded-xl text-sm font-medium hover:bg-secondary text-foreground transition-colors"
              >
                <span>{link.name}</span>
                {link.name === "Cart" && cartCount > 0 && (
                  <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-[10px] font-bold leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="border-t border-border/40 pt-3 flex flex-col gap-2.5">
            {user ? (
              <div className="flex flex-col gap-2.5">
                <div className="px-2 text-xs text-muted-foreground font-medium break-words leading-relaxed">
                  Signed in as <span className="text-foreground">{user.name}</span> ({user.role})
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="w-full bg-secondary hover:bg-secondary/80 text-foreground py-2.5 rounded-xl text-sm font-medium border border-border transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="py-2.5 rounded-xl text-sm font-medium text-center border border-border hover:bg-secondary transition-colors"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium text-center hover:bg-primary/90 transition-colors"
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
