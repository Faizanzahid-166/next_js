import { supabaseServer } from "@/lib/supabase";
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";

export async function GET(req) {
  try {
    const user = await getUserFromCookies(req);
    if (!user) return errorResponse("Unauthorized", 401);

    // Fetch orders with their items joined
    const { data: orders, error } = await supabaseServer
      .from("03_orders")
      .select(`
        id,
        total_amount,
        status,
        payment_method,
        payment_status,
        payment_channel,
        transaction_id,
        proof_image,
        sub_total,
        delivery_charge,
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
      .eq("user_id", user._id.toString())
      .order("created_at", { ascending: false });

    if (error) return errorResponse(error.message, 500);

    // Normalize to the shape the frontend expects
    const normalized = (orders || []).map((o) => ({
      _id: o.id,
      id: o.id,
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
      },
    }));

    return successResponse("Orders fetched", { orders: normalized });
  } catch (err) {
    console.error("FETCH ORDERS ERROR:", err);
    return errorResponse("Failed to fetch orders", 500);
  }
}
