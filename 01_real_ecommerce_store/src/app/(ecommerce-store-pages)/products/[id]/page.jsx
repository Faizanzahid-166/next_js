"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import { addToCart, fetchCart } from "@/redux/productsSliceTunk/cartSliceTunk";

export default function DetailProduct() {
  const { id } = useParams();
  const router = useRouter();
  const productId = id; // MongoDB-safe

  const dispatch = useDispatch();
  const { loading: cartLoading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product details
  useEffect(() => {
    if (!productId) return;

    setLoading(true);
    setError(null);

    axios
      .get(`/api/products/${productId}`)
      .then((res) => setProduct(res.data.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load product")
      )
      .finally(() => setLoading(false));
  }, [productId]);

  // Fetch user cart when component mounts (optional)
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCart(user._id));
    }
  }, [user, dispatch]);

  // Add to cart handler
  const handleAddToCart = async () => {
    if (!user?._id) {
      toast.error("Please login to add items to cart");
      router.push(`/login?redirect=/products/${productId}`);
      return;
    }

    if (!product?._id && !product?.id) {
      toast.error("Product not available");
      return;
    }

    const pid = product._id || product.id;

    try {
      await dispatch(
        addToCart({
          userId: user._id,
          productId: pid,
          quantity: 1,
        })
      ).unwrap();

      toast.success("Added to cart");

      // Optionally fetch cart again to update state
      dispatch(fetchCart(user._id));
    } catch (err) {
      console.log(err);
      toast.error(err?.message || "Failed to add to cart");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading product...
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-10 text-red-500">
        {error}
      </div>
    );

  if (!product)
    return (
      <div className="text-center mt-10 text-gray-500">
        Product not found
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Image */}
      <div>
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full rounded-xl border object-cover"
        />
      </div>

      {/* Info */}
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-500 mt-2">{product.category}</p>
        <p className="text-2xl font-semibold mt-4">${product.price}</p>

        <p className="mt-6 text-gray-700 leading-relaxed">
          {product.description}
        </p>

        <p className="mt-4 text-sm">
          Stock:{" "}
          <span
            className={
              product.stock > 0 ? "text-green-600" : "text-red-600"
            }
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </p>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || cartLoading}
            className="px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 disabled:opacity-50 transition"
          >
            {cartLoading ? "Adding..." : "Add to Cart"}
          </button>

          <Link
            href="/products"
            className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
