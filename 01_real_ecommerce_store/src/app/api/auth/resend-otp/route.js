import dbConnect from "@/lib/dbConnection";
import User from "@/models/User.model";
import { generateOTP } from "@/lib/auth";
import { rateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { sendVerificationEmail } from "@/lib/resend";
import { successResponse, errorResponse } from "@/lib/response";
import { normalizeEmail } from "@/lib/otpVerification";

export async function POST(req) {
  try {
    const body = await req.json();
    const email = normalizeEmail(body?.email);
    const limit = rateLimit(req, `auth:resend-otp:${email || "unknown"}`, 3, 60_000);
    if (limit.limited) return rateLimitResponse(limit);

    await dbConnect();

    if (!email) return errorResponse("Email is required", 400);

    const user = await User.findOne({ email });
    if (!user) {
      return successResponse("If an account exists, a new verification code has been sent.", { email });
    }

    if (user.emailVerified) {
      return errorResponse("This email has already been verified.", 409, {}, "EMAIL_ALREADY_VERIFIED");
    }

    const otpObj = generateOTP();
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id, emailVerified: false },
      {
        $set: {
          otp: { code: otpObj.code, expiresAt: otpObj.expiresAt },
          otpAttempts: 0,
          otpLastSentAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return errorResponse("This email has already been verified.", 409, {}, "EMAIL_ALREADY_VERIFIED");
    }

    await sendVerificationEmail(email, updatedUser.name, otpObj.code).catch(err =>
      console.error("OTP email error:", err)
    );

    return successResponse("A new verification code has been sent.", { email: updatedUser.email });
  } catch (err) {
    console.error("Resend OTP error:", err);
    return errorResponse(err.message || "Resend OTP failed", 500);
  }
}

