"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { fetchAllOrders } from "@/redux/adminSliceTunk/adminOrdersSliceTunk";
import { fetchUsers } from "@/redux/adminSliceTunk/adminUsersRoleSliceTunk";
import { fetchProducts } from "@/redux/productsSliceTunk/productfetchSliceTunk";
import {
  DollarSign,
  ShoppingBag,
  Users,
  PackageCheck,
  TrendingUp,
  ArrowUpRight,
  PackagePlus,
  ReceiptText,
  ShieldCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const ORDER_STATUS_BADGES = {
  PLACED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-amber-50 text-amber-700 border-amber-200",
  SHIPPED: "bg-purple-50 text-purple-700 border-purple-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
};

const PAYMENT_STATUS_BADGES = {
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  FAILED: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function AdminDashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders = [], loading: ordersLoading } = useSelector((state) => state.adminOrders);
  const { users = [] } = useSelector((state) => state.adminUsers);
  const { items: products = [], total: totalProducts = 0 } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchUsers());
    dispatch(fetchProducts({ limit: 100 }));
  }, [dispatch]);

  // Derived Analytics Metrics
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "PAID" || o.orderStatus === "DELIVERED")
    .reduce((sum, o) => sum + (Number(o.totalPrice) || Number(o.amount) || 0), 0);

  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus === "PLACED" || o.orderStatus === "PROCESSING"
  ).length;

  const deliveredOrdersCount = orders.filter((o) => o.orderStatus === "DELIVERED").length;
  const cancelledOrdersCount = orders.filter((o) => o.orderStatus === "CANCELLED").length;

  const activeCustomersCount = users.filter((u) => u.role === "customer").length;
  const adminStaffCount = users.filter((u) => u.role === "admin").length;

  // Recent 5 transactions
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. EXECUTIVE HEADER BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-neutral-950 p-6 sm:p-8 text-white shadow-2xl border border-neutral-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{user?.isRoot ? "Root Admin Console" : "Store Executive Admin"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
              Blitz Store Operations Hub
            </h1>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Real-time monitoring of store revenue, customer transactions, inventory catalog, and order fulfillment workflows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/dashboard/insertProduct"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm transition-all shadow-lg shadow-emerald-950/50"
            >
              <PackagePlus className="w-4 h-4" />
              <span>Add New Product</span>
            </Link>
            <Link
              href="/admin/dashboard/orders"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs sm:text-sm transition-all border border-neutral-700"
            >
              <ReceiptText className="w-4 h-4 text-neutral-300" />
              <span>Manage Orders</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. KPI METRICS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Gross Revenue */}
        <div className="p-5 rounded-xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Gross Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-neutral-900 mt-2">
            Rs. {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Paid & Completed Orders</span>
          </div>
        </div>

        {/* KPI 2: Total Store Orders */}
        <div className="p-5 rounded-xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Orders</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-neutral-900 mt-2">{orders.length}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500">
            <span className="text-amber-600 font-medium">{pendingOrdersCount} Pending</span>
            <span>•</span>
            <span className="text-emerald-600 font-medium">{deliveredOrdersCount} Delivered</span>
          </div>
        </div>

        {/* KPI 3: Registered Customers */}
        <div className="p-5 rounded-xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Customers</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-neutral-900 mt-2">{users.length}</p>
          <p className="text-xs text-neutral-500 mt-2">
            <span className="font-semibold text-neutral-800">{activeCustomersCount} Customers</span>, {adminStaffCount} Admins
          </p>
        </div>

        {/* KPI 4: Catalog Products */}
        <div className="p-5 rounded-xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Store Catalog</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-neutral-900 mt-2">
            {totalProducts || products.length} Products
          </p>
          <Link href="/admin/dashboard/insertProduct" className="text-xs text-purple-600 hover:underline mt-2 inline-block font-medium">
            Manage Catalog &rarr;
          </Link>
        </div>
      </div>

      {/* 3. STORE QUICK MANAGEMENT TOOLBAR */}
      <div className="bg-white border border-neutral-200/80 rounded-xl p-5 shadow-xs">
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">Quick Management Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/dashboard/insertProduct"
            className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:shadow-md transition-all group bg-neutral-50/50 hover:bg-white"
          >
            <div className="p-3 rounded-lg bg-neutral-900 text-white group-hover:scale-105 transition-transform">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Insert Product</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Upload new items & pricing</p>
            </div>
          </Link>

          <Link
            href="/admin/dashboard/orders"
            className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:shadow-md transition-all group bg-neutral-50/50 hover:bg-white"
          >
            <div className="p-3 rounded-lg bg-emerald-600 text-white group-hover:scale-105 transition-transform">
              <ReceiptText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Orders & Statuses</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Fulfill COD & Stripe orders</p>
            </div>
          </Link>

          <Link
            href="/admin/dashboard/adminUserRole"
            className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:shadow-md transition-all group bg-neutral-50/50 hover:bg-white"
          >
            <div className="p-3 rounded-lg bg-indigo-600 text-white group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">User Roles</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Promote admins & staff</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 4. MAIN ANALYTICS & RECENT TRANSACTIONS STREAM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT ORDERS TABLE (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-neutral-900">Recent Store Transactions</h2>
              <p className="text-xs text-neutral-500">Live order activity from customers across all payment gateways</p>
            </div>
            <Link
              href="/admin/dashboard/orders"
              className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 hover:text-emerald-700 transition-colors"
            >
              <span>View All Transactions</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {ordersLoading ? (
            <div className="p-8 bg-white border border-neutral-200/80 rounded-xl space-y-3 animate-pulse">
              <div className="h-4 bg-neutral-200 rounded w-1/3" />
              <div className="h-12 bg-neutral-100 rounded" />
              <div className="h-12 bg-neutral-100 rounded" />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-8 bg-white border border-neutral-200/80 rounded-xl text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-neutral-400 mx-auto" />
              <p className="text-sm font-medium text-neutral-700">No transactions recorded yet.</p>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-xs divide-y divide-neutral-100">
              {recentOrders.map((order) => {
                const statusBadge = ORDER_STATUS_BADGES[order.orderStatus] || "bg-neutral-100 text-neutral-700 border-neutral-200";
                const payBadge = PAYMENT_STATUS_BADGES[order.paymentStatus] || "bg-neutral-100 text-neutral-700 border-neutral-200";
                const orderDate = order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Recent";

                return (
                  <div key={order._id || order.id} className="p-4 sm:p-5 hover:bg-neutral-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-neutral-900">
                          #{order._id?.slice(-8) || order.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${statusBadge}`}>
                          {order.orderStatus || "PLACED"}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${payBadge}`}>
                          {order.paymentStatus || "UNPAID"}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-600 truncate">
                        Customer: <span className="font-semibold text-neutral-900">{order.shippingAddress?.fullName || order.user?.email || "Guest"}</span>
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                        <span>{orderDate}</span>
                        <span>•</span>
                        <span>{order.paymentMethod || "CARD"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-start sm:self-center">
                      <span className="text-sm font-bold font-serif text-neutral-900">
                        Rs. {Number(order.totalPrice || order.amount || 0).toLocaleString()}
                      </span>
                      <Link
                        href={`/admin/dashboard/orders?userId=${order.userId || ""}`}
                        className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all"
                      >
                        Manage Order
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FULFILLMENT & SYSTEM METRICS (1 Col) */}
        <div className="space-y-6">
          {/* Fulfillment Status Breakdown Card */}
          <div className="bg-white border border-neutral-200/80 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 font-serif">Order Status Pipeline</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-amber-700 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Pending / Processing
                  </span>
                  <span className="text-neutral-900 font-bold">{pendingOrdersCount}</span>
                </div>
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${orders.length ? (pendingOrdersCount / orders.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Delivered
                  </span>
                  <span className="text-neutral-900 font-bold">{deliveredOrdersCount}</span>
                </div>
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${orders.length ? (deliveredOrdersCount / orders.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-rose-700 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> Cancelled
                  </span>
                  <span className="text-neutral-900 font-bold">{cancelledOrdersCount}</span>
                </div>
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all"
                    style={{ width: `${orders.length ? (cancelledOrdersCount / orders.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* System & Staff Snapshot Card */}
          <div className="bg-white border border-neutral-200/80 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 font-serif">Admin Overview</h3>
            <div className="divide-y divide-neutral-100 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-neutral-500">Logged Admin</span>
                <span className="font-semibold text-neutral-900">{user?.name}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-neutral-500">Role Authority</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase text-[10px]">
                  {user?.isRoot ? "Root Admin" : "Store Admin"}
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-neutral-500">Store Front Status</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Active / Live
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

