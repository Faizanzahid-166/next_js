import { supabaseServer } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/response";

export async function POST(req) {
  try {
    const { productId, quantity = 1, userId } = await req.json();

    if (!productId || !userId) {
      return errorResponse("Missing productId or userId", 400);
    }

    // 1️⃣ Check product exists and stock
    const { data: product, error: productError } = await supabaseServer
      .from("01_electroic_gadgets")
      .select("id, stock")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return errorResponse("Product not found", 404);
    }

    if (product.stock < quantity) {
      return errorResponse("Not enough stock", 400);
    }

    // 2️⃣ Check existing cart item
    const { data: existingItem, error: existingError } = await supabaseServer
      .from("cart_items")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single();

    // 3️⃣ Insert or update
    if (existingItem) {
      const { error: updateError } = await supabaseServer
        .from("cart_items")
        .update({
          quantity: existingItem.quantity + quantity,
        })
        .eq("id", existingItem.id);

      if (updateError) return errorResponse(updateError.message, 500);
    } else {
      const { error: insertError } = await supabaseServer
        .from("cart_items")
        .insert({
          user_id: userId, // MongoDB _id
          product_id: productId,
          quantity,
        });

      if (insertError) return errorResponse(insertError.message, 500);
    }

    return successResponse("Added to cart", {
  productId,
  userId,
  quantity: existingItem ? existingItem.quantity + quantity : quantity,
});
  } catch (err) {
    console.error("CART ERROR:", err);
    return errorResponse(err.message || "Failed to add to cart", 500);
  }
}
