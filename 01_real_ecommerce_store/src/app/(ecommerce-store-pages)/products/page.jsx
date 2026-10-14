import Image from "next/image";
import Link from "next/link";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { supabaseServer } from "@/lib/supabase";
import { getPrimaryImageUrl } from "@/lib/productImages";

const BASE_URL = process.env.APP_DOMAIN || "https://ecommerce-store.blitz-box.site";

export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: "Products | Blitz Store",
    description: "Browse our curated product catalog from Blitz Store. Quality essentials, everyday favorites, and premium picks.",
    alternates: { canonical: `${BASE_URL}/products` },
    robots: { index: true, follow: true },
  };
}

async function fetchProductsPageData(page = 1, limit = 24) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabaseServer
    .from("03_ecommerce_store_products")
    .select("id, name, price, image_url, category, created_at, stock, description", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }

  return {
    items: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export default async function ProductsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page || 1);

  let products = { items: [], total: 0, page: 1, limit: 24, totalPages: 0 };
  try {
    products = await fetchProductsPageData(page || 1, 24);
  } catch (error) {
    console.error("Products page fetch failed:", error);
  }

  const { items, totalPages } = products;

  if (!items || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <span className="text-4xl">🔍</span>
          <h1 className="text-2xl font-serif font-bold text-neutral-900">No products found</h1>
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/40 pb-6 mb-8 gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Catalog</span>
          <h1 className="text-3xl font-serif font-bold text-neutral-900 mt-1">Our Collection</h1>
          <p className="text-sm text-neutral-500 mt-2">Discover our latest products and everyday essentials.</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Showing Page {products.page} of {totalPages}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {items.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group block border border-border/40 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-300"
          >
            <div className="relative w-full aspect-[3/4] bg-neutral-50/90 overflow-hidden flex items-center justify-center p-2">
              <Image
                src={getPrimaryImageUrl(product)}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
                className="object-contain p-4 sm:p-5 transition-transform duration-500 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/5 transition-colors pointer-events-none"></div>
            </div>

            <div className="p-5 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">{product.category || "General"}</span>
              <h2 className="text-base font-serif font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors leading-tight">{product.name}</h2>
              <p className="text-sm font-semibold text-primary/95 pt-1">Rs. {product.price?.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-12 border-t border-border/40 pt-8">
          <Link
            href={`/products?page=${Math.max(1, products.page - 1)}`}
            className={`inline-flex items-center gap-1 px-4 py-2 border border-border rounded-lg text-sm font-medium bg-white hover:bg-secondary text-neutral-800 ${products.page <= 1 ? "opacity-40 pointer-events-none" : ""}`}
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Link>

          <span className="text-sm font-medium text-neutral-500">{products.page} / {totalPages}</span>

          <Link
            href={`/products?page=${Math.min(totalPages, products.page + 1)}`}
            className={`inline-flex items-center gap-1 px-4 py-2 border border-border rounded-lg text-sm font-medium bg-white hover:bg-secondary text-neutral-800 ${products.page >= totalPages ? "opacity-40 pointer-events-none" : ""}`}
            aria-label="Next Page"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
