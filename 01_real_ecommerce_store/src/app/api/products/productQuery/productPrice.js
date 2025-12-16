export function applyPriceFilter(query, priceInput) {
  if (!priceInput) return query;

  const price = parseFloat(priceInput);
  if (isNaN(price)) return query;

  // Optional: small range for flexibility (±1)
  const minPrice = price - 1;
  const maxPrice = price + 1;

  return query.gte("price", minPrice).lte("price", maxPrice);
}
