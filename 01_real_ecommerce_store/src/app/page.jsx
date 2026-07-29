import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export const revalidate = 120;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <section className="relative overflow-hidden border-b border-border/40 py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
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
              <Link
                href="/signup"
                className="inline-flex items-center px-6 py-3 border border-border text-neutral-800 font-semibold rounded-md hover:bg-secondary transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-border/50 animate-fadeIn">
            <Image
              src="/hero-lifestyle.png"
              alt="Blitz lifestyle setup"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-neutral-900/5 pointer-events-none"></div>
          </div>
        </div>
      </section>
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
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900 text-white rounded-2xl p-8 md:p-16 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left z-10">
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Exclusive Access</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
              Join the Blitz Club
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Sign in or create an account to start building your cart, tracking purchases, and receiving member benefits.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto z-10 justify-center">
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
          </div>
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </section>
    </div>
  );
}
