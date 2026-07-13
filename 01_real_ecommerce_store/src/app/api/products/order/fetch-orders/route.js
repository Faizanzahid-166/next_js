import dbConnect from "@/lib/dbConnection";
import Order from "@/models/Order.model";
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";

export async function GET(req) {
  await dbConnect();

  try {
    const user = await getUserFromCookies(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const orders = await Order.find({ userId: user._id })
      .sort({ createdAt: -1 });

    return successResponse("Orders fetched", { orders });
  } catch (err) {
    console.error("FETCH ORDERS ERROR:", err);
    return errorResponse("Failed to fetch orders", 500);
  }
}
