import { supabaseServer } from "@/lib/supabase";
import connectDB from "@/lib/dbConnection";
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { rateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { successResponse, errorResponse } from "@/lib/response";

export async function DELETE(req, { params }) {
  const limit = rateLimit(req, "admin:delete-product", 20, 60_000);
  if (limit.limited) return rateLimitResponse(limit);

  await connectDB();

  const user = await getUserFromCookies(req);
  if (!user || user.role !== "admin" || !user.isRoot) {
    return errorResponse("Forbidden", 403);
  }

  // ✅ unwrap params
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id) return errorResponse("Product ID is required", 400);

  const { error } = await supabaseServer
    .from("03_ecommerce_store_products")
    .delete()
    .eq("id", id);

  if (error) return errorResponse(error.message, 500);

  return successResponse("Product deleted successfully");
}
