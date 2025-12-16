import { supabaseServer } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/response";

import { applySearch } from "./productQuery/productQuery";
import { applyFilters } from "./productQuery/productFilters";
import { applyPriceFilter } from "./productQuery/productPrice";
import { applyPagination } from "./productQuery/productPagination";
import { applyAnalytics } from "./productQuery/productAnalytics"
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());

    let query = supabaseServer
      .from("01_electroic_gadgets")
      .select("*", { count: "exact" });

    // 🔍 Search
    query = applySearch(query, params);

    // 🎯 Category filter
    query = applyFilters(query, params);

    // 💰 Price filter
    query = applyPriceFilter(query, params.price);

    // ⭐ Analytics
    query = applyAnalytics(query, params.analytics);

    // 📄 Pagination
    const { from, to, page, limit } = applyPagination(params);

    const { data, count, error } = await query.range(from, to);
    if (error) return errorResponse(error.message, 500);

    let sortedData = data;

    // 🔝 Frontend-like exact-match-first sorting
    if (params.q) {
      const term = params.q.toLowerCase();
      sortedData = [...data].sort((a, b) => {
        if (a.name.toLowerCase() === term) return -1;
        if (b.name.toLowerCase() === term) return 1;
        return 0;
      });
    }

    return successResponse("Products list", {
      items: sortedData,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    return errorResponse("Failed to load products", 500);
  }
}
