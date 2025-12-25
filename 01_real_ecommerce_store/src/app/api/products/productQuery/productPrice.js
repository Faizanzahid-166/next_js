export function applyPriceFilter(query, price) {
  if (!price) return query;

  const value = Number(price);
  if (isNaN(value)) return query;

  const step = 50;

  let min = 0;
  let max = step;

  if (value > step) {
    min = Math.floor((value - 1) / step) * step + 1;
    max = Math.ceil(value / step) * step;
  }

  query = query.gte("price", min).lte("price", max);

  return query;
}
