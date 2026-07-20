"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Link from "next/link";
import { ChevronLeft, ShoppingBag, ShieldCheck, HelpCircle } from "lucide-react";

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

  // 1. PRODUCT DETAIL SKELETON
  if (productLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-16 animate-pulse">
        <div className="aspect-[4/3] bg-neutral-200 rounded-2xl"></div>
        <div className="space-y-6 py-4">
          <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
          <div className="h-10 bg-neutral-200 rounded w-3/4"></div>
          <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
          <div className="h-32 bg-neutral-200 rounded w-full"></div>
          <div className="h-12 bg-neutral-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // 2. ERROR STATE
  if (productError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">Failed to load product</h2>
          <p className="text-sm text-neutral-500">{productError}</p>
          <Link
            href="/products"
            className="inline-block px-5 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/95 transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // 3. EMPTY STATE
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <span className="text-4xl">❓</span>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">Product not found</h2>
          <p className="text-sm text-neutral-500">We couldn't find the product you are looking for.</p>
          <Link
            href="/products"
            className="inline-block px-5 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/95 transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
      
      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to collection</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        
        {/* LEFT COLUMN: Image Card */}
        <div className="bg-neutral-50 rounded-2xl overflow-hidden border border-border/40 p-8 flex items-center justify-center aspect-[4/3] relative">
          <img
            src={product.image_url}
            alt={product.name}
            className="max-h-[400px] object-contain rounded-xl transform hover:scale-102 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-neutral-950/2 pointer-events-none"></div>
        </div>

        {/* RIGHT COLUMN: Details */}
        <div className="flex flex-col justify-center">
          <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
            {product.category}
          </span>
          
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight mt-2 leading-tight">
            {product.name}
          </h1>

          <p className="text-2xl font-semibold text-primary mt-3">
            ${product.price.toFixed(2)}
          </p>

          {/* Description Block */}
          <div className="border-t border-b border-border/40 py-6 my-6 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Description</h4>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {product.description || "No description provided for this item. Crafted with our signature premium elements."}
            </p>
          </div>

          {/* Stock Availability Pill */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xs text-neutral-500">Availability:</span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                product.stock > 0
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
            </span>
          </div>

          {/* Actions & Trust Badges */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || cartLoading}
                className="flex-1 bg-primary text-primary-foreground font-semibold py-3.5 rounded-md hover:bg-primary/95 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{cartLoading ? "Adding to Cart..." : "Add to Cart"}</span>
              </button>
            </div>

            {/* DTC Trust Features */}
            <div className="bg-secondary/30 rounded-xl p-4 border border-border/20 text-xs text-neutral-500 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Free shipping on all orders over $50</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Hassle-free 30-day exchange window</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                <span>100% Secure COD & EasyPaisa deposits</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
