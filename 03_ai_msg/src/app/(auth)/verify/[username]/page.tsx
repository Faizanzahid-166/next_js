"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { ApiResponse } from "@/types/ApiResponse";

export default function VerifyPage() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code) {
      toast.error("Please enter verification code");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post<ApiResponse>("/api/verify-code", {
        username,
        code,
      });

      toast.success(res.data.message || "Verified successfully");
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 shadow-md rounded-xl">
        <h1 className="text-2xl font-bold text-center mb-4">
          Verify Your Account
        </h1>

        <p className="text-sm text-center mb-6">
          Enter the 6-digit code sent to your email
        </p>

        <Input
          placeholder="Enter OTP"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
        />

        <Button
          className="w-full mt-4"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Verifying
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </div>
    </div>
  );
}
