import mongodb from "@/lib/mongodb";
import User from "@/models/UserModel";
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { errorResponse, successResponse } from "@/lib/response";

export async function GET(req) {
  try {
    await mongodb();

    // Optional: Only logged-in users can get the list
    const currentUser = await getUserFromCookies();
    if (!currentUser) return errorResponse("Unauthorized", 401);

    // Fetch all users except the current user
    const users = await User.find({ _id: { $ne: currentUser._id } }).select(
      "name email avatar role"
    );

    return successResponse("Users retrieved", users, 200);
  } catch (err) {
    console.error("GET users error:", err);
    return errorResponse("Server error", 500);
  }
}
