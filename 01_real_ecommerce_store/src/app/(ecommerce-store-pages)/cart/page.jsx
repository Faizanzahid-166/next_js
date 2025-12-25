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
      <div className="h-screen text-center mt-20">
        <p className="text-xl mb-4">Please login to view your cart.</p>
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // Loading / error / empty states
  if (loading) return <p className="h-screen text-center mt-10">Loading cart...</p>;
  if (error) return <p className="h-screen text-center mt-10 text-red-500">{error}</p>;
  if (!items || items.length === 0)
    return <p className="h-screen text-center mt-10">Your cart is empty</p>;

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
    try {
      await dispatch(clearCart()).unwrap();
      toast.success("Cart cleared");
      dispatch(fetchCart());
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="h-screen mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-500">${item.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDecrease(item)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => handleIncrease(item)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>

            <p className="font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
        <button
          onClick={handleClearCart}
          className="px-6 py-3 bg-red-600 text-white rounded"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
