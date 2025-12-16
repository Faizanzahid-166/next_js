import dbConnect from "@/lib/dbConnection";
import User from "@/models/User.model";
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { errorResponse, successResponse } from "@/lib/response";

export async function GET() {
  try {
    await dbConnect();

    const currentUser = await getUserFromCookies();
    if (!currentUser) return errorResponse("Unauthorized", 401);

    // Only root admin can see admin list
    if (currentUser.role !== "admin" || !currentUser.isRoot) {
      return errorResponse("Forbidden: Only root-admin can view admins", 403);
    }

    const admins = await User.find({ role: "admin" }).select("-password");

    return successResponse({ admins });

  } catch (err) {
    console.error("List admins error:", err);
    return errorResponse("Failed to list admins", 500);
  }
}
