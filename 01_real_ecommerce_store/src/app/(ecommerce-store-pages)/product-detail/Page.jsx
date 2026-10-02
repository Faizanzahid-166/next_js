"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import { addCartItem, fetchCart } from "@/redux/productsSliceTunk/cartSliceTunk";
import { addGuestCartItem, hydrateGuestCart } from "@/redux/productsSliceTunk/guestCartSlice";
import ImageGallery from "@/components/product/ImageGallery";

export default function ProductDetail({ productId }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading: cartLoading } = useSelector((state) => state.cart);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Hydrate guest cart on mount (restores localStorage cart into Redux)
  useEffect(() => {
    dispatch(hydrateGuestCart());
  }, [dispatch]);

  useEffect(() => {
    if (!productId) return;
    axios
      .get(`/api/products/${productId}`)
      .then((res) => {
        setProduct(res.data.data);
      })
      .catch((err) => setError(err.response?.data?.message || "Product not found"))
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    if (user?._id) dispatch(fetchCart());
  }, [user, dispatch]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (user) {
      // ── Authenticated: add to DB cart ──
      try {
        await dispatch(
          addCartItem({ productId: product.id || product._id, quantity: 1 })
        ).unwrap();
        toast.success("Added to cart!");
        dispatch(fetchCart());
      } catch {
        toast.error("Failed to add product");
      }
    } else {
      // ── Guest: add to local cart (no backend call) ──
      dispatch(
        addGuestCartItem({
          productId: product.id || product._id,
          name: product.name,
          price: product.price,
          image_url: product.image_url || product.images?.[0] || "",
          stock: product.stock,
          quantity: 1,
        })
      );
      toast.success("Added to cart!");
    }
  };

  if (loading) return <p className="text-center py-20">Loading product…</p>;
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="bg-gray-100 rounded-2xl p-6">
        <div>
          <ImageGallery
            images={product.images || product.image_urls || [product.image_url]}
            autoPlay={false}
          />
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-500">{product.category}</p>
        <p className="text-2xl font-semibold text-green-600 mt-4">Rs. {product.price}</p>
        <p className="mt-6 text-gray-700">{product.description}</p>
        <p className="mt-4">
          Stock:{" "}
          <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
            {product.stock > 0 ? "Available" : "Out of Stock"}
          </span>
        </p>
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || (user && cartLoading)}
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50"
          >
            {user && cartLoading ? "Adding…" : "Add to Cart"}
          </button>
          <Link href="/products" className="px-6 py-3 border rounded-xl hover:bg-gray-100">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
