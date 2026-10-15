import dbConnect from "@/lib/dbConnection";
import User from "@/models/User.model";
import { signToken, getAuthCookieHeader } from "@/lib/auth";
import { rateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { successResponse, errorResponse } from "@/lib/response";
import { normalizeEmail, evaluateOtpVerification } from "@/lib/otpVerification";

export const runtime = "nodejs"; // Required for bcrypt/jose/mongoose

export async function POST(req) {
  try {
    const body = await req.json();
    const email = normalizeEmail(body?.email);
    const limit = rateLimit(req, `auth:verify-otp:${email || "unknown"}`, 5, 60_000);
    if (limit.limited) return rateLimitResponse(limit);

    await dbConnect();

    const { otp } = body;
    if (!email || !otp) return errorResponse("Email and OTP are required", 400);

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse("Invalid or expired OTP. Please request a new one.", 400, {}, "INVALID_OTP");
    }

    const verificationState = evaluateOtpVerification({
      emailVerified: Boolean(user.emailVerified),
      otpCode: user.otp?.code,
      submittedOtp: otp,
      expiresAt: user.otp?.expiresAt,
      otpAttempts: user.otpAttempts || 0,
      now: Date.now(),
    });

    if (verificationState.code === "INVALID_OTP" || verificationState.code === "OTP_ATTEMPT_LIMIT_EXCEEDED") {
      const nextAttempts = (user.otpAttempts || 0) + 1;
      const shouldClearOtp = verificationState.code === "OTP_ATTEMPT_LIMIT_EXCEEDED" || !user.otp?.code;
      await User.findByIdAndUpdate(user._id, {
        $set: {
          otpAttempts: shouldClearOtp ? 0 : nextAttempts,
          otp: shouldClearOtp ? null : user.otp,
        },
      });
      return errorResponse(verificationState.message, verificationState.status, {}, verificationState.code);
    }

    if (verificationState.code === "OTP_EXPIRED" || verificationState.code === "OTP_NOT_FOUND") {
      await User.findByIdAndUpdate(user._id, {
        $set: { otp: null, otpAttempts: 0 },
      });
      return errorResponse(verificationState.message, verificationState.status, {}, verificationState.code);
    }

    if (verificationState.code === "EMAIL_ALREADY_VERIFIED") {
      return errorResponse(verificationState.message, verificationState.status, {}, verificationState.code);
    }

    const verifiedUser = await User.findOneAndUpdate(
      {
        _id: user._id,
        emailVerified: false,
        "otp.code": String(otp).trim(),
        "otp.expiresAt": { $gt: new Date() },
      },
      {
        $set: {
          emailVerified: true,
          otp: null,
          otpAttempts: 0,
          otpLastSentAt: null,
        },
      },
      { new: true }
    );

    if (!verifiedUser) {
      const freshUser = await User.findById(user._id);
      if (freshUser?.emailVerified) {
        return errorResponse("This email has already been verified.", 409, {}, "EMAIL_ALREADY_VERIFIED");
      }

      if (!freshUser?.otp?.code) {
        return errorResponse("Verification code is missing or expired. Please request a new one.", 400, {}, "OTP_EXPIRED");
      }

      await User.findByIdAndUpdate(user._id, {
        $set: {
          otpAttempts: (freshUser.otpAttempts || 0) + 1,
        },
      });

      return errorResponse("Invalid OTP.", 400, {}, "INVALID_OTP");
    }

    const token = await signToken({ id: verifiedUser._id });
    const cookie = getAuthCookieHeader(token);

    return successResponse(
      "Email verified successfully",
      {
        user: {
          id: verifiedUser._id,
          name: verifiedUser.name,
          email: verifiedUser.email,
          role: verifiedUser.role,
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

