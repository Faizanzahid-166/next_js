"use client";

import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { placeOrder, resetOrderState } from "@/redux/paymentSliceTunk/orderPlace/orderPlaceSliceTunk";
import { confirmPayment, resetPaymentState } from "@/redux/paymentSliceTunk/orderConfirmation/orderConfirmationSliceTunk";

const emptyAddress = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  country: "",
  postalCode: "",
};

function CheckoutContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeOrderId = searchParams.get("orderId");

  const { user } = useSelector((state) => state.auth);
  const { loading: placing, success: placed, order, error: placeError } = useSelector(
    (state) => state.payment
  );
  const {
    loading: confirming,
    success: confirmed,
    error: confirmError,
  } = useSelector((state) => state.orderConfirmation);

  const [shippingAddress, setShippingAddress] = useState(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [activeOrderId, setActiveOrderId] = useState(resumeOrderId || null);
  const [codPaymentInfo, setCodPaymentInfo] = useState(null); // deliveryFee + EasyPaisa instructions
  const [transactionId, setTransactionId] = useState("");
  const [proofImage, setProofImage] = useState("");

  // Reset redux slices on mount so stale state from a previous checkout doesn't leak in
  useEffect(() => {
    dispatch(resetOrderState());
    dispatch(resetPaymentState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once order is placed successfully, capture COD/EasyPaisa instructions
  useEffect(() => {
    if (placed && order) {
      setActiveOrderId(order.orderId);
      setCodPaymentInfo(order.payment?.data || null);
      toast.success("Order placed! Please complete EasyPaisa payment below.");
    }
    if (placeError) {
      toast.error(placeError);
    }
  }, [placed, order, placeError]);

  useEffect(() => {
    if (confirmed) {
      toast.success("Payment info submitted. Admin will verify shortly.");
      router.push("/customer/dashboard/orders");
    }
    if (confirmError) {
      toast.error(confirmError);
    }
  }, [confirmed, confirmError, router]);

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (Object.values(shippingAddress).some((v) => !v.trim())) {
      toast.error("Please fill in all shipping address fields");
      return;
    }

    dispatch(placeOrder({ shippingAddress, paymentMethod }));
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();

    if (!transactionId.trim()) {
      toast.error("Please enter your EasyPaisa transaction ID");
      return;
    }

    dispatch(
      confirmPayment({
        orderId: activeOrderId,
        paymentData: {
          paymentMethod: "COD",
          channel: "EASYPAISA",
          transactionId: transactionId.trim(),
          proofImage: proofImage.trim() || undefined,
        },
      })
    );
  };

  if (!user) {
    return <p className="text-center mt-20">Please login to checkout.</p>;
  }

  // ---------- STEP 2: EasyPaisa payment confirmation ----------
  if (activeOrderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-xl shadow max-w-lg w-full">
          <h2 className="text-xl font-bold mb-2">Complete Your COD Payment</h2>
          <p className="text-gray-600 mb-4">
            Order <span className="font-mono">{activeOrderId}</span> has been placed.
            Please send the delivery fee via EasyPaisa and submit your transaction ID
            below so we can confirm your order.
          </p>

          {codPaymentInfo ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-sm">
              <p className="font-semibold mb-1">
                Delivery Fee: Rs. {codPaymentInfo.deliveryFee}
              </p>
              {codPaymentInfo.paymentMethods?.map((m) => (
                <div key={m.type} className="mt-2">
                  <p className="font-medium">{m.type}</p>
                  <p>Number: {m.number}</p>
                  <p>Account Name: {m.accountName}</p>
                  <p className="text-gray-500">{m.instructions}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-sm">
              Please send the delivery fee via EasyPaisa to{" "}
              <span className="font-semibold">0335-5838659</span> (Muhammad Faizan
              Zahid), then submit your transaction ID below.
            </div>
          )}

          <form onSubmit={handleConfirmPayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                EasyPaisa Transaction ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. 8823456123"
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Payment Screenshot URL (optional)
              </label>
              <input
                type="text"
                value={proofImage}
                onChange={(e) => setProofImage(e.target.value)}
                placeholder="Paste a link to your payment screenshot"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={confirming}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-60"
            >
              {confirming ? "Submitting..." : "Submit EasyPaisa Payment"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---------- STEP 1: shipping address + payment method ----------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handlePlaceOrder}
        className="bg-white p-6 rounded-xl shadow max-w-2xl w-full space-y-6"
      >
        <h2 className="text-xl font-bold">Checkout</h2>

        <div>
          <h3 className="font-semibold mb-3">Shipping Address</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="fullName"
              value={shippingAddress.fullName}
              onChange={handleAddressChange}
              placeholder="Full Name"
              className="border rounded-lg px-3 py-2"
            />
            <input
              name="phone"
              value={shippingAddress.phone}
              onChange={handleAddressChange}
              placeholder="Phone Number"
              className="border rounded-lg px-3 py-2"
            />
            <input
              name="address"
              value={shippingAddress.address}
              onChange={handleAddressChange}
              placeholder="Street Address"
              className="border rounded-lg px-3 py-2 md:col-span-2"
            />
            <input
              name="city"
              value={shippingAddress.city}
              onChange={handleAddressChange}
              placeholder="City"
              className="border rounded-lg px-3 py-2"
            />
            <input
              name="country"
              value={shippingAddress.country}
              onChange={handleAddressChange}
              placeholder="Country"
              className="border rounded-lg px-3 py-2"
            />
            <input
              name="postalCode"
              value={shippingAddress.postalCode}
              onChange={handleAddressChange}
              placeholder="Postal Code"
              className="border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Payment Method</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <label
              className={`border rounded-xl p-4 cursor-pointer ${
                paymentMethod === "COD" ? "border-green-600 ring-2 ring-green-200" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
                className="mr-2"
              />
              <span className="font-medium">Cash on Delivery</span>
              <p className="text-xs text-gray-500 mt-1">
                Pay delivery fee via EasyPaisa, rest on delivery.
              </p>
            </label>

            <div className="border rounded-xl p-4 opacity-50 cursor-not-allowed">
              <span className="font-medium">Stripe (Card)</span>
              <p className="text-xs text-gray-500 mt-1">Coming soon</p>
            </div>

            <div className="border rounded-xl p-4 opacity-50 cursor-not-allowed">
              <span className="font-medium">Paiker (JazzCash)</span>
              <p className="text-xs text-gray-500 mt-1">Coming soon</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={placing}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
        >
          {placing ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<p className="text-center mt-20">Loading checkout...</p>}>
      <CheckoutContent />
    </Suspense>
  );
}
