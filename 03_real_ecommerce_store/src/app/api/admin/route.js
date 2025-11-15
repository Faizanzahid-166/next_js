//  Admin-only: app/api/admin/orders/[id]/status/route.js (update order status)

import { dbconnect } from "@/lib/dbConnection";
import Order from "@/models/Order.model";
import { getUserFromAuthHeader } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";

export async function PUT(req, { params }) {
  await dbconnect();
  const user = await getUserFromAuthHeader(req);
  if (!user || user.role !== "admin") return errorResponse("Forbidden", 403);

  const { status } = await req.json();
  const valid = ["pending","paid","shipped","delivered","cancelled"];
  if (!valid.includes(status)) return errorResponse("Invalid status", 400);

  const order = await Order.findByIdAndUpdate(params.id, { status }, { new: true });
  if (!order) return errorResponse("Order not found", 404);
  return successResponse("Order status updated", order);
}
