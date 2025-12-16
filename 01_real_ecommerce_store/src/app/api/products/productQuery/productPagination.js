export function applyPagination({ page = 1, limit = 12 }) {
  page = Math.max(Number(page), 1);
  limit = Math.max(Number(limit), 1);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  return { from, to, page, limit };
}
