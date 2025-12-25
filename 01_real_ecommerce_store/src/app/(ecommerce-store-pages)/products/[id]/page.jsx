"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Link from "next/link";

import { addCartItem, fetchCart } from "@/redux/productsSliceTunk/cartSliceTunk";
import { fetchProductById, clearSelectedProduct } from "@/redux/productsSliceTunk/productfetchSliceTunk";

export default function ProductPage() {
  const { id: productId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { loading: cartLoading } = useSelector((state) => state.cart);
  const { selectedProduct: product, productLoading, productError } = useSelector(
    (state) => state.products
  );

  // Fetch product details
  useEffect(() => {
    if (productId) {
      console.log("Fetching product:", productId);
      dispatch(fetchProductById(productId));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [productId, dispatch]);

  // Fetch cart if user is logged in
  useEffect(() => {
    if (user?._id) {
      console.log("Fetching cart for user:", user._id);
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  const handleAddToCart = async () => {
    if (!user?._id) {
      toast.error("Login to add items");
      router.push(`/login?redirect=/products/${productId}`);
      return;
    }

    if (product?.stock <= 0) {
      toast.error("Product out of stock");
      return;
    }

    try {
      console.log("Adding product to cart:", product.id);
      await dispatch(addCartItem({ productId: product.id, quantity: 1 })).unwrap();
      toast.success("Product added to cart");
      dispatch(fetchCart()); // Refresh cart after adding
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error(err || "Failed to add product");
    }
  };

  if (productLoading)
    return <p className="h-screen text-center py-20">Loading product...</p>;

  if (productError)
    return <p className="h-screen text-center py-20 text-red-500">{productError}</p>;

  if (!product)
    return <p className="h-screen text-center py-20">Product not found.</p>;

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-12 p-6">
      {/* Product Image */}
      <div className="bg-gray-100 rounded-2xl p-6 flex items-center justify-center">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full max-h-[450px] object-contain rounded-xl"
        />
      </div>

      {/* Product Details */}
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-500">{product.category}</p>

        <p className="text-2xl font-semibold text-green-600 mt-4">${product.price}</p>

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
            disabled={product.stock === 0 || cartLoading}
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50"
          >
            {cartLoading ? "Adding..." : "Add to Cart"}
          </button>

          <Link
            href="/products"
            className="px-6 py-3 border rounded-xl hover:bg-gray-100"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
