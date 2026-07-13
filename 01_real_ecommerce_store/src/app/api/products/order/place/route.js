import dbConnect from "@/lib/dbConnection";
import Order from "@/models/Order.model";
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
  await dbConnect();

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

    const { data: cart, error: cartError } = await supabaseServer
      .from("carts")
      .select("id")
      .eq("user_id", user._id.toString())
      .single();

    if (cartError) return errorResponse(cartError.message, 500);
    if (!cart) return errorResponse("Cart not found", 404);

    const { data: cartItems, error: cartItemsError } = await supabaseServer
      .from("cart_items")
      .select(`
        product_id,
        quantity,
        ecommerce_store_products (
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
      name: item.ecommerce_store_products?.name || "Unknown product",
      price: item.ecommerce_store_products?.price || 0,
      quantity: item.quantity,
      image_url: item.ecommerce_store_products?.image_url || "",
    }));

    const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalAmount = subTotal + DELIVERY_FEE;

    const order = await Order.create({
      userId: user._id,
      items,
      shippingAddress,
      pricing: {
        subTotal,
        deliveryCharge: DELIVERY_FEE,
        discount: 0,
        totalAmount,
      },
      payment: {
        method,
        status: method === "COD" ? "PENDING" : "PAID",
        channel: null,
      },
      status: "PLACED",
    });

    let result;
    switch (method) {
      case "COD":
        result = await handleCODPayment(order);
        break;
      default:
        return errorResponse("Invalid payment method", 400);
    }

    if (result?.success) {
      const { error: clearError } = await supabaseServer
        .from("cart_items")
        .delete()
        .eq("cart_id", cart.id);

      if (clearError) {
        console.warn("Failed to clear cart after order placement:", clearError);
      }
    }

    return successResponse(result.message, {
      orderId: order._id,
      deliveryFee: DELIVERY_FEE,
      payment: result.data,
    });
  } catch (err) {
    console.error("ORDER CREATE ERROR:", err);
    return errorResponse("Failed to create order", 500);
  }
}
