"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  addCartItem,
  clearCart,
} from "@/redux/productsSliceTunk/cartSliceTunk";
import { toast } from "sonner";
import Link from "next/link";
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react";

export default function CartPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items, loading, error } = useSelector((state) => state.cart);

  // Fetch cart on mount if user exists
  useEffect(() => {
    if (user) dispatch(fetchCart());
  }, [user, dispatch]);

  // Redirect to login if not logged in
  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-6">
        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto text-neutral-600">
          <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-neutral-900">Your Cart</h2>
          <p className="text-sm text-neutral-500">
            Please log in to view your shopping cart and complete your purchase.
          </p>
        </div>
        <Link
          href="/login?redirect=/customer/dashboard/cart"
          className="inline-block w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md text-sm hover:bg-primary/95 transition-colors"
        >
          Sign In to Your Account
        </Link>
      </div>
    );
  }

  // 1. LOADING STATE
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-48 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="h-24 bg-neutral-200 rounded-xl w-full"></div>
            ))}
          </div>
          <div className="h-64 bg-neutral-200 rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  // 2. ERROR STATE
  if (error) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h2 className="text-2xl font-serif font-bold text-neutral-900">Error loading cart</h2>
        <p className="text-sm text-neutral-500">{error}</p>
        <button
          onClick={() => dispatch(fetchCart())}
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/95"
        >
          Try Again
        </button>
      </div>
    );
  }

  // 3. EMPTY STATE
  if (!items || items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-6">
        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto text-neutral-600 animate-bounce">
          <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-neutral-900">Your cart is empty</h2>
          <p className="text-sm text-neutral-500">
            Looks like you haven't added anything to your cart yet. Explore our latest premium arrivals.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md text-sm hover:bg-primary/95 transition-colors"
        >
          <span>Explore Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Total price
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Increase quantity
  const handleIncrease = async (item) => {
    if (item.quantity >= item.stock) {
      toast.error("Not enough stock");
      return;
    }
    try {
      await dispatch(addCartItem({ productId: item.productId, quantity: item.quantity + 1 })).unwrap();
      dispatch(fetchCart());
    } catch (err) {
      toast.error(err);
    }
  };

  // Decrease quantity
  const handleDecrease = async (item) => {
    const newQty = item.quantity - 1;
    try {
      await dispatch(addCartItem({ productId: item.productId, quantity: newQty })).unwrap();
      dispatch(fetchCart());
    } catch (err) {
      toast.error(err);
    }
  };

  // Clear cart
  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        await dispatch(clearCart()).unwrap();
        toast.success("Cart cleared");
        dispatch(fetchCart());
      } catch (err) {
        toast.error(err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans min-h-[calc(100vh-20rem)]">
      <h1 className="text-3xl font-serif font-bold text-neutral-900 mb-8 border-b border-border/40 pb-4">
        Shopping Bag
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* LEFT COLUMN: Line Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="divide-y divide-border/40 border-b border-border/40">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 gap-4"
              >
                {/* Product details thumbnail & text */}
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-neutral-50 border border-border/40 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 relative">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-neutral-950/2"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 text-sm">{item.name}</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">Price: ${item.price.toFixed(2)}</p>
                  </div>
                </div>

                {/* Controls & final row price */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-8 sm:gap-12 pl-25 sm:pl-0">
                  {/* Stepper */}
                  <div className="flex items-center border border-border rounded-md bg-white shadow-sm overflow-hidden">
                    <button
                      onClick={() => handleDecrease(item)}
                      className="p-1.5 hover:bg-secondary text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-semibold text-neutral-800 select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleIncrease(item)}
                      className="p-1.5 hover:bg-secondary text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      disabled={item.quantity >= item.stock}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <p className="font-semibold text-neutral-900 text-sm sm:min-w-[70px] text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex justify-between items-center pt-2">
            <Link
              href="/products"
              className="text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-950 transition-colors"
            >
              ← Continue Shopping
            </Link>

            <button
              onClick={handleClearCart}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-red-600 hover:bg-red-50/50 px-3 py-1.5 border border-transparent rounded-md transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cart</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary Card */}
        <div className="bg-neutral-50 border border-border/40 rounded-xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-serif font-bold text-neutral-900 border-b border-border/40 pb-3">
            Order Summary
          </h2>

          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between text-neutral-500">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-900">${totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-neutral-500">
              <span>Shipping</span>
              <span className="text-green-600 font-semibold">Free</span>
            </div>

            <div className="border-t border-border/40 my-3"></div>

            <div className="flex justify-between text-base font-bold text-neutral-900 pt-1">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/customer/dashboard/orderPlace"
              className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-md hover:bg-primary/95 transition-all text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="text-[11px] text-neutral-400 text-center leading-relaxed">
            By checking out, you agree to our Terms of Service. Payment will be confirmed via EasyPaisa or COD after checkout.
          </div>
        </div>

      </div>
    </div>
  );
}
