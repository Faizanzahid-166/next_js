import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";
import connectDB from "@/lib/dbConnection";

export async function GET(req) {
  try {
   // console.log("🔗 Connecting to DB...");
    await connectDB();
   // console.log("✅ DB connected");

   // console.log("🔵 Fetching user from cookies...");
    const user = await getUserFromCookies(req); // ✅ Pass req

    if (!user) {
      //console.log("❌ Unauthorized: No valid user found");
      return errorResponse("Unauthorized", 401);
    }

    //console.log("👤 User fetched successfully:", user._id);
    return successResponse("User fetched successfully", user);

  } catch (err) {
    //console.error("🔥 /api/auth/me error:", err);
    return errorResponse(err.message || "Failed to fetch user", 500);
  }
}

