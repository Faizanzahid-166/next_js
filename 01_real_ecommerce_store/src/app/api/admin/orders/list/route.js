// Admin-only: list all orders (transaction history + per-user product history)
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";
import { supabaseServer } from "@/lib/supabase";

export async function GET(req) {
  try {
    const currentUser = await getUserFromCookies(req);
    if (!currentUser) return errorResponse("Unauthorized", 401);

    if (currentUser.role !== "admin" && currentUser.isRoot !== true) {
      return errorResponse("Access denied", 403);
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const paymentStatus = searchParams.get("paymentStatus");
    const orderStatus = searchParams.get("status");
    const paymentMethod = searchParams.get("paymentMethod");

    // Build query
    let query = supabaseServer
      .from("03_orders")
      .select(`
        id,
        user_id,
        status,
        total_amount,
        sub_total,
        delivery_charge,
        payment_method,
        payment_status,
        payment_channel,
        transaction_id,
        proof_image,
        paid_at,
        shipping_full_name,
        shipping_phone,
        shipping_address,
        shipping_city,
        shipping_country,
        shipping_postal_code,
        created_at,
        03_order_items (
          id,
          product_id,
          quantity,
          price_at_purchase,
          03_ecommerce_store_products (
            name,
            image_url
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (userId) query = query.eq("user_id", userId);
    if (paymentStatus) query = query.eq("payment_status", paymentStatus.toUpperCase());
    if (orderStatus) query = query.eq("status", orderStatus.toUpperCase());
    if (paymentMethod) query = query.eq("payment_method", paymentMethod.toUpperCase());

    const { data: orders, error } = await query;
    if (error) return errorResponse(error.message, 500);

    // Normalize to shape frontend expects
    const normalized = (orders || []).map((o) => ({
      _id: o.id,
      id: o.id,
      user_id: o.user_id,
      status: o.status,
      createdAt: o.created_at,
      items: (o["03_order_items"] || []).map((item) => ({
        productId: item.product_id,
        name: item["03_ecommerce_store_products"]?.name || "Unknown product",
        image_url: item["03_ecommerce_store_products"]?.image_url || "",
        price: item.price_at_purchase,
        quantity: item.quantity,
      })),
      shippingAddress: {
        fullName: o.shipping_full_name,
        phone: o.shipping_phone,
        address: o.shipping_address,
        city: o.shipping_city,
        country: o.shipping_country,
        postalCode: o.shipping_postal_code,
      },
      pricing: {
        subTotal: o.sub_total,
        deliveryCharge: o.delivery_charge,
        totalAmount: o.total_amount,
      },
      payment: {
        method: o.payment_method,
        status: o.payment_status,
        channel: o.payment_channel,
        transactionId: o.transaction_id,
        proofImage: o.proof_image,
        paidAt: o.paid_at,
      },
    }));

    return successResponse("Orders fetched successfully", {
      totalOrders: normalized.length,
      orders: normalized,
    });
  } catch (err) {
    console.error("ADMIN LIST ORDERS ERROR:", err);
    return errorResponse(err.message || "Failed to fetch orders", 500);
  }
}
