export function applySearch(query, { q, product_no }) {
  if (q) {
    const term = q.trim();
    query = query.or(
      `name.ilike.%${term}%,description.ilike.%${term}%`
    );
  }

  if (product_no) {
    query = query.eq("product_no", Number(product_no));
  }

  return query;
}
