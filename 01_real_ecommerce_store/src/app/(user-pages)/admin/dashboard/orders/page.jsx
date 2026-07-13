"use client";

import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  fetchAllOrders,
  updateOrderStatus,
} from "@/redux/adminSliceTunk/adminOrdersSliceTunk";

const paymentStatusColors = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
};

const ORDER_STATUS_OPTIONS = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const PAYMENT_STATUS_OPTIONS = ["PENDING", "PAID", "FAILED"];

function AdminOrdersContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get("userId") || "";

  const { orders, loading, error } = useSelector((state) => state.adminOrders);
  const [paymentFilter, setPaymentFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  useEffect(() => {
    dispatch(
      fetchAllOrders({
        userId: userIdParam || undefined,
        paymentStatus: paymentFilter || undefined,
        paymentMethod: methodFilter || undefined,
      })
    );
  }, [dispatch, userIdParam, paymentFilter, methodFilter]);

  const handleStatusChange = (orderId, field, value) => {
    dispatch(
      updateOrderStatus({
        orderId,
        [field]: value,
      })
    )
      .unwrap()
      .then(() => toast.success("Order updated"))
      .catch((err) => toast.error(err));
  };

  const clearUserFilter = () => {
    router.push("/admin/dashboard/orders");
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-purple-700">
          {userIdParam ? "Customer Order & Product History" : "Transaction History"}
        </h1>

        <div className="flex gap-3">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Payment Status</option>
            {PAYMENT_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Methods</option>
            <option value="COD">COD</option>
            <option value="STRIPE">Stripe</option>
            <option value="PAIKER">Paiker</option>
          </select>

          {userIdParam && (
            <button
              onClick={clearUserFilter}
              className="px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Clear customer filter
            </button>
          )}
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && orders?.length === 0 && (
        <p className="text-center text-gray-500 py-10">No orders found.</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left font-semibold">Order</th>
              <th className="px-3 py-3 text-left font-semibold">Customer</th>
              <th className="px-3 py-3 text-left font-semibold">Items</th>
              <th className="px-3 py-3 text-left font-semibold">Total</th>
              <th className="px-3 py-3 text-left font-semibold">Payment</th>
              <th className="px-3 py-3 text-left font-semibold">Transaction ID</th>
              <th className="px-3 py-3 text-left font-semibold">Order Status</th>
              <th className="px-3 py-3 text-left font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders?.map((order) => (
              <tr key={order._id || order.id} className="hover:bg-gray-50 align-top">
                <td className="px-3 py-3 font-mono text-xs">
                  {(order._id || order.id).slice(-12).toUpperCase()}
                </td>
                <td className="px-3 py-3">
                  <p className="font-medium text-xs text-gray-700 break-all">{order.user_id || "Unknown"}</p>
                  {!userIdParam && order.user_id && (
                    <button
                      onClick={() =>
                        router.push(`/admin/dashboard/orders?userId=${order.user_id}`)
                      }
                      className="text-indigo-600 text-xs hover:underline mt-1"
                    >
                      View history
                    </button>
                  )}
                </td>
                <td className="px-3 py-3">
                  {order.items?.map((it, idx) => (
                    <p key={idx} className="text-xs text-gray-600">
                      {it.name} × {it.quantity}
                    </p>
                  ))}
                </td>
                <td className="px-3 py-3 font-semibold">
                  ${order.pricing?.totalAmount?.toFixed(2)}
                </td>
                <td className="px-3 py-3">
                  <p className="text-xs mb-1">
                    {order.payment?.method}
                    {order.payment?.channel ? ` / ${order.payment.channel}` : ""}
                  </p>
                  <select
                    value={order.payment?.status}
                    onChange={(e) =>
                      handleStatusChange(order._id || order.id, "paymentStatus", e.target.value)
                    }
                    className={`text-xs rounded-full px-2 py-1 border-none ${paymentStatusColors[order.payment?.status] || ""
                      }`}
                  >
                    {PAYMENT_STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-3 text-xs">
                  {order.payment?.transactionId || "—"}
                  {order.payment?.proofImage && (
                    <>
                      <br />
                      <a
                        href={order.payment.proofImage}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        View proof
                      </a>
                    </>
                  )}
                </td>
                <td className="px-3 py-3">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id || order.id, "orderStatus", e.target.value)
                    }
                    className="text-xs border rounded-lg px-2 py-1"
                  >
                    {ORDER_STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-3 text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
      <AdminOrdersContent />
    </Suspense>
  );
}
