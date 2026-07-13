"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "@/redux/paymentSliceTunk/orderHistory/orderHistorySliceTunk";
import Link from "next/link";

const paymentStatusColors = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
};

const orderStatusColors = {
  PLACED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function OrdersHistoryPage() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orderHistory);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-purple-700">My Orders</h1>
        <Link
          href="/customer/dashboard/orderPlace"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
        >
          New Order
        </Link>
      </div>

      {loading && <p className="text-gray-500">Loading your orders...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && orders?.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          You haven&apos;t placed any orders yet.
        </p>
      )}

      <div className="space-y-4">
        {orders?.map((order) => {
          const isOpen = expandedId === order._id;
          return (
            <div key={order._id} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedId(isOpen ? null : order._id)}
                className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 text-left"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()} &middot;{" "}
                    {order.items?.length || 0} item(s)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      orderStatusColors[order.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      paymentStatusColors[order.payment?.status] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.payment?.method} · {order.payment?.status}
                  </span>
                  <span className="font-bold text-gray-800 ml-2">
                    ${order.pricing?.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="p-5 border-t space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Items</h3>
                    <div className="space-y-2">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-3">
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <span>
                              {item.name} × {item.quantity}
                            </span>
                          </div>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">
                        Shipping Address
                      </h3>
                      <p className="text-gray-600">
                        {order.shippingAddress?.fullName} <br />
                        {order.shippingAddress?.address}, {order.shippingAddress?.city}
                        <br />
                        {order.shippingAddress?.country} -{" "}
                        {order.shippingAddress?.postalCode} <br />
                        {order.shippingAddress?.phone}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">
                        Payment Details
                      </h3>
                      <p className="text-gray-600">
                        Method: {order.payment?.method}
                        {order.payment?.channel ? ` (${order.payment.channel})` : ""}
                        <br />
                        Status: {order.payment?.status}
                        <br />
                        {order.payment?.transactionId && (
                          <>Transaction ID: {order.payment.transactionId} <br /></>
                        )}
                        Subtotal: ${order.pricing?.subTotal?.toFixed(2)} <br />
                        Delivery: ${order.pricing?.deliveryCharge?.toFixed(2)} <br />
                        <span className="font-semibold">
                          Total: ${order.pricing?.totalAmount?.toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {order.payment?.method === "COD" &&
                    order.payment?.status === "PENDING" &&
                    !order.payment?.transactionId && (
                      <Link
                        href={`/customer/dashboard/orderPlace?orderId=${order._id}`}
                        className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                      >
                        Submit EasyPaisa Payment
                      </Link>
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
