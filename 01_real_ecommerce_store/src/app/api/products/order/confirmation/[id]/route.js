import { supabaseServer } from "@/lib/supabase";
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    if (!id || typeof id !== "string") {
      return errorResponse("Order ID is required", 400);
    }

    const user = await getUserFromCookies(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const { paymentMethod, channel, transactionId, proofImage } = await req.json();
    if (!paymentMethod || !transactionId) {
      return errorResponse("paymentMethod and transactionId are required", 400);
    }

    const method = paymentMethod.toUpperCase();
    if (method !== "COD") {
      return errorResponse("Only COD payment confirmation is supported here", 400);
    }

    if (!channel) return errorResponse("Channel (EASYPAISA or BANK) is required for COD", 400);
    const upperChannel = channel.toUpperCase();
    if (!["EASYPAISA", "BANK"].includes(upperChannel)) {
      return errorResponse("Invalid COD channel. Must be EASYPAISA or BANK.", 400);
    }

    // Fetch the order from Supabase
    const { data: order, error: fetchError } = await supabaseServer
      .from("03_orders")
      .select("id, user_id, payment_status")
      .eq("id", id)
      .single();

    if (fetchError || !order) return errorResponse("Order not found", 404);
    if (order.user_id !== user._id.toString()) return errorResponse("Unauthorized", 401);
    if (order.payment_status === "PAID") return errorResponse("Order is already paid", 400);

    // Update payment details
    const { data: updated, error: updateError } = await supabaseServer
      .from("03_orders")
      .update({
        payment_method: "COD",
        payment_channel: upperChannel,
        transaction_id: transactionId,
        proof_image: proofImage || null,
        payment_status: "PENDING",
        paid_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) return errorResponse(updateError.message, 500);

    const paymentData = {
      method: updated.payment_method,
      channel: updated.payment_channel || null,
      status: updated.payment_status,
      transactionId: updated.transaction_id,
      paidAt: updated.paid_at,
      proofImage: updated.proof_image || null,
    };

    return successResponse(
      "Payment information received. Admin will verify your order shortly.",
      { orderId: updated.id, payment: paymentData }
    );
  } catch (err) {
    console.error("CONFIRM PAYMENT ERROR:", err);
    return errorResponse("Failed to submit payment info", 500);
  }
}
