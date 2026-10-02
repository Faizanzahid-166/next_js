import { supabaseServer } from "@/lib/supabase";
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";
import { handleCODPayment } from "@/lib/payments/cod";
import { z } from "zod";

const DELIVERY_FEE = 300;

// ---------------------------------------------------------------------------
// Validation schemas
// ---------------------------------------------------------------------------

const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(7, "Valid phone number is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  // postalCode is optional for guest orders
  postalCode: z.string().optional().default(""),
});

/** Schema for authenticated orders (cart lives in DB) */
const authOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.string().min(1, "Payment method is required"),
});

/** Schema for guest orders (cart items provided in body) */
const guestOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.string().min(1, "Payment method is required"),
  guestCart: z
    .array(
      z.object({
        productId: z.string().min(1, "productId is required"),
        quantity: z.number().int().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "Cart cannot be empty"),
});

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req) {
  try {
    const user = await getUserFromCookies(req);
    const body = await req.json();

    // ------------------------------------------------------------------
    // Branch A: Authenticated order
    // ------------------------------------------------------------------
    if (user) {
      const parsed = authOrderSchema.safeParse(body);
      if (!parsed.success) {
        return errorResponse(parsed.error.errors[0].message, 400);
      }

      const { shippingAddress, paymentMethod } = parsed.data;
      const method = paymentMethod.toUpperCase();
      if (!["COD", "STRIPE", "PAIKER"].includes(method)) {
        return errorResponse("Invalid payment method", 400);
      }

      // 1. Fetch the user's cart
      const { data: cart, error: cartError } = await supabaseServer
        .from("03_carts")
        .select("id")
        .eq("user_id", user._id.toString())
        .single();

      if (cartError) return errorResponse(cartError.message, 500);
      if (!cart) return errorResponse("Cart not found", 404);

      // 2. Fetch cart items with server-side product details (price / stock)
      const { data: cartItems, error: cartItemsError } = await supabaseServer
        .from("03_cart_items")
        .select(`
          product_id,
          quantity,
          03_ecommerce_store_products (
            name,
            price,
            stock,
            image_url
          )
        `)
        .eq("cart_id", cart.id);

      if (cartItemsError) return errorResponse(cartItemsError.message, 500);
      if (!cartItems?.length) return errorResponse("Cart is empty", 400);

      // Validate stock server-side
      for (const item of cartItems) {
        const product = item["03_ecommerce_store_products"];
        if (!product) return errorResponse("One or more products not found", 404);
        if (item.quantity > product.stock) {
          return errorResponse(
            `Insufficient stock for "${product.name}". Available: ${product.stock}`,
            400
          );
        }
      }

      const items = cartItems.map((item) => ({
        productId: item.product_id,
        name: item["03_ecommerce_store_products"]?.name || "Unknown product",
        price: item["03_ecommerce_store_products"]?.price || 0,
        quantity: item.quantity,
        image_url: item["03_ecommerce_store_products"]?.image_url || "",
      }));

      const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const totalAmount = subTotal + DELIVERY_FEE;

      return await createOrderAndRespond({
        userId: user._id.toString(),
        items,
        shippingAddress,
        method,
        subTotal,
        totalAmount,
        cartIdToClear: cart.id,
      });
    }

    // ------------------------------------------------------------------
    // Branch B: Guest order
    // ------------------------------------------------------------------
    const parsed = guestOrderSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { shippingAddress, paymentMethod, guestCart } = parsed.data;
    const method = paymentMethod.toUpperCase();
    if (!["COD", "STRIPE", "PAIKER"].includes(method)) {
      return errorResponse("Invalid payment method", 400);
    }

    // Verify every product from the DB — never trust client prices / stock
    const productIds = [...new Set(guestCart.map((i) => i.productId))];
    const { data: dbProducts, error: productsError } = await supabaseServer
      .from("03_ecommerce_store_products")
      .select("id, name, price, stock, image_url")
      .in("id", productIds);

    if (productsError) return errorResponse(productsError.message, 500);

    // Build a lookup map
    const productMap = Object.fromEntries((dbProducts || []).map((p) => [p.id, p]));

    const resolvedItems = [];
    for (const cartItem of guestCart) {
      const product = productMap[cartItem.productId];
      if (!product) {
        return errorResponse(`Product ${cartItem.productId} not found`, 404);
      }
      if (cartItem.quantity > product.stock) {
        return errorResponse(
          `Insufficient stock for "${product.name}". Available: ${product.stock}`,
          400
        );
      }
      resolvedItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,  // use server price
        quantity: cartItem.quantity,
        image_url: product.image_url || "",
      });
    }

    const subTotal = resolvedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalAmount = subTotal + DELIVERY_FEE;

    return await createOrderAndRespond({
      userId: null, // guest: no user account
      guestInfo: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        country: shippingAddress.country,
      },
      items: resolvedItems,
      shippingAddress,
      method,
      subTotal,
      totalAmount,
      cartIdToClear: null, // guest cart lives in localStorage, cleared on frontend
    });
  } catch (err) {
    console.error("ORDER CREATE ERROR:", err);
    return errorResponse("Failed to create order", 500);
  }
}

// ---------------------------------------------------------------------------
// Shared helper: insert order + items, handle payment, return response
// ---------------------------------------------------------------------------

async function createOrderAndRespond({
  userId,
  guestInfo = null,
  items,
  shippingAddress,
  method,
  subTotal,
  totalAmount,
  cartIdToClear,
}) {
  // 1. Insert order row
  const { data: order, error: orderError } = await supabaseServer
    .from("03_orders")
    .insert({
      user_id: userId || null,
      is_guest: !userId,
      guest_name: guestInfo?.fullName || null,
      guest_phone: guestInfo?.phone || null,
      guest_address: guestInfo?.address || null,
      guest_city: guestInfo?.city || null,
      guest_country: guestInfo?.country || null,
      total_amount: totalAmount,
      status: "PLACED",
      payment_method: method,
      payment_status: method === "COD" ? "PENDING" : "PAID",
      payment_channel: null,
      transaction_id: null,
      proof_image: null,
      sub_total: subTotal,
      delivery_charge: DELIVERY_FEE,
      shipping_full_name: shippingAddress.fullName,
      shipping_phone: shippingAddress.phone,
      shipping_address: shippingAddress.address,
      shipping_city: shippingAddress.city,
      shipping_country: shippingAddress.country,
      shipping_postal_code: shippingAddress.postalCode || "",
    })
    .select()
    .single();

  if (orderError) return errorResponse(orderError.message, 500);

  // 2. Insert order items
  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    price_at_purchase: item.price,
  }));

  const { error: itemsError } = await supabaseServer
    .from("03_order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Failed to insert order items:", itemsError);
  }

  // 3. Handle payment
  const codOrder = {
    id: order.id,
    pricing: { deliveryCharge: DELIVERY_FEE },
  };

  let result;
  switch (method) {
    case "COD":
      result = await handleCODPayment(codOrder);
      break;
    default:
      return errorResponse("Invalid payment method", 400);
  }

  // 4. Clear the authenticated user's DB cart on success
  if (result?.success && cartIdToClear) {
    const { error: clearError } = await supabaseServer
      .from("03_cart_items")
      .delete()
      .eq("cart_id", cartIdToClear);

    if (clearError) {
      console.warn("Failed to clear cart after order placement:", clearError);
    }
  }

  return successResponse(result.message, {
    orderId: order.id,
    isGuest: !userId,
    deliveryFee: DELIVERY_FEE,
    payment: result.data,
  });
}
