// Admin-only (Root): update product

import { supabaseServer } from "@/lib/supabase";
import connectDB from "@/lib/dbConnection";
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";

export async function PUT(req, { params }) {
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

  const { data, error } = await supabaseServer
    .from("ecommerce_store_products")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);
  if (!data) return errorResponse("Product not found", 404);

  return successResponse("Product updated successfully", data);
}