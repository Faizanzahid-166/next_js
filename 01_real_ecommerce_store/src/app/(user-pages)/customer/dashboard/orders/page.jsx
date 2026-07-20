"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "@/redux/paymentSliceTunk/orderHistory/orderHistorySliceTunk";
import Link from "next/link";
import { ShoppingBag, ChevronDown, ChevronUp, Calendar, Box, Receipt } from "lucide-react";

const paymentStatusColors = {
  PENDING: "bg-amber-50 text-amber-700 border border-amber-200/40",
  PAID: "bg-green-50 text-green-700 border border-green-200/40",
  FAILED: "bg-red-50 text-red-700 border border-red-200/40",
};

const orderStatusColors = {
  PLACED: "bg-blue-50 text-blue-700 border border-blue-200/40",
  PROCESSING: "bg-indigo-50 text-indigo-700 border border-indigo-200/40",
  SHIPPED: "bg-purple-50 text-purple-700 border border-purple-200/40",
  DELIVERED: "bg-green-50 text-green-700 border border-green-200/40",
  CANCELLED: "bg-red-50 text-red-700 border border-red-200/40",
};

export default function OrdersHistoryPage() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orderHistory);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  // 1. LOADING STATE
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white border border-border/40 rounded-xl shadow-sm space-y-6 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-neutral-200 rounded w-36"></div>
          <div className="h-10 bg-neutral-200 rounded w-24"></div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-16 bg-neutral-200 rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  // 2. ERROR STATE
  if (error) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center bg-white border border-border/40 rounded-xl shadow-sm space-y-4">
        <span className="text-3xl">⚠️</span>
        <h2 className="text-xl font-serif font-bold text-neutral-900">Failed to load order history</h2>
        <p className="text-xs text-neutral-500">{error}</p>
        <button
          onClick={() => dispatch(fetchMyOrders())}
          className="px-4 py-2 bg-primary text-primary-foreground rounded text-xs font-semibold hover:bg-primary/95"
        >
          Try Again
        </button>
      </div>
    );
  }

  // 3. EMPTY STATE
  if (orders?.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center bg-white border border-border/40 rounded-xl shadow-sm space-y-6">
        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto text-neutral-500">
          <Box className="w-6 h-6 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-serif font-bold text-neutral-900">No purchases found</h2>
          <p className="text-xs text-neutral-500">
            You haven't placed any orders yet. Explore our storefront to make your first purchase.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-block px-5 py-2 rounded bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wider hover:bg-primary/95 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-border/40 shadow-sm max-w-4xl mx-auto font-sans">
      <div className="flex items-center justify-between border-b border-border/40 pb-6 mb-6">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Customer Area</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mt-1">My Orders</h1>
        </div>
        <Link
          href="/products"
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/95 text-xs font-semibold shadow-sm transition-colors"
        >
          New Order
        </Link>
      </div>

      <div className="space-y-4">
        {orders?.map((order) => {
          const isOpen = expandedId === order._id;
          return (
            <div
              key={order._id}
              className={`border border-border/60 rounded-xl overflow-hidden bg-white transition-all ${
                isOpen ? "ring-1 ring-neutral-900/10 shadow-sm" : "hover:border-neutral-300"
              }`}
            >
              <button
                onClick={() => setExpandedId(isOpen ? null : order._id)}
                className="w-full flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 text-left gap-4"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-neutral-900 text-sm">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span>&middot;</span>
                    <span>{order.items?.length || 0} item(s)</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      orderStatusColors[order.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                  
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      paymentStatusColors[order.payment?.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.payment?.method} &middot; {order.payment?.status}
                  </span>

                  <span className="font-bold text-neutral-950 text-sm ml-2">
                    ${order.pricing?.totalAmount?.toFixed(2)}
                  </span>
                  
                  <div className="text-neutral-400 ml-2 hidden sm:block">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-6 border-t border-border/40 pt-5 space-y-6 bg-neutral-50/20">
                  {/* Items List */}
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Purchased Items</span>
                    </h4>
                    <div className="bg-white rounded-lg border border-border/40 divide-y divide-border/20 overflow-hidden">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs p-3 hover:bg-neutral-50/50"
                        >
                          <div className="flex items-center gap-3">
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-9 h-9 object-cover rounded border border-border/30"
                              />
                            )}
                            <div className="space-y-0.5">
                              <p className="font-semibold text-neutral-900">{item.name}</p>
                              <p className="text-neutral-400">Qty {item.quantity} &middot; ${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <span className="font-semibold text-neutral-950">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed border-t border-border/30 pt-5">
                    
                    {/* Shipping Address */}
                    <div className="bg-white p-4 rounded-lg border border-border/40 space-y-2">
                      <h4 className="font-semibold text-neutral-900 border-b border-border/25 pb-1">
                        Shipping Address
                      </h4>
                      <p className="text-neutral-600">
                        <span className="font-bold text-neutral-900">{order.shippingAddress?.fullName}</span> <br />
                        {order.shippingAddress?.address}, {order.shippingAddress?.city} <br />
                        {order.shippingAddress?.country} - {order.shippingAddress?.postalCode} <br />
                        Phone: <span className="font-medium text-neutral-800">{order.shippingAddress?.phone}</span>
                      </p>
                    </div>

                    {/* Payment details */}
                    <div className="bg-white p-4 rounded-lg border border-border/40 space-y-2">
                      <h4 className="font-semibold text-neutral-900 border-b border-border/25 pb-1 flex items-center gap-1">
                        <Receipt className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Payment Details</span>
                      </h4>
                      <div className="space-y-1 text-neutral-600">
                        <p>Method: <span className="font-semibold text-neutral-800">{order.payment?.method}{order.payment?.channel ? ` (${order.payment.channel})` : ""}</span></p>
                        <p>Status: <span className={`font-semibold ${order.payment?.status === "PAID" ? "text-green-600" : "text-neutral-600"}`}>{order.payment?.status}</span></p>
                        {order.payment?.transactionId && (
                          <p>Transaction ID: <span className="font-mono text-neutral-900 font-medium">{order.payment.transactionId}</span></p>
                        )}
                        <div className="border-t border-neutral-100 my-1.5"></div>
                        <p className="flex justify-between"><span>Subtotal:</span> <span className="font-semibold text-neutral-850">${order.pricing?.subTotal?.toFixed(2)}</span></p>
                        <p className="flex justify-between"><span>Delivery Charge:</span> <span className="font-semibold text-neutral-850">${order.pricing?.deliveryCharge?.toFixed(2)}</span></p>
                        <p className="flex justify-between border-t border-neutral-100 pt-1 text-sm font-bold text-neutral-950">
                          <span>Total Paid:</span> <span>${order.pricing?.totalAmount?.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Submission CTA for COD pending deposit */}
                  {order.payment?.method === "COD" &&
                    order.payment?.status === "PENDING" &&
                    !order.payment?.transactionId && (
                      <div className="border-t border-border/30 pt-5 flex justify-end">
                        <Link
                          href={`/customer/dashboard/orderPlace?orderId=${order._id}`}
                          className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded text-xs font-semibold shadow-sm transition-colors"
                        >
                          Submit EasyPaisa Deposit Verification
                        </Link>
                      </div>
                    )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
