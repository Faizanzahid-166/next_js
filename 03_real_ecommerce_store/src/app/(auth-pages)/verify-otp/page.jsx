"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useState } from "react";

const OTPSchema = z.object({
  otp: z.string().min(4, "OTP must be 4 digits"),
});

export default function VerifyOTPPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");

  const [loading, setLoading] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);

  if (!email) return <p className="text-center pt-10 text-red-500">Error: email missing.</p>;

  const form = useForm({
    resolver: zodResolver(OTPSchema),
    defaultValues: { otp: "" },
  });

  // Verify OTP
  const handleVerify = async (values) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: values.otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Show resend button if OTP expired
        if (data.message?.toLowerCase().includes("expired")) {
          setOtpExpired(true);
        }
        toast.error(data.message || "Verification failed");
        setLoading(false);
        return;
      }

      toast.success("Email verified successfully!");
      router.push("/login");
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    }
    setLoading(false);
  };

  // Resend OTP
  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to resend OTP");
        return;
      }

      toast.success("New OTP sent to your email!");
      setOtpExpired(false); // hide resend button after sending
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    }
    setLoading(false);
  };

  return (
      <div className="min-h-screen">
        
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow bg-white">
      <h1 className="text-2xl font-semibold mb-4">Verify OTP</h1>
      <p className="text-gray-500 mb-4">
        OTP sent to: <b>{email}</b>
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleVerify)} className="space-y-4">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter OTP</FormLabel>
                <FormControl>
                  <Input placeholder="1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      </Form>

      {/* Show Resend OTP if expired */}
      {otpExpired && (
        <div className="mt-4 text-center">
          <p className="text-red-500 mb-2">Your OTP has expired.</p>
          <Button onClick={handleResend} disabled={loading} className="w-full">
            {loading ? "Sending..." : "Resend OTP"}
          </Button>
        </div>
      )}
    </div>
    </div>
  );
}
