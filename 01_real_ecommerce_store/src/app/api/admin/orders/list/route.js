// Admin-only: list all orders (transaction history + per-user product history)
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";
import connectDB from "@/lib/dbConnection";
import Order from "@/models/Order.model";

export async function GET(req) {
  try {
    await connectDB();

    const currentUser = await getUserFromCookies(req);
    if (!currentUser) {
      return errorResponse("Unauthorized", 401);
    }

    // Only admin / root can view all orders
    if (currentUser.role !== "admin" && currentUser.isRoot !== true) {
      return errorResponse("Access denied", 403);
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const paymentStatus = searchParams.get("paymentStatus");
    const status = searchParams.get("status");
    const paymentMethod = searchParams.get("paymentMethod");

    const query = {};
    if (userId) query.userId = userId;
    if (paymentStatus) query["payment.status"] = paymentStatus.toUpperCase();
    if (status) query.status = status.toUpperCase();
    if (paymentMethod) query["payment.method"] = paymentMethod.toUpperCase();

    const orders = await Order.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return successResponse("Orders fetched successfully", {
      totalOrders: orders.length,
      orders,
    });
  } catch (err) {
    console.error("ADMIN LIST ORDERS ERROR:", err);
    return errorResponse(err.message || "Failed to fetch orders", 500);
  }
}
