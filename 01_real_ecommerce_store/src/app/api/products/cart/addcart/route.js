import { supabaseServer } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/response";
import { getUserFromCookies } from "@/lib/getUserFromRequest";

export async function POST(req) {
  try {
    console.log("➡️ ADD TO CART REQUEST RECEIVED");

    // 🔐 1️⃣ Get authenticated user
    const user = await getUserFromCookies(req);
    console.log("👤 User:", user);

    if (!user) {
      console.error("❌ Unauthorized user");
      return errorResponse("Unauthorized", 401);
    }

    const body = await req.json();
    console.log("📦 Request body:", body);

    const { productId, quantity = 1 } = body;
    if (!productId) {
      console.error("❌ Missing productId");
      return errorResponse("Missing productId", 400);
    }

    const userId = user._id.toString();
    console.log("🆔 userId:", userId);
    console.log("🛒 productId:", productId, "type:", typeof productId);

    // 2️⃣ Check product & stock
    const { data: product, error: productError } = await supabaseServer
      .from("03_ecommerce_store_products")
      .select("id, stock")
      .eq("id", productId)
      .single();

    console.log("📦 Product lookup:", product);
    console.log("⚠️ Product error:", productError);

    if (productError || !product) {
      console.error("❌ Product not found");
      return errorResponse("Product not found", 404);
    }

    if (quantity > product.stock) {
      console.error("❌ Not enough stock");
      return errorResponse("Not enough stock", 400);
    }

    // 3️⃣ Fetch or create the user's cart
    let { data: cart, error: cartFetchError } = await supabaseServer
      .from("03_carts")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    console.log("🛒 Existing cart:", cart);
    console.log("⚠️ Cart fetch error:", cartFetchError);

    if (!cart) {
      console.log("➕ Creating new cart");

      const { data: newCart, error: cartError } = await supabaseServer
        .from("03_carts")
        .insert({ user_id: userId })
        .select()
        .single();

      if (cartError) {
        console.error("❌ Cart create error:", cartError);
        return errorResponse(cartError.message, 500);
      }

      cart = newCart;
      console.log("✅ New cart created:", cart);
    }

    const cartId = cart.id;
    console.log("🆔 cartId:", cartId);

    // 4️⃣ Check existing cart item
    const { data: existingItem, error: existingItemError } =
      await supabaseServer
        .from("03_cart_items")
        .select("*")
        .eq("cart_id", cartId)
        .eq("product_id", productId)
        .maybeSingle();

    console.log("📄 Existing cart item:", existingItem);
    console.log("⚠️ Existing item error:", existingItemError);

    // 5️⃣ Remove item if quantity <= 0
    if (quantity <= 0 && existingItem) {
      console.log("🗑 Removing item from cart");

      await supabaseServer
        .from("03_cart_items")
        .delete()
        .eq("id", existingItem.id);

      return successResponse("Item removed from cart", {
        cartId,
        productId,
        quantity: 0,
      });
    }

    // 6️⃣ Update or insert
    if (existingItem) {
      console.log("✏️ Updating cart item quantity");

      const { error } = await supabaseServer
        .from("03_cart_items")
        .update({ quantity })
        .eq("id", existingItem.id);

      if (error) {
        console.error("❌ Update error:", error);
        return errorResponse(error.message, 500);
      }
    } else {
      console.log("➕ Inserting new cart item", {
        cartId,
        userId,
        productId,
        quantity,
      });

      const { error } = await supabaseServer.from("03_cart_items").insert({
        cart_id: cartId,
        product_id: productId,
        quantity,
        user_id: userId,
      });

      if (error) {
        console.error("❌ Insert error:", error);
        return errorResponse(error.message, 500);
      }
    }

    // 7️⃣ Fetch updated cart items
    const { data: cartItems, error: cartItemsError } =
      await supabaseServer
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

    console.log("🛍 Cart items:", cartItems);
    console.log("⚠️ Cart items error:", cartItemsError);

    if (cartItemsError) {
      return errorResponse(cartItemsError.message, 500);
    }

    // 8️⃣ Return full cart
    const items = cartItems.map(item => {
      const product = item["03_ecommerce_store_products"]; // ✅ FIXED NAME
      return {
        id: item.id,
        productId: item.product_id,
        quantity: item.quantity,
        name: product?.name,
        price: product?.price,
        stock: product?.stock,
        image_url: product?.image_url,
      };
    });

    console.log("✅ FINAL CART RESPONSE:", items);

    return successResponse("Cart updated", { cartId, items });
  } catch (err) {
    console.error("🔥 CART ERROR:", err);
    return errorResponse("Failed to update cart", 500);
  }
}

