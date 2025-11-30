import { supabase } from "@/lib/supabase";
import { getUserFromAuthHeader } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";

export async function PUT(req, { params }) {
  try {
    const user = await getUserFromAuthHeader(req);
    if (!user || user.role !== "admin") {
      return errorResponse("Forbidden", 403);
    }

    const { id } = params;
    const body = await req.json();

    const { data, error } = await supabase
      .from("01_electroic_gadgets")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) return errorResponse(error.message, 500);

    return successResponse("Product updated", data);
  } catch (err) {
    return errorResponse(err.message || "Failed to update product", 500);
  }
}
