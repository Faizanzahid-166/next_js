import { supabaseServer } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/response";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return errorResponse("Missing userId", 400);

    // ✅ Nested select now works because foreign key exists
    const { data: cartItems, error } = await supabaseServer
      .from("cart_items")
      .select(`
        id,
        product_id,
        quantity,
        01_electroic_gadgets(id, name, price, stock, image_url)
      `)
      .eq("user_id", userId);

    if (error) return errorResponse(error.message, 500);

    // Map cart items to include product details
    const items = cartItems.map((item) => ({
      id: item.id,
      productId: item.product_id,
      quantity: item.quantity,
      name: item["01_electroic_gadgets"].name,
      price: item["01_electroic_gadgets"].price,
      stock: item["01_electroic_gadgets"].stock,
      image_url: item["01_electroic_gadgets"].image_url,
    }));

    return successResponse("Cart fetched", items);
  } catch (err) {
    console.error("FETCH CART ERROR:", err);
    return errorResponse(err.message || "Failed to fetch cart", 500);
  }
}
