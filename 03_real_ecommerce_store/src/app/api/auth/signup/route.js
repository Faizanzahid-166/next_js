import { dbConnect } from "@/lib/db";
import User from "@/models/User.model";
import { hashPassword, signToken, generateOTP } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const { name, email, password } = body;
    if (!name || !email || !password) return errorResponse("Missing fields", 400);

    const existing = await User.findOne({ email });
    if (existing) return errorResponse("Email already exists", 409);

    const hashed = await hashPassword(password);
    const otpObj = generateOTP();

    const user = await User.create({
      name,
      email,
      password: hashed,
      otp: { code: otpObj.code, expiresAt: otpObj.expiresAt },
      emailVerified: false
    });

    // TODO: send OTP by email/SMS (use nodemailer or external service)
    // sendOtpEmail(email, otpObj.code);

    const token = signToken({ id: user._id });
    const userSafe = { id: user._id, name: user.name, email: user.email, role: user.role };

    return successResponse("User created. Verify OTP sent to email.", { user: userSafe, token }, 201);
  } catch (err) {
    return errorResponse(err.message || "Signup failed", 500);
  }
}
