"use client";

import Link from "next/link";
import { Github, Youtube, Linkedin, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 py-16 px-6 md:px-16 border-t border-neutral-900 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Column 1: Brand Story */}
        <div className="space-y-4">
          <h3 className="text-white font-serif font-semibold text-lg tracking-tight">BLITZ</h3>
          <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
            Designing modern, durable, and highly functional goods for daily life. Crafted with premium sustainable materials.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <Link
              href="https://github.com/Faizanzahid-166"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/faizan-zahid-9671942a6/"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link
              href="https://www.youtube.com/@ProgrammingHub-7107/playlists"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Column 2: Shop Links */}
        <div className="space-y-4">
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Shop</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/products" className="hover:text-white transition-colors">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/products?category=apparel" className="hover:text-white transition-colors">
                Apparel
              </Link>
            </li>
            <li>
              <Link href="/products?category=accessories" className="hover:text-white transition-colors">
                Accessories
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Customer Care */}
        <div className="space-y-4">
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Support</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About Our Brand
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact & Support
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-primary hover:underline flex items-center gap-1">
                <span>Report an Issue</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter Mock */}
        <div className="space-y-4">
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Stay Connected</h4>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Subscribe to receive first access to product drops and stories.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 text-sm text-white w-full focus:outline-none focus:border-neutral-700"
              readOnly
              value="youremail@example.com"
            />
            <button className="bg-white text-black font-semibold text-xs uppercase px-4 py-1.5 rounded hover:bg-neutral-200 transition-colors">
              Join
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Mail className="w-3.5 h-3.5" />
            <Link href="mailto:faizanzahid150@gmail.com" className="hover:underline hover:text-white">
              faizanzahid150@gmail.com
            </Link>
          </div>
        </div>

      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto my-10 border-t border-neutral-900"></div>

      {/* Bottom Area */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-600">
        <div>
          © {new Date().getFullYear()} BLITZ Storefront. All rights reserved.
        </div>

        {/* Trust Badges / Payment Methods */}
        <div className="flex items-center gap-3 grayscale opacity-40">
          <span className="text-[10px] uppercase tracking-wider font-semibold mr-1">COD / EasyPaisa Accepted</span>
          <div className="border border-neutral-800 rounded px-1.5 py-0.5 bg-neutral-900 font-mono font-bold text-[9px]">VISA</div>
          <div className="border border-neutral-800 rounded px-1.5 py-0.5 bg-neutral-900 font-mono font-bold text-[9px]">MC</div>
          <div className="border border-neutral-800 rounded px-1.5 py-0.5 bg-neutral-900 font-mono font-bold text-[9px]">EP</div>
          <div className="border border-neutral-800 rounded px-1.5 py-0.5 bg-neutral-900 font-mono font-bold text-[9px]">COD</div>
        </div>
      </div>
    </footer>
  );
}
