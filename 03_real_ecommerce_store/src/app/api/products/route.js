import { supabase  } from "@/lib/supabase";
import { getUserFromCookies  } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";

// -------------------------------------------
// GET Products (Search, Pagination, Category)
// -------------------------------------------
export async function GET(req) {
  try {
    const url = new URL(req.url);

    const q = url.searchParams.get("q") || "";
    const category = url.searchParams.get("category") || "";
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 12);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("01_electroic_gadgets")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    // Search
    if (q) {
      query = query.or(
        `title.ilike.%${q}%,description.ilike.%${q}%`
      );
    }

    // Category filter
    if (category) {
      query = query.eq("category", category);
    }

    // Pagination
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) return errorResponse(error.message, 500);

    return successResponse("Products list", {
      items: data,
      total: count,
      page,
      limit,
    });
  } catch (err) {
    return errorResponse(err.message || "Failed to list products", 500);
  }
}

// -------------------------------------------
// POST Products (Admin only)
// -------------------------------------------
export async function POST(req) {
  try {
    const user = await getUserFromCookies (req);
    if (!user || user.role !== "admin") {
      return errorResponse("Forbidden", 403);
    }

    const body = await req.json();

    // Optional: Validate (title, price etc.)
    if (!body.title || !body.price) {
      return errorResponse("Title & price required", 400);
    }

    const { data, error } = await supabase
      .from("products")
      .insert(body)
      .select()
      .single();

    if (error) return errorResponse(error.message, 500);

    return successResponse("Product created", data, 201);
  } catch (err) {
    return errorResponse(err.message || "Failed to create product", 500);
  }
}
