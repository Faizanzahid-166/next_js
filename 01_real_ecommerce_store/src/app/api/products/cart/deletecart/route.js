import { supabaseServer } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/response";
import { getUserFromCookies } from "@/lib/getUserFromRequest";

export async function DELETE(req) {
  try {
    // 🔐 1️⃣ Get authenticated user (SERVER TRUSTED)
    const user = await getUserFromCookies(req);

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const userId = user._id.toString();

    // 2️⃣ Delete all cart items for this user
    const { data, error } = await supabaseServer
      .from("03_cart_items")
      .delete()
      .eq("user_id", userId)
      .select(); // return deleted rows

    if (error) {
      return errorResponse(error.message, 500);
    }

    return successResponse("Cart cleared", {
      deletedItems: data ? data.length : 0
    });
  } catch (err) {
    console.error("CLEAR CART ERROR:", err);
    return errorResponse("Failed to clear cart", 500);
  }
}

