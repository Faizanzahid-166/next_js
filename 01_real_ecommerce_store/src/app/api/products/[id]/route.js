export const runtime = "edge";

// /api/products/[id]/route.js
import { supabaseServer } from "@/lib/supabase";
import { successResponse, errorResponse, cacheHeaders } from "@/lib/response";

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id || typeof id !== "string") {
      console.error("❌ Invalid product id");
      return errorResponse("Invalid product id", 400);
    }

    const { data, error } = await supabaseServer
      .from("03_ecommerce_store_products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return errorResponse("Product not found", 404);
    }

    return successResponse(
      "Product details",
      data,
      200,
      cacheHeaders({ maxAge: 60, sMaxAge: 60, staleWhileRevalidate: 300 })
    );
  } catch (err) {
    console.error("🔥 GET PRODUCT ERROR:", err);
    return errorResponse("Failed to fetch product", 500);
  }
}
