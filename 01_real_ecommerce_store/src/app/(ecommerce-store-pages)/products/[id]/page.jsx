import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import { supabaseServer } from "@/lib/supabase";

const BASE_URL = process.env.APP_DOMAIN || "https://ecommerce-store.blitz-box.site";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { id } = await params;

  const { data: product } = await supabaseServer
    .from("03_ecommerce_store_products")
    .select("id, name, description")
    .eq("id", id)
    .single();

  if (!product) {
    return {
      title: "Product not found | Blitz Store",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${product.name} | Blitz Store`,
    description: product.description || "Premium product from Blitz Store.",
    alternates: { canonical: `${BASE_URL}/products/${id}` },
    openGraph: {
      title: product.name,
      description: product.description || "Premium product from Blitz Store.",
      url: `${BASE_URL}/products/${id}`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProductDetailsPage({ params }) {
  const { id } = await params;

  const { data: product, error } = await supabaseServer
    .from("03_ecommerce_store_products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
