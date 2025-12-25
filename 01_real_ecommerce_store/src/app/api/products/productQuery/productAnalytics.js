export function applyAnalytics(query, analytics) {
  if (!analytics) return query;

  // Example: filter by popular, new arrivals, or top-rated
  switch (analytics) {
    case "popular":
      query = query.order("sold_count", { ascending: false });
      break;
    case "new":
      query = query.order("created_at", { ascending: false });
      break;
    case "top-rated":
      query = query.order("rating", { ascending: false });
      break;
    default:
      break;
  }
  return query;
}
