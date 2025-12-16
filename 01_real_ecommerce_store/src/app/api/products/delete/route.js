import { supabase } from "@/lib/supabase";
import { getUserFromAuthHeader } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";

export async function DELETE(req, { params }) {
  try {
    const user = await getUserFromAuthHeader(req);
    if (!user || user.role !== "admin") {
      return errorResponse("Forbidden", 403);
    }

    const { id } = params;

    const { error } = await supabase
      .from("01_electroic_gadgets")
      .delete()
      .eq("id", id);

    if (error) return errorResponse(error.message, 500);

    return successResponse("Product deleted", { id });
  } catch (err) {
    return errorResponse(err.message || "Failed to delete product", 500);
  }
}
