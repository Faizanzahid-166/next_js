"use client";

import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { placeOrder, resetOrderState } from "@/redux/paymentSliceTunk/orderPlace/orderPlaceSliceTunk";
import { confirmPayment, resetPaymentState } from "@/redux/paymentSliceTunk/orderConfirmation/orderConfirmationSliceTunk";
import { fetchCart } from "@/redux/productsSliceTunk/cartSliceTunk";
import { Check, CreditCard, Shield, Truck, AlertCircle } from "lucide-react";

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
  const { items, loading: cartLoading } = useSelector((state) => state.cart);
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
  const [codPaymentInfo, setCodPaymentInfo] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [proofImage, setProofImage] = useState("");

  // Reset redux slices on mount
  useEffect(() => {
    dispatch(resetOrderState());
    dispatch(resetPaymentState());
  }, [dispatch]);

  // Fetch cart on mount if user exists
  useEffect(() => {
    if (user && !activeOrderId && !placed) {
      dispatch(fetchCart());
    }
  }, [user, activeOrderId, placed, dispatch]);

  // Redirect to products page if cart is empty
  useEffect(() => {
    if (
      user &&
      !activeOrderId &&
      !placed &&
      !cartLoading &&
      (!items || items.length === 0)
    ) {
      toast("🛒 Your cart is empty! Let's explore our amazing collection and find something special for you! ✨", {
        duration: 5000,
        style: {
          background: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
          color: "#fff",
          border: "none",
          fontWeight: "600",
        },
      });
      router.push("/products");
    }
  }, [user, activeOrderId, placed, cartLoading, items, router]);

  // Capture COD/EasyPaisa instructions when order is placed
  useEffect(() => {
    if (placed && order) {
      setActiveOrderId(order.orderId);
      setCodPaymentInfo(order.payment?.data || null);
      toast.success("Order placed! Please submit EasyPaisa verification below.");
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
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <p className="text-lg text-neutral-500 mb-4">Please log in to proceed to checkout.</p>
        <button
          onClick={() => router.push("/login?redirect=/customer/dashboard/orderPlace")}
          className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md text-sm hover:bg-primary/95"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (cartLoading && !activeOrderId && !placed) {
    return (
      <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-center text-neutral-500 text-sm animate-pulse">Reviewing order details...</p>
        </div>
      </div>
    );
  }

  // Calculate Subtotal for the preview
  const totalPrice = items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans min-h-[calc(100vh-20rem)]">
      
      {/* Visual Step Progress Bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-neutral-400">
          <div className={`flex items-center gap-2 ${!activeOrderId ? "text-primary font-bold" : "text-green-600"}`}>
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px]">
              {!activeOrderId ? "1" : <Check className="w-3.5 h-3.5" />}
            </span>
            <span>Shipping & Review</span>
          </div>
          <div className="flex-1 h-px bg-neutral-200 mx-4"></div>
          <div className={`flex items-center gap-2 ${activeOrderId ? "text-primary font-bold" : ""}`}>
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
            <span>Payment Verification</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: Forms */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* STEP 2: EasyPaisa payment confirmation */}
          {activeOrderId ? (
            <div className="bg-white border border-border/40 p-6 sm:p-8 rounded-xl shadow-sm space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-green-600 font-semibold px-2 py-0.5 rounded-full bg-green-50 border border-green-200">Order Placed</span>
                <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-2.5">Complete Your Payment Deposit</h2>
                <p className="text-sm text-neutral-500 mt-1 leading-relaxed">
                  Your order <span className="font-mono text-neutral-700 font-semibold">{activeOrderId}</span> is reserved. Please deposit the delivery fee via EasyPaisa and submit the receipt details below to verify your shipment.
                </p>
              </div>

              {codPaymentInfo ? (
                <div className="bg-neutral-50 border border-border/40 rounded-lg p-5 text-sm space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-200/50">
                    <span className="text-neutral-500 font-medium">Required Deposit:</span>
                    <span className="font-bold text-base text-neutral-950">Rs. {codPaymentInfo.deliveryFee}</span>
                  </div>
                  {codPaymentInfo.paymentMethods?.map((m) => (
                    <div key={m.type} className="space-y-1 text-xs">
                      <p className="font-bold text-neutral-800 uppercase tracking-wider">{m.type}</p>
                      <p className="text-neutral-600">Account Number: <span className="font-semibold text-neutral-900">{m.number}</span></p>
                      <p className="text-neutral-600">Account Name: <span className="font-semibold text-neutral-900">{m.accountName}</span></p>
                      <p className="text-neutral-400 mt-1 italic">{m.instructions}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-5 text-xs flex gap-3 items-start leading-relaxed">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-700" />
                  <div>
                    Please send the delivery fee deposit via EasyPaisa to <span className="font-bold text-neutral-900">0335-5838659</span> (Muhammad Faizan Zahid), then submit the transaction ID below.
                  </div>
                </div>
              )}

              <form onSubmit={handleConfirmPayment} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    EasyPaisa Transaction ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. 8823456123"
                    className="w-full border border-border p-2.5 rounded focus:outline-none focus:border-neutral-500 text-sm"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Screenshot URL (optional)
                  </label>
                  <input
                    type="text"
                    value={proofImage}
                    onChange={(e) => setProofImage(e.target.value)}
                    placeholder="Paste your image upload URL here"
                    className="w-full border border-border p-2.5 rounded focus:outline-none focus:border-neutral-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={confirming}
                  className="w-full bg-green-700 text-white font-semibold py-3.5 rounded hover:bg-green-800 transition-colors disabled:opacity-50 text-sm shadow-sm"
                >
                  {confirming ? "Verifying Transaction..." : "Submit Payment Verification"}
                </button>
              </form>
            </div>
          ) : (
            /* STEP 1: shipping address + payment method */
            <form onSubmit={handlePlaceOrder} className="bg-white border border-border/40 p-6 sm:p-8 rounded-xl shadow-sm space-y-8">
              
              {/* Shipping Form */}
              <div className="space-y-4">
                <h2 className="text-xl font-serif font-bold text-neutral-950 border-b border-border/40 pb-3">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">Full Name</label>
                    <input
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleAddressChange}
                      placeholder="e.g. Alexander Cole"
                      className="w-full border border-border p-2.5 rounded focus:outline-none focus:border-neutral-500 text-sm"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">Phone Number</label>
                    <input
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleAddressChange}
                      placeholder="e.g. +92 300 1234567"
                      className="w-full border border-border p-2.5 rounded focus:outline-none focus:border-neutral-500 text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">Postal Code</label>
                    <input
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleAddressChange}
                      placeholder="e.g. 54000"
                      className="w-full border border-border p-2.5 rounded focus:outline-none focus:border-neutral-500 text-sm"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">Street Address</label>
                    <input
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleAddressChange}
                      placeholder="e.g. Apartment, suite, unit, road name"
                      className="w-full border border-border p-2.5 rounded focus:outline-none focus:border-neutral-500 text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">City</label>
                    <input
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      placeholder="e.g. Lahore"
                      className="w-full border border-border p-2.5 rounded focus:outline-none focus:border-neutral-500 text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">Country</label>
                    <input
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleAddressChange}
                      placeholder="e.g. Pakistan"
                      className="w-full border border-border p-2.5 rounded focus:outline-none focus:border-neutral-500 text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-4">
                <h2 className="text-xl font-serif font-bold text-neutral-950 border-b border-border/40 pb-3">Payment Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  <label
                    className={`border rounded-lg p-4 cursor-pointer relative flex flex-col justify-between transition bg-white ${
                      paymentMethod === "COD"
                        ? "border-neutral-900 ring-1 ring-neutral-900 shadow-sm"
                        : "border-border/60 hover:bg-neutral-50/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-center w-full">
                      <span className="font-semibold text-sm text-neutral-900">Cash / EasyPaisa</span>
                      <CreditCard className="w-4 h-4 text-neutral-500" />
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-tight mt-4">
                      Pay small deposit via EasyPaisa, pay rest on delivery.
                    </p>
                  </label>

                  <div className="border border-border/40 rounded-lg p-4 bg-neutral-50 opacity-40 cursor-not-allowed flex flex-col justify-between">
                    <span className="font-semibold text-sm text-neutral-500">Stripe Card</span>
                    <p className="text-[11px] text-neutral-400 leading-tight mt-4">Credit/Debit card payment coming soon.</p>
                  </div>

                  <div className="border border-border/40 rounded-lg p-4 bg-neutral-50 opacity-40 cursor-not-allowed flex flex-col justify-between">
                    <span className="font-semibold text-sm text-neutral-500">JazzCash Pay</span>
                    <p className="text-[11px] text-neutral-400 leading-tight mt-4">Direct mobile wallet integration coming soon.</p>
                  </div>

                </div>
              </div>

              <button
                type="submit"
                disabled={placing}
                className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-md hover:bg-primary/95 transition-all text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                {placing ? "Processing..." : "Place Order & Pay Deposit"}
              </button>

            </form>
          )}
        </div>

        {/* RIGHT COLUMN: Order Summary Receipt */}
        <div className="lg:col-span-5 bg-neutral-50 border border-border/40 rounded-xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-serif font-bold text-neutral-900 border-b border-border/40 pb-3">
            Review Items
          </h2>

          {/* Cart items list */}
          {items && items.length > 0 ? (
            <div className="divide-y divide-border/40 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between py-3 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white border border-border/40 rounded overflow-hidden flex items-center justify-center flex-shrink-0 relative">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-neutral-950/2"></div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-800 leading-tight line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Qty {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-neutral-950">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-neutral-400 text-center py-4">No active cart items.</div>
          )}

          {/* Price Breakdown */}
          <div className="border-t border-border/40 pt-4 space-y-3 text-sm">
            <div className="flex justify-between text-neutral-500">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-950">${totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-neutral-500">
              <span>Shipping</span>
              <span className="text-green-600 font-semibold">Free</span>
            </div>

            {activeOrderId && codPaymentInfo && (
              <div className="flex justify-between text-neutral-500 bg-green-50 border border-green-200/50 p-2 rounded text-xs mt-1">
                <span>Verification Deposit</span>
                <span className="font-semibold text-green-700">Rs. {codPaymentInfo.deliveryFee}</span>
              </div>
            )}

            <div className="border-t border-border/40 my-3"></div>

            <div className="flex justify-between text-base font-bold text-neutral-900 pt-1">
              <span>Total Amount</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Secure Trust Badge */}
          <div className="bg-white rounded-lg border border-border/30 p-3.5 flex items-center gap-3 text-xs text-neutral-500">
            <Shield className="w-5 h-5 text-neutral-400 flex-shrink-0" />
            <p className="leading-tight">
              SSL Encrypted checkout. Your order and deposit transaction details are verified manually by administrators.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<p className="text-center mt-20 text-sm text-neutral-500">Loading checkout session...</p>}>
      <CheckoutContent />
    </Suspense>
  );
}
