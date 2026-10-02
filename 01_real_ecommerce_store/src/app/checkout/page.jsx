"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import {
  placeOrder,
  resetOrderState,
} from "@/redux/paymentSliceTunk/orderPlace/orderPlaceSliceTunk";
import {
  confirmPayment,
  resetPaymentState,
} from "@/redux/paymentSliceTunk/orderConfirmation/orderConfirmationSliceTunk";
import { fetchCart } from "@/redux/productsSliceTunk/cartSliceTunk";
import { hydrateGuestCart, clearGuestCart } from "@/redux/productsSliceTunk/guestCartSlice";
import { getPrimaryImageUrl } from "@/lib/productImages";

import {
  Check,
  CreditCard,
  Shield,
  AlertCircle,
  UploadCloud,
  X,
  Loader2,
  UserCircle2,
  LogIn,
  UserPlus,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DELIVERY_FEE = 300;

const emptyAddress = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  country: "",
  postalCode: "",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeOrderId = searchParams.get("orderId");

  // ── Redux state ──────────────────────────────────────────────────────────
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const { items: dbCartItems, loading: dbCartLoading } = useSelector((state) => state.cart);
  const { items: guestCartItems } = useSelector((state) => state.guestCart);

  const {
    loading: placing,
    success: placed,
    order,
    error: placeError,
  } = useSelector((state) => state.payment);

  const {
    loading: confirming,
    success: confirmed,
    error: confirmError,
  } = useSelector((state) => state.orderConfirmation);

  // ── Local state ───────────────────────────────────────────────────────────
  const [shippingAddress, setShippingAddress] = useState(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [activeOrderId, setActiveOrderId] = useState(resumeOrderId || null);
  const [codPaymentInfo, setCodPaymentInfo] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [proofImage, setProofImage] = useState("");
  const [uploadingProof, setUploadingProof] = useState(false);

  // Determine which cart to use
  const isAuthenticated = !!user;
  const cartItems = isAuthenticated ? dbCartItems : guestCartItems;
  const cartLoading = isAuthenticated ? dbCartLoading : false;

  // ── Effects ───────────────────────────────────────────────────────────────

  // Hydrate guest cart from localStorage on first client render
  useEffect(() => {
    dispatch(hydrateGuestCart());
  }, [dispatch]);

  // Reset redux slices on mount
  useEffect(() => {
    dispatch(resetOrderState());
    dispatch(resetPaymentState());
  }, [dispatch]);

  // Fetch DB cart when user is authenticated
  useEffect(() => {
    if (user && !activeOrderId && !placed) {
      dispatch(fetchCart());
    }
  }, [user, activeOrderId, placed, dispatch]);

  // Pre-fill address from user account
  useEffect(() => {
    if (user) {
      setShippingAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  // Redirect to products page if cart is empty (only after loading)
  useEffect(() => {
    if (
      !activeOrderId &&
      !placed &&
      !cartLoading &&
      !authLoading &&
      (!cartItems || cartItems.length === 0)
    ) {
      toast("🛒 Your cart is empty! Let's find something special for you! ✨", {
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
  }, [activeOrderId, placed, cartLoading, authLoading, cartItems, router]);

  // Capture COD instructions when order is placed
  useEffect(() => {
    if (placed && order) {
      setActiveOrderId(order.orderId);
      setCodPaymentInfo(order.payment?.data || null);
      toast.success("Order placed! Please submit EasyPaisa verification below.");

      // Clear guest cart from localStorage after successful order
      if (!isAuthenticated) {
        dispatch(clearGuestCart());
      }
    }
    if (placeError) {
      toast.error(placeError);
    }
  }, [placed, order, placeError, isAuthenticated, dispatch]);

  useEffect(() => {
    if (confirmed) {
      toast.success("Payment info submitted. Admin will verify shortly.");
      if (isAuthenticated) {
        router.push("/customer/dashboard/orders");
      } else {
        router.push("/");
      }
    }
    if (confirmError) {
      toast.error(confirmError);
    }
  }, [confirmed, confirmError, router, isAuthenticated]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // Validate required fields
    const required = ["fullName", "phone", "address", "city", "country"];
    const missing = required.filter((k) => !shippingAddress[k]?.trim());
    if (missing.length > 0) {
      toast.error("Please fill in all required shipping fields");
      return;
    }

    if (isAuthenticated) {
      // Authenticated: cart lives in DB, only send shipping + payment
      dispatch(placeOrder({ shippingAddress, paymentMethod }));
    } else {
      // Guest: send cart items in the request body
      const guestCartPayload = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
      dispatch(
        placeOrder({
          shippingAddress,
          paymentMethod,
          guestCart: guestCartPayload,
        })
      );
    }
  };

  const handleScreenshotUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP)");
      return;
    }

    setUploadingProof(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "03-ecommerce-COD-proof");

    try {
      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setProofImage(data.url);
        toast.success("EasyPaisa receipt screenshot uploaded! ✨");
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProofImage(reader.result);
          toast.success("EasyPaisa receipt screenshot loaded! ✨");
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result);
        toast.success("EasyPaisa receipt screenshot loaded! ✨");
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingProof(false);
    }
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

  // ── Loading / empty guard ─────────────────────────────────────────────────

  if ((authLoading || cartLoading) && !activeOrderId && !placed) {
    return (
      <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-center text-neutral-500 text-sm animate-pulse">
            Reviewing order details…
          </p>
        </div>
      </div>
    );
  }

  // Subtotal
  const subTotal =
    cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans min-h-[calc(100vh-20rem)]">

      {/* ── Step progress bar ── */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-neutral-400">
          <div className={`flex items-center gap-2 ${!activeOrderId ? "text-primary font-bold" : "text-green-600"}`}>
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px]">
              {!activeOrderId ? "1" : <Check className="w-3.5 h-3.5" />}
            </span>
            <span>Shipping & Review</span>
          </div>
          <div className="flex-1 h-px bg-neutral-200 mx-4" />
          <div className={`flex items-center gap-2 ${activeOrderId ? "text-primary font-bold" : ""}`}>
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Payment Verification</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* ── LEFT: Forms ── */}
        <div className="lg:col-span-7 space-y-6">

          {/* ── Optional Auth Banner (only for guests, only on step 1) ── */}
          {!isAuthenticated && !activeOrderId && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-3">
              <div className="flex items-start gap-3">
                <UserCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-blue-900">
                    Want a better shopping experience?
                  </p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Create an account to easily track your orders, save your information, and manage
                    your future purchases. Or just continue below as a guest — no account needed!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <Link
                  href={`/login?redirect=/checkout`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </Link>
                <Link
                  href={`/signup?redirect=/checkout`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-blue-300 bg-white hover:bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Create Account
                </Link>
                <span className="text-xs text-blue-500 font-medium">or continue as guest ↓</span>
              </div>
            </div>
          )}

          {/* ── STEP 2: EasyPaisa payment confirmation ── */}
          {activeOrderId ? (
            <div className="bg-white border border-border/40 p-6 sm:p-8 rounded-xl shadow-sm space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-green-600 font-semibold px-2 py-0.5 rounded-full bg-green-50 border border-green-200">
                  Order Placed
                </span>
                <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-2.5">
                  Complete Your Payment Deposit
                </h2>
                <p className="text-sm text-neutral-500 mt-1 leading-relaxed">
                  Your order{" "}
                  <span className="font-mono text-neutral-700 font-semibold">{activeOrderId}</span>{" "}
                  is reserved. Please deposit the delivery fee via EasyPaisa and submit the receipt
                  details below to verify your shipment.
                </p>
              </div>

              {codPaymentInfo ? (
                <div className="bg-neutral-50 border border-border/40 rounded-lg p-5 text-sm space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-200/50">
                    <span className="text-neutral-500 font-medium">Required Deposit:</span>
                    <span className="font-bold text-base text-neutral-950">
                      Rs. {codPaymentInfo.deliveryFee}
                    </span>
                  </div>
                  {codPaymentInfo.paymentMethods?.map((m) => (
                    <div key={m.type} className="space-y-1 text-xs">
                      <p className="font-bold text-neutral-800 uppercase tracking-wider">{m.type}</p>
                      <p className="text-neutral-600">
                        Account Number:{" "}
                        <span className="font-semibold text-neutral-900">{m.number}</span>
                      </p>
                      <p className="text-neutral-600">
                        Account Name:{" "}
                        <span className="font-semibold text-neutral-900">{m.accountName}</span>
                      </p>
                      <p className="text-neutral-400 mt-1 italic">{m.instructions}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-5 text-xs flex gap-3 items-start leading-relaxed">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-700" />
                  <div>
                    Please send the delivery fee deposit via EasyPaisa to{" "}
                    <span className="font-bold text-neutral-900">0335-5838659</span> (Muhammad
                    Faizan Zahid), then submit the transaction ID below.
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

                {/* Screenshot upload */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    EasyPaisa Receipt Screenshot (.PNG / .JPG)
                  </label>
                  {proofImage ? (
                    <div className="relative p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={proofImage}
                          alt="EasyPaisa Receipt Preview"
                          className="w-14 h-14 object-cover rounded-lg border border-emerald-300 shadow-xs"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Screenshot Attached
                          </p>
                          <p className="text-[11px] text-emerald-700 truncate">
                            Ready for admin verification
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProofImage("")}
                        className="p-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors text-xs flex items-center gap-1 font-medium"
                      >
                        <X className="w-4 h-4" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-neutral-300 hover:border-emerald-500 rounded-xl p-5 text-center transition-all bg-neutral-50/60 hover:bg-emerald-50/20 group cursor-pointer">
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleScreenshotUpload}
                        disabled={uploadingProof}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center space-y-2">
                        {uploadingProof ? (
                          <>
                            <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
                            <p className="text-xs font-semibold text-neutral-700">
                              Uploading receipt screenshot…
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="p-2.5 rounded-full bg-white shadow-xs border border-neutral-200 text-emerald-600 group-hover:scale-110 transition-transform">
                              <UploadCloud className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-neutral-900">
                                Click or drag PNG screenshot here
                              </p>
                              <p className="text-[11px] text-neutral-500 mt-0.5">
                                EasyPaisa payment receipt PNG, JPG or WEBP
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={confirming}
                  className="w-full bg-green-700 text-white font-semibold py-3.5 rounded hover:bg-green-800 transition-colors disabled:opacity-50 text-sm shadow-sm"
                >
                  {confirming ? "Verifying Transaction…" : "Submit Payment Verification"}
                </button>
              </form>
            </div>
          ) : (
            /* ── STEP 1: Shipping + payment method ── */
            <form
              onSubmit={handlePlaceOrder}
              className="bg-white border border-border/40 p-6 sm:p-8 rounded-xl shadow-sm space-y-8"
            >
              {/* Customer Information */}
              <div className="space-y-4">
                <div className="border-b border-border/40 pb-3">
                  <h2 className="text-xl font-serif font-bold text-neutral-950">
                    Customer Information
                  </h2>
                  {!isAuthenticated && (
                    <p className="text-xs text-neutral-400 mt-1">
                      Checking out as guest — no account required.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">
                      Full Name <span className="text-red-400">*</span>
                    </label>
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
                    <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
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
                    <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">
                      Country <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleAddressChange}
                      placeholder="e.g. Pakistan"
                      className="w-full border border-border p-2.5 rounded focus:outline-none focus:border-neutral-500 text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">
                      City <span className="text-red-400">*</span>
                    </label>
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
                    <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">
                      Postal Code
                    </label>
                    <input
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleAddressChange}
                      placeholder="e.g. 54000"
                      className="w-full border border-border p-2.5 rounded focus:outline-none focus:border-neutral-500 text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">
                      Complete Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleAddressChange}
                      placeholder="e.g. House 5, Street 12, DHA Phase 6"
                      className="w-full border border-border p-2.5 rounded focus:outline-none focus:border-neutral-500 text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h2 className="text-xl font-serif font-bold text-neutral-950 border-b border-border/40 pb-3">
                  Payment Method
                </h2>
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
                      <span className="font-semibold text-sm text-neutral-900">
                        Cash / EasyPaisa
                      </span>
                      <CreditCard className="w-4 h-4 text-neutral-500" />
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-tight mt-4">
                      Pay small deposit via EasyPaisa, pay rest on delivery.
                    </p>
                  </label>

                  <div className="border border-border/40 rounded-lg p-4 bg-neutral-50 opacity-40 cursor-not-allowed flex flex-col justify-between">
                    <span className="font-semibold text-sm text-neutral-500">Stripe Card</span>
                    <p className="text-[11px] text-neutral-400 leading-tight mt-4">
                      Credit/Debit card payment coming soon.
                    </p>
                  </div>

                  <div className="border border-border/40 rounded-lg p-4 bg-neutral-50 opacity-40 cursor-not-allowed flex flex-col justify-between">
                    <span className="font-semibold text-sm text-neutral-500">JazzCash Pay</span>
                    <p className="text-[11px] text-neutral-400 leading-tight mt-4">
                      Direct mobile wallet integration coming soon.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={placing}
                id="place-order-btn"
                className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-md hover:bg-primary/95 transition-all text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                {placing ? "Processing…" : "Place Order & Pay Deposit"}
              </button>
            </form>
          )}
        </div>

        {/* ── RIGHT: Order Summary ── */}
        <div className="lg:col-span-5 bg-neutral-50 border border-border/40 rounded-xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-serif font-bold text-neutral-900 border-b border-border/40 pb-3">
            Order Summary
          </h2>

          {/* Cart items */}
          {cartItems && cartItems.length > 0 ? (
            <div className="divide-y divide-border/40 max-h-64 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between py-3 gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white border border-border/40 rounded overflow-hidden flex items-center justify-center flex-shrink-0 relative">
                      <img
                        src={getPrimaryImageUrl(item)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-800 leading-tight line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Qty {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-neutral-950">
                    Rs. {(item.price * item.quantity)?.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-neutral-400 text-center py-4">No active cart items.</div>
          )}

          {/* Pricing breakdown */}
          <div className="border-t border-border/40 pt-4 space-y-3 text-sm">
            <div className="flex justify-between text-neutral-500">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-950">
                Rs. {subTotal?.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-neutral-500">
              <span>Shipping</span>
              <span className="text-green-600 font-semibold">Free</span>
            </div>

            {activeOrderId && codPaymentInfo && (
              <div className="flex justify-between text-neutral-500 bg-green-50 border border-green-200/50 p-2 rounded text-xs mt-1">
                <span>Verification Deposit</span>
                <span className="font-semibold text-green-700">
                  Rs. {codPaymentInfo.deliveryFee}
                </span>
              </div>
            )}

            <div className="border-t border-border/40 my-3" />

            <div className="flex justify-between text-base font-bold text-neutral-900 pt-1">
              <span>Total Amount</span>
              <span>Rs. {subTotal?.toLocaleString()}</span>
            </div>
          </div>

          {/* Secure badge */}
          <div className="bg-white rounded-lg border border-border/30 p-3.5 flex items-center gap-3 text-xs text-neutral-500">
            <Shield className="w-5 h-5 text-neutral-400 flex-shrink-0" />
            <p className="leading-tight">
              SSL Encrypted checkout. Your order and transaction details are verified manually by
              administrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
