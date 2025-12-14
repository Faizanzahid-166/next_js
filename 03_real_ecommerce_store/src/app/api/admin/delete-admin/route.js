// src/app/api/admin/delete-admin/route.js
import dbConnect from "@/lib/dbConnection";
import User from "@/models/User.model";
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { errorResponse, successResponse } from "@/lib/response";

export async function POST(req) {
  try {
    await dbConnect();

    // Get the currently logged-in user
    const currentUser = await getUserFromCookies();
    if (!currentUser) return errorResponse("Unauthorized", 401);

    // Only root admin can delete admins
    if (currentUser.role !== "admin" || !currentUser.isRoot) {
      return errorResponse("Forbidden: Only root admin can delete an admin", 403);
    }

    // Get admin id to delete from request body
    const body = await req.json();
    const { adminId } = body;

    if (!adminId) return errorResponse("adminId is required", 400);

    // Find the admin to delete
    const admin = await User.findById(adminId);
    if (!admin) return errorResponse("Admin not found", 404);

    // Prevent deleting root-admins
    if (admin.isRoot) return errorResponse("Cannot delete another root-admin", 403);

    // Only delete users with role "admin"
    if (admin.role !== "admin") return errorResponse("User is not an admin", 400);

    await admin.deleteOne();

    return successResponse({ message: `Admin ${admin.email} deleted successfully` });

  } catch (err) {
    console.error("Delete admin error:", err);
    return errorResponse(err.message || "Failed to delete admin", 500);
  }
}
