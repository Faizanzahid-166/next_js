"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import { addCartItem, fetchCart } from "@/redux/productsSliceTunk/cartSliceTunk";
import { addGuestCartItem, hydrateGuestCart } from "@/redux/productsSliceTunk/guestCartSlice";
import { getPrimaryImageUrl } from "@/lib/productImages";
import ImageGallery from "@/components/product/ImageGallery";

export default function ProductDetail({ productId }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading: cartLoading } = useSelector((state) => state.cart);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  const cartAnimationTimer = useRef(null);

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

  useEffect(() => {
    return () => {
      if (cartAnimationTimer.current) {
        clearTimeout(cartAnimationTimer.current);
      }
    };
  }, []);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsCartAnimating(true);
    if (cartAnimationTimer.current) clearTimeout(cartAnimationTimer.current);
    cartAnimationTimer.current = setTimeout(() => setIsCartAnimating(false), 600);

    if (user) {
      // ── Authenticated: add to DB cart ──
      try {
        await dispatch(
          addCartItem({
            productId: product.id || product._id,
            quantity: 1,
            item: {
              name: product.name,
              price: product.price,
              stock: product.stock,
              image_url: getPrimaryImageUrl(product),
            },
          })
        ).unwrap();
        toast.success("Added to cart!");
      } catch (error) {
        toast.error(error?.message || error || "Failed to add product");
      }
    } else {
      // ── Guest: add to local cart (no backend call) ──
      dispatch(
        addGuestCartItem({
          productId: product.id || product._id,
          name: product.name,
          price: product.price,
          image_url: getPrimaryImageUrl(product),
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
            className={`group relative overflow-hidden rounded-xl border px-6 py-3 text-white shadow-lg transition-all duration-500 disabled:cursor-not-allowed disabled:opacity-50 ${
              isCartAnimating
                ? "cart-button-pop border-emerald-300 bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 shadow-xl shadow-emerald-500/40"
                : "border-orange-400 bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 shadow-orange-500/30 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-600/40"
            }`}
            style={
              isCartAnimating
                ? {
                    transform: "scale(0.98)",
                    background: "linear-gradient(135deg, #10b981 0%, #22c55e 50%, #a3e635 100%)",
                    boxShadow: "0 18px 35px rgba(16, 185, 129, 0.45)",
                  }
                : undefined
            }
          >
            <span className="absolute inset-y-0 left-0 w-16 -translate-x-full bg-white/25 blur-md transition-transform duration-700 group-hover:translate-x-[420%]" />
            <span
              className={`absolute right-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.9)] transition-all duration-500 ${
                isCartAnimating ? "right-3 scale-125 opacity-100" : "opacity-0"
              }`}
            />
            <span className="relative z-10 flex items-center gap-2 font-semibold tracking-wide">
              <span className={`transition-all duration-500 ${isCartAnimating ? "translate-x-1" : "group-hover:translate-x-1"}`}>
                {user && cartLoading ? "Adding…" : isCartAnimating ? "Added!" : "Add to Cart"}
              </span>
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-base transition-transform duration-500 ${
                  isCartAnimating ? "translate-x-3 scale-110 rotate-12" : "group-hover:translate-x-3 group-hover:scale-110"
                }`}
              >
                🛒
              </span>
            </span>
          </button>
          <Link href="/products" className="px-6 py-3 border rounded-xl hover:bg-gray-100">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
