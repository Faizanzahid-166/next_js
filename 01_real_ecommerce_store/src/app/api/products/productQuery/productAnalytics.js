export function applyAnalytics(query, type) {
  switch (type) {
    case "best_sellers":
      return query.order("sold_count", { ascending: false });

    case "trending":
      return query
        .gte("created_at", getLastDays(7))
        .order("views", { ascending: false });

    case "top_rated":
      return query.order("rating", { ascending: false });

    case "featured":
      return query.eq("is_featured", true);

    default:
      return query;
  }
}

function getLastDays(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}
