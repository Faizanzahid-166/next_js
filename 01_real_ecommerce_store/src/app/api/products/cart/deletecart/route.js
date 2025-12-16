import { supabaseServer } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/response";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) return errorResponse("Missing userId", 400);

    const { error } = await supabaseServer
      .from("cart_items")
      .delete()
      .eq("user_id", userId);

    if (error) return errorResponse(error.message, 500);

    return successResponse("Cart cleared");
  } catch (err) {
    console.error("CLEAR CART ERROR:", err);
    return errorResponse(err.message || "Failed to clear cart", 500);
  }
}
