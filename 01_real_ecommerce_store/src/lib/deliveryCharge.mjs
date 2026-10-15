export const DELIVERY_CHARGE_FIRST = 250;
export const DELIVERY_CHARGE_SECOND = 110;
export const DELIVERY_CHARGE_EXTRA = 60;

export function getCartUniqueProductCount(items = []) {
  if (!Array.isArray(items) || items.length === 0) return 0;

  const uniqueProductIds = new Set();

  for (const item of items) {
    const productKey =
      item?.productId ??
      item?.product_id ??
      item?.variantId ??
      item?.id ??
      item?.product?._id ??
      null;

    if (!productKey) continue;
    uniqueProductIds.add(String(productKey));
  }

  return uniqueProductIds.size;
}

export function calculateDeliveryCharge(items = []) {
  const uniqueProductCount = getCartUniqueProductCount(items);

  if (uniqueProductCount === 0) return 0;
  if (uniqueProductCount === 1) return DELIVERY_CHARGE_FIRST;

  return DELIVERY_CHARGE_FIRST + DELIVERY_CHARGE_SECOND + Math.max(0, uniqueProductCount - 2) * DELIVERY_CHARGE_EXTRA;
}

export function getDeliveryChargeBreakdown(items = []) {
  const uniqueProductCount = getCartUniqueProductCount(items);

  if (uniqueProductCount === 0) return [];

  const breakdown = [{ label: 'First product delivery is', amount: DELIVERY_CHARGE_FIRST }];

  if (uniqueProductCount >= 2) {
    breakdown.push({ label: 'Second product delivery is', amount: DELIVERY_CHARGE_SECOND });
  }

  for (let index = 3; index <= uniqueProductCount; index += 1) {
    breakdown.push({ label: `${index}th product delivery is`, amount: DELIVERY_CHARGE_EXTRA });
  }

  return breakdown;
}

export function formatDeliveryChargeBreakdown(items = []) {
  const breakdown = getDeliveryChargeBreakdown(items);

  if (breakdown.length === 0) return 'Free delivery';

  return breakdown
    .map(({ label, amount }) => `${label} Rs. ${amount}`)
    .join(', ');
}

export function calculateCartSummary(items = [], discounts = 0) {
  const cartItems = Array.isArray(items) ? items : [];
  const uniqueProductsCount = getCartUniqueProductCount(cartItems);
  const subTotal = Math.round(
    cartItems.reduce((sum, item) => {
      const price = Number(item?.price || 0);
      const quantity = Number(item?.quantity || 0);
      return sum + price * quantity;
    }, 0)
  );
  const deliveryCharge = calculateDeliveryCharge(cartItems);
  const grandTotal = Math.max(0, Math.round(subTotal + deliveryCharge - Number(discounts || 0)));

  return {
    uniqueProductsCount,
    subTotal,
    deliveryCharge,
    grandTotal,
  };
}
