// /api/products/[id]/route.js
import { supabaseServer } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/response";

export async function GET(req, { params }) {
  try {
    console.log("➡️ GET PRODUCT REQUEST");

    // ✅ FIX: params is a Promise in Next 15
    const resolvedParams = await params;
    console.log("📦 Resolved params:", resolvedParams);

    const { id } = resolvedParams;
    console.log("🆔 Raw param id:", id, "type:", typeof id);

    if (!id || typeof id !== "string") {
      console.error("❌ Invalid product id");
      return errorResponse("Invalid product id", 400);
    }

    const { data, error } = await supabaseServer
      .from("03_ecommerce_store_products")
      .select("*")
      .eq("id", id)
      .single();

    console.log("📦 Product data:", data);
    console.log("⚠️ Supabase error:", error);

    if (error || !data) {
      return errorResponse("Product not found", 404);
    }

    return successResponse("Product details", data);
  } catch (err) {
    console.error("🔥 GET PRODUCT ERROR:", err);
    return errorResponse("Failed to fetch product", 500);
  }
}
