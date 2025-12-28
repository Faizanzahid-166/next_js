import dbConnect from "@/lib/dbConnection";
import User from "@/models/User.model";
import { generateOTP } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/resend"; // ✅ use correct export
import { successResponse, errorResponse } from "@/lib/response";

export async function POST(req) {
  try {
    await dbConnect();

    const { email } = await req.json();
    if (!email) return errorResponse("Email is required", 400);

    const user = await User.findOne({ email });
    if (!user) return errorResponse("User not found", 404);
    if (user.emailVerified) return errorResponse("Email already verified", 400);

    // Generate new OTP
    const otpObj = generateOTP();
    user.otp = { code: otpObj.code, expiresAt: otpObj.expiresAt };
    await user.save();

    // Send OTP email
    await sendVerificationEmail(email, user.name, otpObj.code).catch(err =>
      console.error("OTP email error:", err)
    );

    return successResponse("New OTP sent", { email: user.email });
  } catch (err) {
    console.error("Resend OTP error:", err);
    return errorResponse(err.message || "Resend OTP failed", 500);
  }
}
