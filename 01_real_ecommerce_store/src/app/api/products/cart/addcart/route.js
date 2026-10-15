import { supabaseServer } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/response";
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { calculateNextCartQuantity } from "@/lib/cartQuantity.mjs";

export async function POST(req) {
  try {
    const user = await getUserFromCookies(req);
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await req.json();
    const { productId, quantity = 1 } = body;
    if (!productId) {
      return errorResponse("Missing productId", 400);
    }

    const delta = Number(quantity);
    if (!Number.isFinite(delta) || delta === 0) {
      return errorResponse("Quantity must be a non-zero number", 400);
    }

    const userId = user._id.toString();

    const { data: product, error: productError } = await supabaseServer
      .from("03_ecommerce_store_products")
      .select("id, stock")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return errorResponse("Product not found", 404);
    }

    let { data: cart, error: cartFetchError } = await supabaseServer
      .from("03_carts")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (cartFetchError) {
      return errorResponse(cartFetchError.message, 500);
    }

    if (!cart) {
      const { data: newCart, error: cartError } = await supabaseServer
        .from("03_carts")
        .insert({ user_id: userId })
        .select()
        .single();

      if (cartError) {
        return errorResponse(cartError.message, 500);
      }

      cart = newCart;
    }

    const cartId = cart.id;
    const { data: existingItem, error: existingItemError } = await supabaseServer
      .from("03_cart_items")
      .select("*")
      .eq("cart_id", cartId)
      .eq("product_id", productId)
      .maybeSingle();

    if (existingItemError) {
      return errorResponse(existingItemError.message, 500);
    }

    if (existingItem) {
      const nextQuantity = calculateNextCartQuantity({
        currentQuantity: existingItem.quantity,
        delta,
        stock: product.stock,
      });

      if (nextQuantity <= 0) {
        await supabaseServer.from("03_cart_items").delete().eq("id", existingItem.id);
        return successResponse("Item removed from cart", {
          cartId,
          productId,
          quantity: 0,
          items: [],
        });
      }

      const { error } = await supabaseServer
        .from("03_cart_items")
        .update({ quantity: nextQuantity })
        .eq("id", existingItem.id);

      if (error) {
        return errorResponse(error.message, 500);
      }
    } else {
      const nextQuantity = calculateNextCartQuantity({ currentQuantity: 0, delta, stock: product.stock });
      if (nextQuantity <= 0) {
        return errorResponse("Not enough stock", 400);
      }

      const { error } = await supabaseServer.from("03_cart_items").insert({
        cart_id: cartId,
        product_id: productId,
        quantity: nextQuantity,
        user_id: userId,
      });

      if (error) {
        return errorResponse(error.message, 500);
      }
    }

    const { data: cartItems, error: cartItemsError } = await supabaseServer
      .from("03_cart_items")
      .select(`
        id,
        product_id,
        quantity,
        03_ecommerce_store_products (
          id,
          name,
          price,
          stock,
          image_url
        )
      `)
      .eq("cart_id", cartId);

    if (cartItemsError) {
      return errorResponse(cartItemsError.message, 500);
    }

    const items = (cartItems || []).map((item) => {
      const productInfo = item["03_ecommerce_store_products"];
      return {
        id: item.id,
        productId: item.product_id,
        quantity: item.quantity,
        name: productInfo?.name,
        price: productInfo?.price,
        stock: productInfo?.stock,
        image_url: productInfo?.image_url,
      };
    });

    return successResponse("Cart updated", { cartId, items });
  } catch (err) {
    console.error("CART ERROR:", err);
    return errorResponse("Failed to update cart", 500);
  }
}

