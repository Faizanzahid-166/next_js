"use client";

import { useSelector, useDispatch } from "react-redux";
import { setPage } from "@/redux/productsSliceTunk/productfetchSliceTunk";
import Link from "next/link";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

export default function Product() {
  const dispatch = useDispatch();
  const { items, loading, page, totalPages } = useSelector(
    (state) => state.products
  );

  // 1. LOADING SKELETON STATE
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Header skeleton */}
        <div className="h-8 bg-neutral-200 rounded w-48 mb-8 animate-pulse"></div>

        {/* Product Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="border border-border/40 rounded-xl overflow-hidden bg-white p-4 space-y-4 animate-pulse">
              <div className="w-full aspect-[4/3] bg-neutral-200 rounded-lg"></div>
              <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
              <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. EMPTY STATE
  if (!items || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <span className="text-4xl">🔍</span>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">No products found</h2>
          <p className="text-sm text-neutral-500">
            We couldn't find any products in our database right now. Please check back later.
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/95 transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/40 pb-6 mb-8 gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Catalog</span>
          <h1 className="text-3xl font-serif font-bold text-neutral-900 mt-1">Our Collection</h1>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Showing Page {page} of {totalPages}</span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {items.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group block border border-border/40 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-300"
          >
            {/* Image Container with zoom */}
            <div className="relative w-full aspect-[4/3] bg-neutral-50 overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/5 transition-colors pointer-events-none"></div>
            </div>
            
            {/* Product Meta */}
            <div className="p-5 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">
                {product.category || "General"}
              </span>
              <h3 className="text-base font-serif font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors leading-tight">
                {product.name}
              </h3>
              <p className="text-sm font-semibold text-primary/95 pt-1">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination block */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-12 border-t border-border/40 pt-8">
          <button
            disabled={page <= 1}
            onClick={() => dispatch(setPage(page - 1))}
            className="inline-flex items-center gap-1 px-4 py-2 border border-border rounded-lg text-sm font-medium bg-white hover:bg-secondary text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          
          <span className="text-sm font-medium text-neutral-500">
            {page} / {totalPages}
          </span>
          
          <button
            disabled={page >= totalPages}
            onClick={() => dispatch(setPage(page + 1))}
            className="inline-flex items-center gap-1 px-4 py-2 border border-border rounded-lg text-sm font-medium bg-white hover:bg-secondary text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Next Page"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
