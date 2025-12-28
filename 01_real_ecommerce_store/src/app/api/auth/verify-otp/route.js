import dbConnect from "@/lib/dbConnection";
import User from "@/models/User.model";
import { signToken, getAuthCookieHeader } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";

export const runtime = "nodejs"; // Required for bcrypt/jose/mongoose

export async function POST(req) {
  try {
    await dbConnect();

    const { email, otp } = await req.json();
    if (!email || !otp) return errorResponse("Email and OTP are required", 400);

    const user = await User.findOne({ email });
    if (!user) return errorResponse("User not found", 404);

    if (user.emailVerified) return errorResponse("Email already verified", 400);
    if (!user.otp?.code) return errorResponse("OTP not available. Request a new one.", 400);

    // Check expiry
    if (new Date() > new Date(user.otp.expiresAt)) {
      return errorResponse("OTP expired. Request a new OTP.", 400);
    }

    // Compare OTP (string comparison)
    if (otp !== user.otp.code) return errorResponse("Invalid OTP", 400);

    // Mark verified and clear OTP
    user.emailVerified = true;
    user.otp = undefined;
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
