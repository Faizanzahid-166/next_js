// Admin-only (Root): create product

import { supabaseServer } from "@/lib/supabase";
import connectDB from "@/lib/dbConnection";
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";

export async function POST(req) {
  await connectDB();

  const user = await getUserFromCookies(req);
  if (!user || user.role !== "admin" || !user.isRoot) {
    return errorResponse("Forbidden", 403);
  }

  const {
    product_no,
    name,
    category,
    price,
    stock,
    description,
    image_url,
  } = await req.json();

  if (!name || price == null) {
    return errorResponse("Name and price are required", 400);
  }

  const { data, error } = await supabaseServer
    .from("ecommerce_store_products")
    .insert([
      {
        product_no,
        name,
        category,
        price,
        stock,
        description,
        image_url,
      },
    ])
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  return successResponse("Product created successfully", data);
}
