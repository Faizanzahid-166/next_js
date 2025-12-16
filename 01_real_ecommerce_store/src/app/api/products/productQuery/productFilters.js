export function applyFilters(query, params) {
  const { category } = params;

  if (category) {
    query = query.eq("category", category);
  }

  return query;
}
