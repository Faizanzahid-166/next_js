'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const OTPSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});

export default function VerifyOTPPage() {
  const params = useParams();
  const router = useRouter();
  const email = params?.email ? decodeURIComponent(params.email) : '';

  const [loading, setLoading] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(OTPSchema),
    defaultValues: { otp: '' },
  });

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-center text-lg">Error: email missing.</p>
      </div>
    );
  }

  const handleVerify = async (values) => {
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
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
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
    } catch (err) {
      console.error(err);
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full border p-6 rounded-2xl pt-10">
        <h1 className="text-2xl font-semibold mb-4">Verify OTP</h1>
        <p className="text-gray-500 mb-4">
          OTP sent to: <b>{email}</b>
        </p>

        <form onSubmit={handleSubmit(handleVerify)} className="space-y-4">
          <Input placeholder="123456" {...register('otp')} />
          {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </form>

        {otpExpired && (
          <div className="mt-4 text-center">
            <p className="text-red-500 mb-2">Your OTP has expired.</p>
            <Button onClick={handleResend} disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Resend OTP'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
