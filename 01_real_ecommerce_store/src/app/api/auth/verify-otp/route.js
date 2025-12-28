import dbConnect from "@/lib/dbConnection";
import User from "@/models/User.model";
import { z } from "zod";
import { signToken, getAuthCookieHeader } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";

export const runtime = "nodejs"; // Required for bcrypt/jose/mongoose

const VerifySchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const parsed = VerifySchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { email, otp } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) return errorResponse("User not found", 404);

    if (!user.otp?.code) {
      return errorResponse("OTP not available. Please request a new one.", 400);
    }

    // Check OTP expiry
    if (Date.now() > new Date(user.otp.expiresAt).getTime()) {
      return errorResponse("OTP expired. Request a new OTP.", 400);
    }

    // Compare OTP
   // Compare OTP
if (otp !== user.otp.code) {
  return errorResponse("Invalid OTP", 400);
}

// Mark verified and clear OTP
user.emailVerified = true;
user.otp = undefined; // ✅ FIX
await user.save();

// Sign JWT
const token = await signToken({ id: user._id });
const cookie = getAuthCookieHeader(token);

return successResponse(
  "Email verified successfully",
  {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  },
  200,
  { "Set-Cookie": cookie }
);

  } catch (err) {
    console.error("Verify OTP error:", err);
    return errorResponse(err.message || "OTP verification failed", 500);
  }
}
