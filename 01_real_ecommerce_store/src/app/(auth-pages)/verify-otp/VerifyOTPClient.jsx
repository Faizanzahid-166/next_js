'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { Zap, ArrowRight, RotateCcw, ShieldCheck } from 'lucide-react';

const OTPSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});

export default function VerifyOTPClient({ email }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(30);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(OTPSchema),
    defaultValues: { otp: '' },
  });

  const handleVerify = async (values) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: values.otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.message?.toLowerCase().includes('expired')) setOtpExpired(true);
        toast.error(data.message || 'Verification failed');
        return;
      }
      toast.success('Email verified successfully!');
      router.push('/login');
    } catch (err) {
      console.error(err);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (loading || resendCooldown) return;
    setLoading(true);
    setResendCooldown(true);
    setCooldownSeconds(30);

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Failed to resend OTP');
        return;
      }
      toast.success('New OTP sent to your email!');
      setOtpExpired(false);

      // Countdown timer
      let secs = 30;
      const interval = setInterval(() => {
        secs--;
        setCooldownSeconds(secs);
        if (secs <= 0) {
          clearInterval(interval);
          setResendCooldown(false);
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error('Network error.');
      setResendCooldown(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL — Brand */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)' }}
      >
        {/* Grid bg */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow */}
        <div
          className="absolute bottom-1/3 left-1/3 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #F59E0B, transparent 70%)' }}
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

        {/* Center content */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">Almost there</span>
            <h2 className="text-4xl font-serif font-bold text-white leading-tight">
              Verify your<br />email address.
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
              We've sent a secure 6-digit code to your email. Enter it to complete your account setup.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {[
              { step: "1", label: "Account created", done: true },
              { step: "2", label: "OTP sent to email", done: true },
              { step: "3", label: "Verify & activate", done: false },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    item.done
                      ? 'bg-amber-500 text-black'
                      : 'bg-neutral-800 border border-neutral-600 text-neutral-400'
                  }`}
                >
                  {item.done ? '✓' : item.step}
                </div>
                <span className={`text-sm ${item.done ? 'text-neutral-300' : 'text-amber-400 font-semibold'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 border-t border-neutral-800 pt-6">
          <p className="text-neutral-500 text-xs">Check your spam folder if you don't see the email.</p>
        </div>
      </div>

      {/* RIGHT PANEL — OTP Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-neutral-50">
        <div className="w-full max-w-md space-y-8">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-black fill-black" />
            </div>
            <span className="font-bold text-lg tracking-wide text-neutral-900">BLITZ</span>
          </div>

          {/* Header */}
          <div className="space-y-1">
            <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-7 h-7 text-amber-500" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-neutral-900">Check your email</h1>
            <p className="text-sm text-neutral-500">
              We sent a 6-digit code to{' '}
              <span className="font-semibold text-neutral-800 break-all">{email}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleVerify)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                6-Digit OTP Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="· · · · · ·"
                {...register('otp')}
                className={`w-full px-4 py-4 bg-white border rounded-xl text-center text-2xl font-bold tracking-[0.5em] text-neutral-900 placeholder:text-neutral-300 placeholder:tracking-[0.3em] focus:outline-none focus:ring-2 transition-all ${
                  errors.otp
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-neutral-200 focus:ring-amber-200 focus:border-amber-400'
                }`}
              />
              {errors.otp && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <span>⚠</span> {errors.otp.message}
                </p>
              )}
            </div>

            {/* Expired state */}
            {otpExpired && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                <span>⏰</span>
                <span>Your OTP has expired. Please request a new one.</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify Email</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Resend section */}
          <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={loading || resendCooldown}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                resendCooldown || loading
                  ? 'border-neutral-200 text-neutral-400 cursor-not-allowed bg-neutral-50'
                  : 'border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100'
              }`}
            >
              <RotateCcw className={`w-4 h-4 ${loading && !resendCooldown ? 'animate-spin' : ''}`} />
              {resendCooldown
                ? `Resend in ${cooldownSeconds}s`
                : loading
                ? 'Sending...'
                : 'Resend OTP'}
            </button>
            <p className="text-xs text-neutral-400 text-center">
              Also check your spam or junk mail folder.
            </p>
          </div>

          {/* Back to login */}
          <div className="text-center">
            <Link
              href="/login"
              className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors font-medium"
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
