import { supabaseServer } from "@/lib/supabase";
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";
import { handleCODPayment } from "@/lib/payments/cod";
import { z } from "zod";

const DELIVERY_FEE = 300;

const orderSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(2, "Full name is required"),
    phone: z.string().min(7, "Valid phone number is required"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    country: z.string().min(2, "Country is required"),
    postalCode: z.string().min(2, "Postal code is required"),
  }),
  paymentMethod: z.string().min(1, "Payment method is required"),
});

export async function POST(req) {
  try {
    const user = await getUserFromCookies(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { shippingAddress, paymentMethod } = parsed.data;
    const method = paymentMethod.toUpperCase();
    if (!["COD", "STRIPE", "PAIKER"].includes(method)) {
      return errorResponse("Invalid payment method", 400);
    }

    // 1️⃣ Fetch cart
    const { data: cart, error: cartError } = await supabaseServer
      .from("03_carts")
      .select("id")
      .eq("user_id", user._id.toString())
      .single();

    if (cartError) return errorResponse(cartError.message, 500);
    if (!cart) return errorResponse("Cart not found", 404);

    // 2️⃣ Fetch cart items with product details
    const { data: cartItems, error: cartItemsError } = await supabaseServer
      .from("03_cart_items")
      .select(`
        product_id,
        quantity,
        03_ecommerce_store_products (
          name,
          price,
          image_url
        )
      `)
      .eq("cart_id", cart.id);

    if (cartItemsError) return errorResponse(cartItemsError.message, 500);
    if (!cartItems?.length) return errorResponse("Cart is empty", 400);

    const items = cartItems.map((item) => ({
      productId: item.product_id,
      name: item["03_ecommerce_store_products"]?.name || "Unknown product",
      price: item["03_ecommerce_store_products"]?.price || 0,
      quantity: item.quantity,
      image_url: item["03_ecommerce_store_products"]?.image_url || "",
    }));

    const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalAmount = subTotal + DELIVERY_FEE;

    // 3️⃣ Insert into 03_orders
    const { data: order, error: orderError } = await supabaseServer
      .from("03_orders")
      .insert({
        user_id: user._id.toString(),
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
        shipping_postal_code: shippingAddress.postalCode,
      })
      .select()
      .single();

    if (orderError) return errorResponse(orderError.message, 500);

    // 4️⃣ Insert into 03_order_items
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

    // 5️⃣ Handle payment
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

    // 6️⃣ Clear cart on success
    if (result?.success) {
      const { error: clearError } = await supabaseServer
        .from("03_cart_items")
        .delete()
        .eq("cart_id", cart.id);

      if (clearError) {
        console.warn("Failed to clear cart after order placement:", clearError);
      }
    }

    return successResponse(result.message, {
      orderId: order.id,
      deliveryFee: DELIVERY_FEE,
      payment: result.data,
    });
  } catch (err) {
    console.error("ORDER CREATE ERROR:", err);
    return errorResponse("Failed to create order", 500);
  }
}
