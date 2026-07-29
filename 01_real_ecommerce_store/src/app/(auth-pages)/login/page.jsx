"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/authSliceTunk/authSlice";
import { toast } from "sonner";
import Link from "next/link";
import { Mail, Lock, Zap, ArrowRight, ShoppingBag } from "lucide-react";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values) {
    const result = await dispatch(loginUser(values));
    if (loginUser.rejected.match(result)) {
      toast.error(result.payload?.message || "Login failed. Please try again.");
      return;
    }
    toast.success("Welcome back!");
    router.push("/customer/dashboard");
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL — Brand Identity */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)" }}
      >
        {/* Background grid pattern */}
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
          className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
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
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">Welcome back</span>
            <h2 className="text-4xl font-serif font-bold text-white leading-tight">
              Your premium<br />store awaits.
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
              Sign in to access your orders, track deliveries, and shop thousands of premium products.
            </p>
          </div>

          {/* Feature pills */}
          <div className="space-y-3">
            {[
              { icon: "⚡", text: "Fast EasyPaisa & COD checkout" },
              { icon: "📦", text: "Real-time order tracking" },
              { icon: "🔒", text: "Secure & encrypted transactions" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <span className="text-neutral-400 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 border-t border-neutral-800 pt-6">
          <p className="text-neutral-500 text-xs italic">
            "Shop fast, pay easy, delivered to your door."
          </p>
          <p className="text-neutral-600 text-xs mt-1">— Blitz Store Promise</p>
        </div>
      </div>

      {/* RIGHT PANEL — Login Form */}
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
            <h1 className="text-3xl font-serif font-bold text-neutral-900">Sign in</h1>
            <p className="text-sm text-neutral-500">
              New to Blitz?{" "}
              <Link href="/signup" className="text-amber-600 font-semibold hover:text-amber-700 transition-colors">
                Create an account
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

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
                  placeholder="••••••••"
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
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-neutral-400 font-medium">Or continue with</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Alt CTA */}
          <Link
            href="/products"
            className="w-full flex items-center justify-center gap-2 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 font-semibold py-3 rounded-xl text-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-amber-500" />
            <span>Browse without account</span>
          </Link>

          {/* Footer note */}
          <p className="text-center text-xs text-neutral-400 leading-relaxed">
            By signing in, you agree to our{" "}
            <span className="underline cursor-pointer hover:text-neutral-600">Terms of Service</span>{" "}
            and{" "}
            <span className="underline cursor-pointer hover:text-neutral-600">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
