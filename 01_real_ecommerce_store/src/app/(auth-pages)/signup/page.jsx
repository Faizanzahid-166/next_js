"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "@/redux/authSliceTunk/authSlice";
import { toast } from "sonner";
import Link from "next/link";
import { Mail, Lock, User, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values) {
    const result = await dispatch(signupUser(values));
    if (signupUser.rejected.match(result)) {
      toast.error(result.payload?.message || "Signup failed. Please try again.");
      return;
    }
    toast.success("OTP sent to your email!");
    router.push(`/verify-otp/${encodeURIComponent(values.email)}`);
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL — Brand Identity */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)" }}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow orb */}
        <div
          className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #F59E0B, transparent 70%)" }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Zap className="w-5 h-5 text-black fill-black" />
            </div>
            <span className="text-white font-bold text-xl tracking-wide">BLITZ</span>
          </div>
        </div>

        {/* Center copy */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">Join today</span>
            <h2 className="text-4xl font-serif font-bold text-white leading-tight">
              Create your<br />free account.
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
              Join thousands of shoppers who trust Blitz for premium products, fast delivery, and secure payments.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            {[
              "Order tracking & history",
              "EasyPaisa & COD payments",
              "Exclusive member offers",
              "Hassle-free 30-day exchange",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-neutral-400 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 border-t border-neutral-800 pt-6">
          <p className="text-neutral-500 text-xs italic">
            "Your premium shopping experience starts here."
          </p>
          <p className="text-neutral-600 text-xs mt-1">— Blitz Store</p>
        </div>
      </div>

      {/* RIGHT PANEL — Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-neutral-50">
        <div className="w-full max-w-md space-y-8">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-black fill-black" />
            </div>
            <span className="font-bold text-lg tracking-wide text-neutral-900">BLITZ</span>
          </div>

          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-serif font-bold text-neutral-900">Create account</h1>
            <p className="text-sm text-neutral-500">
              Already have an account?{" "}
              <Link href="/login" className="text-amber-600 font-semibold hover:text-amber-700 transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? "border-red-300 focus:ring-red-200"
                      : "border-neutral-200 focus:ring-amber-200 focus:border-amber-400"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <span>⚠</span> {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-red-300 focus:ring-red-200"
                      : "border-neutral-200 focus:ring-amber-200 focus:border-amber-400"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <span>⚠</span> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  {...register("password")}
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-red-300 focus:ring-red-200"
                      : "border-neutral-200 focus:ring-amber-200 focus:border-amber-400"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <span>⚠</span> {errors.password.message}
                </p>
              )}
            </div>

            {/* Backend error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                {error.message || error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 active:bg-black text-white font-semibold py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* OTP note */}
          <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3">
            <span className="text-amber-500 text-base mt-0.5">📧</span>
            <div>
              <p className="text-xs font-semibold text-amber-800">Email verification required</p>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                We'll send a 6-digit OTP to your email after registration. Please check your inbox.
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-neutral-400 leading-relaxed">
            By creating an account, you agree to our{" "}
            <span className="underline cursor-pointer hover:text-neutral-600">Terms of Service</span>{" "}
            and{" "}
            <span className="underline cursor-pointer hover:text-neutral-600">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
