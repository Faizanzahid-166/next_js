// Admin-only (Root): create product

import { supabaseServer } from "@/lib/supabase";
import connectDB from "@/lib/dbConnection";
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { rateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { successResponse, errorResponse } from "@/lib/response";

export async function POST(req) {
  const limit = rateLimit(req, "admin:insert-product", 20, 60_000);
  if (limit.limited) return rateLimitResponse(limit);

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
    images,
  } = await req.json();

  if (!name || price == null) {
    return errorResponse("Name and price are required", 400);
  }

  // Normalize images list into a JSON string if multiple images are provided
  let imageList = [];
  if (Array.isArray(images) && images.length > 0) {
    imageList = images.filter((img) => typeof img === "string" && img.trim() !== "");
  } else if (image_url && typeof image_url === "string") {
    imageList = [image_url.trim()];
  }

  const finalImageUrl = imageList.length > 1 ? JSON.stringify(imageList) : (imageList[0] || null);

  let parsedProductNo = parseInt(product_no, 10);
  if (isNaN(parsedProductNo) || !parsedProductNo) {
    parsedProductNo = Math.floor(Date.now() / 1000) % 2147483647;
  }

  const parsedPrice = Number(price);
  const parsedStock = parseInt(stock, 10) || 0;

  const insertData = {
    product_no: parsedProductNo,
    name,
    category: category || null,
    price: parsedPrice,
    stock: parsedStock,
    description: description || null,
    image_url: finalImageUrl,
  };

  const { data, error } = await supabaseServer
    .from("03_ecommerce_store_products")
    .insert([insertData])
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  return successResponse("Product created successfully", data);
}

