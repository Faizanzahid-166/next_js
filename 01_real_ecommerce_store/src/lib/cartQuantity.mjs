export function calculateNextCartQuantity({ currentQuantity = 0, delta = 0, stock = Number.MAX_SAFE_INTEGER }) {
  const safeCurrent = Number(currentQuantity) || 0;
  const safeDelta = Number(delta) || 0;
  const nextQuantity = safeCurrent + safeDelta;

  if (nextQuantity <= 0) return 0;

  const safeStock = Number(stock) || Number.MAX_SAFE_INTEGER;
  return Math.min(nextQuantity, safeStock);
}
