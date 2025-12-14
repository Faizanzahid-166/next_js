"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await axios.get("/api/products");
      if (res.data.status === "success") {
        setProducts(res.data.data.items);
      }
    } catch (err) {
      console.log("API Error:", err);
    }

    setLoading(false);
  }

  if (loading) return <p className="p-4">Loading products...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg shadow-sm p-4 hover:shadow-lg transition"
            >
              <img
                src={product.image || "/placeholder.png"}
                alt={product.title}
                className="w-full h-40 object-cover mb-2 rounded"
              />

              <h2 className="text-lg font-semibold">{product.title}</h2>
              <p className="text-gray-600">${product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
