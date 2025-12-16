import { supabaseServer } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/response";

export async function GET(req, context) {
  const params = await context.params;
  const id = Number(params.id);

  console.log(params,id)

  if (!id) {
    return errorResponse("Invalid product id", 400);
  }

  const { data, error } = await supabaseServer
    .from("01_electroic_gadgets")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return errorResponse("Product not found", 404);
  }

  return successResponse("Product details", data);
}
