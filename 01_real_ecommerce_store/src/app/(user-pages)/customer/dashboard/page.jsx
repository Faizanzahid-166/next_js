"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { fetchMyOrders } from "@/redux/paymentSliceTunk/orderHistory/orderHistorySliceTunk";
import {
  ShoppingBag,
  Package,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  CreditCard,
  ShoppingCart,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const ORDER_STATUS_CONFIG = {
  PLACED: { label: "Order Placed", color: "bg-blue-500/10 text-blue-700 border-blue-200" },
  PROCESSING: { label: "Processing", color: "bg-amber-500/10 text-amber-700 border-amber-200" },
  SHIPPED: { label: "In Transit", color: "bg-purple-500/10 text-purple-700 border-purple-200" },
  DELIVERED: { label: "Delivered", color: "bg-emerald-500/10 text-emerald-700 border-emerald-200" },
  CANCELLED: { label: "Cancelled", color: "bg-rose-500/10 text-rose-700 border-rose-200" },
};

const PAYMENT_STATUS_CONFIG = {
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  FAILED: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function CustomerDashboardHome() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders = [], loading: ordersLoading } = useSelector((state) => state.orderHistory);
  const { cartItems = [] } = useSelector((state) => state.cart || {});

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  // Derived Metrics
  const totalOrders = orders.length;
  const activeOrders = orders.filter(
    (o) => o.orderStatus !== "DELIVERED" && o.orderStatus !== "CANCELLED"
  ).length;
  const completedOrders = orders.filter((o) => o.orderStatus === "DELIVERED").length;

  const lifetimeSpent = orders
    .filter((o) => o.paymentStatus === "PAID" || o.orderStatus === "DELIVERED")
    .reduce((sum, o) => sum + (Number(o.totalPrice) || Number(o.amount) || 0), 0);

  const totalCartCount = Array.isArray(cartItems)
    ? cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)
    : 0;

  const recentOrders = orders.slice(0, 4);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. HERO WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-950 p-6 sm:p-8 text-white shadow-xl border border-neutral-800">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>VIP Member Account</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
              Welcome back, {user?.name || "Valued Customer"}
            </h1>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Manage your orders, track shipments, inspect cart items, and manage your luxury store profile all in one central location.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 font-medium text-xs sm:text-sm transition-all transform hover:-translate-y-0.5 shadow-md"
            >
              <ShoppingBag className="w-4 h-4 text-neutral-900" />
              <span>Explore Store</span>
            </Link>
            <Link
              href="/customer/dashboard/cart"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs sm:text-sm transition-all border border-neutral-700"
            >
              <ShoppingCart className="w-4 h-4 text-neutral-300" />
              <span>View Cart ({totalCartCount})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. STATS & METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Total Orders</span>
            <div className="p-2 rounded-lg bg-neutral-100 text-neutral-800 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-neutral-900 mt-2">{totalOrders}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-neutral-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{completedOrders} Delivered</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Active Orders</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-neutral-900 mt-2">{activeOrders}</p>
          <p className="text-xs text-amber-600 mt-2 font-medium">In transit or processing</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Shopping Cart</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-neutral-900 mt-2">{totalCartCount} items</p>
          <Link href="/customer/dashboard/cart" className="text-xs text-indigo-600 hover:underline mt-2 inline-block font-medium">
            Go to Cart &rarr;
          </Link>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Lifetime Spend</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-neutral-900 mt-2">
            Rs. {lifetimeSpent.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-600 mt-2 font-medium">Verified transactions</p>
        </div>
      </div>

      {/* 3. MAIN SECTION: RECENT ORDERS & ACCOUNT OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT ORDERS (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-neutral-900">Recent Orders</h2>
              <p className="text-xs text-neutral-500">Track and view details of your latest purchases</p>
            </div>
            <Link
              href="/customer/dashboard/orders"
              className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 hover:text-amber-700 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {ordersLoading ? (
            <div className="p-8 bg-white border border-neutral-200/80 rounded-xl space-y-3 animate-pulse">
              <div className="h-4 bg-neutral-200 rounded w-1/3" />
              <div className="h-12 bg-neutral-100 rounded" />
              <div className="h-12 bg-neutral-100 rounded" />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-8 bg-white border border-neutral-200/80 rounded-xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">No orders placed yet</h3>
                <p className="text-xs text-neutral-500 mt-1">Explore our product catalog to place your first order.</p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-neutral-800 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Browse Products</span>
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-xs divide-y divide-neutral-100">
              {recentOrders.map((order) => {
                const statusCfg = ORDER_STATUS_CONFIG[order.orderStatus] || {
                  label: order.orderStatus,
                  color: "bg-neutral-100 text-neutral-700 border-neutral-200",
                };
                const payColor = PAYMENT_STATUS_CONFIG[order.paymentStatus] || "bg-neutral-100 text-neutral-700";
                const itemCount = order.items?.length || 1;
                const orderDate = order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recent";

                return (
                  <div key={order._id || order.id} className="p-4 sm:p-5 hover:bg-neutral-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-neutral-900">
                          #{order._id?.slice(-8) || order.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${payColor}`}>
                          {order.paymentStatus || "UNPAID"}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 flex items-center gap-2 pt-1">
                        <span>{orderDate}</span>
                        <span>•</span>
                        <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                        <span>•</span>
                        <span className="font-semibold text-neutral-800">Rs. {Number(order.totalPrice || order.amount || 0).toLocaleString()}</span>
                      </p>
                    </div>

                    <Link
                      href="/customer/dashboard/orders"
                      className="self-start sm:self-center px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ACCOUNT PROFILE & SHORTCUTS (1 Col) */}
        <div className="space-y-6">
          {/* Profile Summary Card */}
          <div className="bg-white border border-neutral-200/80 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center text-base font-serif font-bold shadow-sm">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-neutral-900 truncate">{user?.name}</h3>
                <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3 h-3" /> Account Verified
                </span>
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Account Type</span>
                <span className="font-medium text-neutral-900 capitalize">{user?.role || "Customer"}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Currency</span>
                <span className="font-medium text-neutral-900">PKR (Rs.)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Member Status</span>
                <span className="font-semibold text-amber-600">VIP Exclusive</span>
              </div>
            </div>
          </div>

          {/* Store Shortcuts */}
          <div className="bg-white border border-neutral-200/80 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-2">
              <Link
                href="/customer/dashboard/cart"
                className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors text-xs font-medium text-neutral-800 group"
              >
                <ShoppingCart className="w-4 h-4 text-neutral-500 group-hover:text-neutral-900" />
                <span className="flex-1">Checkout Shopping Cart</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/customer/dashboard/orderPlace"
                className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors text-xs font-medium text-neutral-800 group"
              >
                <CreditCard className="w-4 h-4 text-neutral-500 group-hover:text-neutral-900" />
                <span className="flex-1">Express Order Placement</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/customer/dashboard/orders"
                className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors text-xs font-medium text-neutral-800 group"
              >
                <Package className="w-4 h-4 text-neutral-500 group-hover:text-neutral-900" />
                <span className="flex-1">Manage Order History</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

