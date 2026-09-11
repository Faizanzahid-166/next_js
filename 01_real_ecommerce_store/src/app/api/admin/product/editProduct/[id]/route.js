// Admin-only (Root): update product

import { supabaseServer } from "@/lib/supabase";
import connectDB from "@/lib/dbConnection";
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { rateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { successResponse, errorResponse } from "@/lib/response";

export async function PUT(req, { params }) {
  const limit = rateLimit(req, "admin:update-product", 20, 60_000);
  if (limit.limited) return rateLimitResponse(limit);

  await connectDB();

  const user = await getUserFromCookies(req);
  if (!user || user.role !== "admin" || !user.isRoot) {
    return errorResponse("Forbidden", 403);
  }

  // ✅ Await params because in Next.js App Router it's a Promise
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id) return errorResponse("Product ID is required", 400);

  const body = await req.json();

  const updateData = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.category !== undefined) updateData.category = body.category;
  if (body.price !== undefined && body.price !== "") updateData.price = Number(body.price);
  if (body.stock !== undefined && body.stock !== "") updateData.stock = parseInt(body.stock, 10) || 0;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.product_no !== undefined && body.product_no !== "") updateData.product_no = parseInt(body.product_no, 10);
  
  if (Array.isArray(body.images)) {
    const valid = body.images.filter((img) => typeof img === "string" && img.trim() !== "");
    updateData.image_url = valid.length > 1 ? JSON.stringify(valid) : (valid[0] || null);
  } else if (body.image_url !== undefined && body.image_url) {
    updateData.image_url = body.image_url;
  }

  const { data, error } = await supabaseServer
    .from("03_ecommerce_store_products")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);
  if (!data) return errorResponse("Product not found", 404);

  return successResponse("Product updated successfully", data);
}