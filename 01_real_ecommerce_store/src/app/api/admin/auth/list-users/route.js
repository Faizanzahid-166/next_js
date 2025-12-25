import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";
import connectDB from "@/lib/dbConnection";
import User from "@/models/User.model";

export async function GET(req) {
  try {
    // 🔗 Connect database
    await connectDB();

    // 🔐 Get logged-in user from cookies
    const currentUser = await getUserFromCookies(req);

    if (!currentUser) {
      return errorResponse("Unauthorized", 401);
    }

    // 🛑 Allow only admin or root
    if (currentUser.role !== "admin" && currentUser.isRoot !== true) {
      return errorResponse("Access denied", 403);
    }

    // 👥 Fetch all users (exclude password)
    const users = await User.find().select("-password");

    return successResponse("All users fetched successfully", {
      totalUsers: users.length,
      users,
    });

  } catch (err) {
    return errorResponse(err.message || "Failed to fetch users", 500);
  }
}
