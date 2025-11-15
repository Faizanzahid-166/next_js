import { dbConnect } from "@/lib/db";
import { getUserFromAuthHeader } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";

export async function GET(req) {
  await dbConnect();
  try {
    const user = await getUserFromAuthHeader(req);
    if (!user) return errorResponse("Unauthorized", 401);
    return successResponse("User fetched", user);
  } catch (err) {
    return errorResponse(err.message || "Failed", 500);
  }
}
