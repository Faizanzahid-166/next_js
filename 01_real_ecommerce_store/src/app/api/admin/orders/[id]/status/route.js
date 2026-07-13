// Admin-only: verify/update an order's payment status and order status
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";
import connectDB from "@/lib/dbConnection";
import Order from "@/models/Order.model";

const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED"];
const ORDER_STATUSES = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function PATCH(req, { params }) {
  try {
    await connectDB();

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

    const order = await Order.findById(id);
    if (!order) return errorResponse("Order not found", 404);

    if (paymentStatus) {
      order.payment.status = paymentStatus.toUpperCase();
      if (paymentStatus.toUpperCase() === "PAID" && !order.payment.paidAt) {
        order.payment.paidAt = new Date();
      }
    }

    if (orderStatus) {
      order.status = orderStatus.toUpperCase();
    }

    await order.save();

    return successResponse("Order updated successfully", { order });
  } catch (err) {
    console.error("ADMIN UPDATE ORDER STATUS ERROR:", err);
    return errorResponse(err.message || "Failed to update order", 500);
  }
}
