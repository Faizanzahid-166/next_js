import { supabaseServer } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/response";
import { getUserFromCookies } from "@/lib/getUserFromRequest";

export async function GET(req) {
  try {
    // 1️⃣ Get authenticated user
    const user = await getUserFromCookies(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const userId = user._id.toString();

    // 2️⃣ Fetch user's cart
    const { data: cart, error: cartError } = await supabaseServer
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (cartError) return errorResponse(cartError.message, 500);
    if (!cart) return successResponse("Cart is empty", []);

    const cartId = cart.id;

    // 3️⃣ Fetch cart items with product join
    const { data: cartItems, error: itemsError } = await supabaseServer
      .from("cart_items")
      .select(`
        id,
        product_id,
        quantity,
        ecommerce_store_products (
          id,
          name,
          price,
          stock,
          image_url
        )
      `)
      .eq("cart_id", cartId);

    if (itemsError) return errorResponse(itemsError.message, 500);
    if (!cartItems || cartItems.length === 0) return successResponse("Cart is empty", []);

    // 4️⃣ Normalize response
    const items = cartItems
      .filter(item => item["ecommerce_store_products"]) // correct join alias
      .map(item => {
        const product = item["ecommerce_store_products"];
        return {
          id: item.id,
          productId: item.product_id,
          quantity: item.quantity,
          name: product.name,
          price: product.price,
          stock: product.stock,
          image_url: product.image_url
        };
      });

    return successResponse("Cart fetched", {
      cartId,
      items
    });
  } catch (err) {
    console.error("FETCH CART ERROR:", err);
    return errorResponse("Failed to fetch cart", 500);
  }
}
