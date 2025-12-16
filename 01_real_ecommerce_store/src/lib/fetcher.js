export async function fetchProduct(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${id}`, {
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  const json = await res.json();
  return json.data;
}
