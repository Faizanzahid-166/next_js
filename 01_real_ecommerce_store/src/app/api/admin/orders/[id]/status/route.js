// Admin-only: verify/update an order's payment status and order status
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";
import { supabaseServer } from "@/lib/supabase";

const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED"];
const ORDER_STATUSES = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    if (!id) return errorResponse("Order ID is required", 400);

    const currentUser = await getUserFromCookies(req);
    if (!currentUser) return errorResponse("Unauthorized", 401);

    if (currentUser.role !== "admin" && currentUser.isRoot !== true) {
      return errorResponse("Access denied", 403);
    }

    const { paymentStatus, orderStatus } = await req.json();

    if (!paymentStatus && !orderStatus) {
      return errorResponse("paymentStatus or orderStatus is required", 400);
    }

    if (paymentStatus && !PAYMENT_STATUSES.includes(paymentStatus.toUpperCase())) {
      return errorResponse("Invalid paymentStatus", 400);
    }

    if (orderStatus && !ORDER_STATUSES.includes(orderStatus.toUpperCase())) {
      return errorResponse("Invalid orderStatus", 400);
    }

    // Verify order exists
    const { data: existing, error: fetchError } = await supabaseServer
      .from("03_orders")
      .select("id")
      .eq("id", id)
      .single();

    if (fetchError || !existing) return errorResponse("Order not found", 404);

    // Build update payload
    const updates = {};
    if (paymentStatus) {
      updates.payment_status = paymentStatus.toUpperCase();
      if (paymentStatus.toUpperCase() === "PAID") {
        updates.paid_at = new Date().toISOString();
      }
    }
    if (orderStatus) {
      updates.status = orderStatus.toUpperCase();
    }

    const { data: updated, error: updateError } = await supabaseServer
      .from("03_orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) return errorResponse(updateError.message, 500);

    // Return normalized order shape for Redux state update
    const order = {
      _id: updated.id,
      id: updated.id,
      user_id: updated.user_id,
      status: updated.status,
      createdAt: updated.created_at,
      pricing: {
        subTotal: updated.sub_total,
        deliveryCharge: updated.delivery_charge,
        totalAmount: updated.total_amount,
      },
      payment: {
        method: updated.payment_method,
        status: updated.payment_status,
        channel: updated.payment_channel,
        transactionId: updated.transaction_id,
        proofImage: updated.proof_image,
        paidAt: updated.paid_at,
      },
    };

    return successResponse("Order updated successfully", { order });
  } catch (err) {
    console.error("ADMIN UPDATE ORDER STATUS ERROR:", err);
    return errorResponse(err.message || "Failed to update order", 500);
  }
}
