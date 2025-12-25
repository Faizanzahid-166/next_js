export function applyFilters(query, params) {
  const { category } = params;

  if (category) {
  const categories = category.split(",").map(c => c.trim());
  query = query.in("category", categories);
}


  return query;
}
