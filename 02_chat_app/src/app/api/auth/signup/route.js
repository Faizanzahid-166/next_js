// src/app/api/auth/signup/route.js
import mongodb from "@/lib/mongodb";
import User from "@/models/UserModel";
import { hashPassword, signToken, getAuthCookieHeader } from "@/lib/auth";
import { signupSchema } from "@/lib/validation";
import { successResponse, errorResponse } from "@/lib/response";

export async function POST(req) {
  try {
    await mongodb();

    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { name, email, password } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse("Email already registered", 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      emailVerified: false,
      role: "customer", // force customer role
    });

    const token = signToken({ userId: user._id,  role: user.role });// change 2

 

    return successResponse(
      "Signup successful",
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // important for frontend routing
      },
      201,
      // { "Set-Cookie": getAuthCookieHeader(token) } // set here
    );



  } catch (err) {
    console.error("Signup error:", err);
    return errorResponse(err.message || "Signup error", 500);
  }
}
