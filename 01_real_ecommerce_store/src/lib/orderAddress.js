export function normalizeShippingAddress(shippingAddress = {}) {
  const provinceValue = String(
    shippingAddress.province ?? shippingAddress.Province ?? shippingAddress.country ?? ""
  ).trim();

  return {
    ...shippingAddress,
    province: provinceValue,
    country: provinceValue,
    postalCode: "",
    Province: provinceValue,
  };
}
