const CART_KEY = "ecommerce_cart_v1";

export function getCart() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

export function addToCart(product, qty = 1) {
  const cart = getCart();

  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      qty
    });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function removeFromCart(id) {
  const cart = getCart().filter(item => item.id !== id);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
