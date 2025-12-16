// src/app/api/auth/verify-otp.js
import dbConnect from "@/lib/dbConnection";
import User from "@/models/User.model";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { signToken, getAuthCookieHeader } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";

const VerifySchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().min(4, "OTP must be at least 4 digits"),
});

export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  const parsed = VerifySchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0].message, 400);
  }

  const { email, otp } = parsed.data;

  try {
    const user = await User.findOne({ email });
    if (!user) return errorResponse("User not found", 404);

    if (!user.otp?.code) {
      return errorResponse("OTP not available. Please request a new one.", 400);
    }

    // Check OTP expiry
    if (Date.now() > new Date(user.otp.expiresAt).getTime()) {
      return errorResponse("OTP expired. Request a new OTP.", 400);
    }

    // Compare hashed OTP
    const validOtp = await bcrypt.compare(otp, user.otp.code);
    if (!validOtp) return errorResponse("Invalid OTP", 400);

    // Mark email as verified and clear OTP
    user.emailVerified = true;
    user.otp = { code: null, expiresAt: null };
    await user.save();

    // Sign JWT and set cookie
    const token = signToken({ id: user._id });
    const cookie = getAuthCookieHeader(token);

    return new Response(
      JSON.stringify({
        message: "Email verified successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookie,
        },
      }
    );

  } catch (err) {
    console.error("Verify OTP error:", err);
    return errorResponse(err.message || "OTP verification failed", 500);
  }
}
