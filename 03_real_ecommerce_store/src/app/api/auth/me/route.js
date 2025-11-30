import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";
import connectDB from "@/lib/dbConnection";
export async function GET(req) {
  try {
     await connectDB();
    const user = await getUserFromCookies();

    if (!user) return errorResponse("Unauthorized", 401);

    return successResponse("User fetched", user);
  } catch (err) {
    return errorResponse(err.message || "Failed", 500);
  }
}
