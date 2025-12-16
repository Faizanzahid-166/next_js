"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  addToCart,
  clearCartAPI,
} from "@/redux/productsSliceTunk/cartSliceTunk";
import { toast } from "sonner";
import Link from "next/link";

export default function CartPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items, loading, error } = useSelector((state) => state.cart);

  // Fetch cart on page load only if logged in
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCart(user._id));
    }
  }, [user, dispatch]);

  // If user not logged in
  if (!user) {
    return (
      <div className="text-center mt-20">
        <p className="text-xl mb-4">Please login to view your cart.</p>
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // Calculate total
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleIncrease = async (item) => {
    if (item.quantity + 1 > item.stock) return toast.error("Not enough stock");
    await dispatch(addToCart({ productId: item.productId, quantity: item.quantity + 1, userId: user._id })).unwrap();
    toast.success("Quantity updated");
  };

  const handleDecrease = async (item) => {
    const newQty = item.quantity - 1;
    if (newQty === 0) {
      await dispatch(addToCart({ productId: item.productId, quantity: 0, userId: user._id })).unwrap();
      toast.success("Item removed");
    } else {
      await dispatch(addToCart({ productId: item.productId, quantity: newQty, userId: user._id })).unwrap();
      toast.success("Quantity updated");
    }
  };

  const handleClearCart = async () => {
    await dispatch(clearCartAPI(user._id)).unwrap();
    toast.success("Cart cleared");
  };

  if (loading) return <p className="text-center mt-10">Loading cart...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (items.length === 0) return <p className="text-center mt-10">Your cart is empty</p>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 gap-6">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-4">
              <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-500">${item.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => handleDecrease(item)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
              <span className="px-3">{item.quantity}</span>
              <button onClick={() => handleIncrease(item)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
            </div>

            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
        <button onClick={handleClearCart} className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700">Clear Cart</button>
      </div>
    </div>
  );
}
