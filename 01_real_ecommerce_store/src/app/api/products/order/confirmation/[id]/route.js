import Order from "@/models/Order.model";
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";
import dbConnect from "@/lib/dbConnection";

export async function POST(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;
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

    const order = await Order.findById(id);
    if (!order) return errorResponse("Order not found", 404);
    if (order.userId.toString() !== user._id.toString()) {
      return errorResponse("Unauthorized", 401);
    }
    if (order.payment.status === "PAID") return errorResponse("Order is already paid", 400);

    order.payment.method = "COD";
    order.payment.channel = upperChannel;
    order.payment.transactionId = transactionId;
    order.payment.paidAt = new Date();
    order.payment.proofImage = proofImage || order.payment.proofImage;
    order.payment.status = "PENDING";

    await order.save();

    const paymentData = {
      method: order.payment.method,
      channel: order.payment.channel || null,
      status: order.payment.status,
      transactionId: order.payment.transactionId,
      paidAt: order.payment.paidAt,
      gatewayData: order.payment.gatewayData || {},
      proofImage: order.payment.proofImage || null,
    };

    return successResponse(
      "Payment information received. Admin will verify your order shortly.",
      { orderId: order._id, payment: paymentData }
    );
  } catch (err) {
    console.error("CONFIRM PAYMENT ERROR:", err);
    return errorResponse("Failed to submit payment info", 500);
  }
}
