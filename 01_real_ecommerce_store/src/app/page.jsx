"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "@/redux/authSliceTunk/authSlice";
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export default function HomePage() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-neutral-500 text-sm mt-4 animate-pulse">Loading experience...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-border/40 py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-6 animate-fadeIn">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold tracking-wide uppercase">
              <span>✨ New Season Collection</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-neutral-900 leading-[1.15]">
              Designed for modern living.
            </h1>
            
            <p className="text-base sm:text-lg text-neutral-500 max-w-lg leading-relaxed">
              Experience the perfect blend of luxury, simplicity, and durability. Handcrafted accessories made from ethically sourced premium materials.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md shadow hover:bg-primary/95 transition-all"
              >
                <span>Shop the Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              {!user && (
                <Link
                  href="/signup"
                  className="inline-flex items-center px-6 py-3 border border-border text-neutral-800 font-semibold rounded-md hover:bg-secondary transition-colors"
                >
                  Create Account
                </Link>
              )}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-border/50 animate-fadeIn">
            <img
              src="/hero-lifestyle.png"
              alt="Blitz lifestyle setup"
              className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-neutral-900/5 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS */}
      <section className="py-12 bg-secondary/30 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex items-start gap-4 p-4">
            <div className="p-3 bg-white rounded-lg border border-border/50 shadow-sm text-neutral-700">
              <Truck className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 text-sm">Flexible Shipping</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Nationwide Cash on Delivery (COD) and fast shipping updates on every step.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4">
            <div className="p-3 bg-white rounded-lg border border-border/50 shadow-sm text-neutral-700">
              <RefreshCw className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 text-sm">Easy Exchanges</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Not fully in love? Enjoy hassle-free returns and exchanges within 30 days.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4">
            <div className="p-3 bg-white rounded-lg border border-border/50 shadow-sm text-neutral-700">
              <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 text-sm">EasyPaisa Trust</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Secure checkout. Submit delivery deposits instantly via EasyPaisa with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. USER INTERACTION BANNER */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900 text-white rounded-2xl p-8 md:p-16 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left z-10">
            {user ? (
              <>
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Welcome Back</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
                  Good to see you, {user.name}
                </h2>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  You are currently logged in as a <span className="text-white font-medium capitalize">{user.role}</span>. Manage your shopping cart, view transaction receipts, or access the console.
                </p>
              </>
            ) : (
              <>
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Exclusive Access</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
                  Join the Blitz Club
                </h2>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Sign in or create an account to start building your cart, tracking purchases, and receiving member benefits.
                </p>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto z-10 justify-center">
            {user ? (
              <>
                <Link
                  href={user.role === "customer" ? "/customer/dashboard" : "/admin/dashboard"}
                  className="px-6 py-2.5 bg-white text-black font-semibold rounded text-sm text-center hover:bg-neutral-200 transition-colors"
                >
                  Enter Dashboard
                </Link>
                <Link
                  href="/products"
                  className="px-6 py-2.5 bg-neutral-800 text-white border border-neutral-700 font-semibold rounded text-sm text-center hover:bg-neutral-700 transition-colors"
                >
                  View Catalog
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2.5 bg-white text-black font-semibold rounded text-sm text-center hover:bg-neutral-200 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2.5 bg-neutral-800 text-white border border-neutral-700 font-semibold rounded text-sm text-center hover:bg-neutral-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          
          {/* Subtle design element */}
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </section>

      {/* Small fadeIn animation definition */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
