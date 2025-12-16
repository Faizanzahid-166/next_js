export function applySearch(query, { q }) {
  if (!q) return query;

  const term = q.replace(/,/g, "");
  return query.or(
    `name.ilike.%${term}%,description.ilike.%${term}%`
  );
}
