// src/app/api/auth/signup.js
import dbConnect from "@/lib/dbConnection";
import User from "@/models/User.model";
import { hashPassword, generateOTP } from "@/lib/auth";
import { sendOtpEmail } from "@/lib/nodemailer";
import { z } from "zod";
import bcrypt from "bcryptjs";
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

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse("Email already registered", 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate OTP
    const otpObj = generateOTP(); // { code, expiresAt }
    const otpHashed = await bcrypt.hash(otpObj.code, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp: {
        code: otpHashed,
        expiresAt: otpObj.expiresAt,
      },
      emailVerified: false,
    });

    // Send OTP email
    try {
      await sendOtpEmail(email, otpObj.code);
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
