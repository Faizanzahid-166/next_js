import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";
import connectDB from "@/lib/dbConnection";
import User from "@/models/User.model";

export async function PATCH(req) {
  try {
    await connectDB();

    // 🔐 Current logged-in user
    const adminUser = await getUserFromCookies(req);

    if (!adminUser) {
      return errorResponse("Unauthorized", 401);
    }

    // 🛑 Only admin or root allowed
    if (adminUser.role !== "admin" && adminUser.isRoot !== true) {
      return errorResponse("Access denied", 403);
    }

    const { userId, role, isRoot } = await req.json();

    // ❌ Prevent admin changing their own role
    if (adminUser._id.toString() === userId) {
      return errorResponse("You cannot change your own role", 400);
    }

    // 🛑 Only ROOT can assign root
    if (isRoot === true && adminUser.isRoot !== true) {
      return errorResponse("Only root admin can assign root access", 403);
    }

    // 👤 Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        role,
        isRoot: isRoot || false,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return errorResponse("User not found", 404);
    }

    return successResponse("User role updated successfully", updatedUser);

  } catch (err) {
    return errorResponse(err.message || "Failed to update role", 500);
  }
}
