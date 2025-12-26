import dbConnect from "@/lib/dbConnection";
import User from "@/models/User.model";
import { hashPassword, generateOTP,  } from "@/lib/auth";
import { sendVerificationEmail  } from "@/lib/resend";
import { z } from "zod";
import { successResponse, errorResponse } from "@/lib/response";

// Validation schema
const SignupSchema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const parsed = SignupSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { name, email, password } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse("Email already registered", 409);
    }

    const hashedPassword = await hashPassword(password);

    // Generate 6-digit OTP
    const otpObj = generateOTP(6);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp: { code: otpObj.code, expiresAt: otpObj.expiresAt },
      emailVerified: false,
    });

    // Send OTP email
    try {
      await sendVerificationEmail (email, otpObj.code);
    } catch (err) {
      console.error("Failed to send OTP email:", err);
      return errorResponse("Failed to send OTP email", 500);
    }

    return successResponse(
      "Signup successful. OTP sent to email.",
      { id: user._id, name: user.name, email: user.email },
      201
    );
  } catch (err) {
    console.error("Signup error:", err);
    return errorResponse(err.message || "Signup error", 500);
  }
}
