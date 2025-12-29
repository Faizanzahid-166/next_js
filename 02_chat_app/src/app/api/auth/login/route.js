// src/app/api/auth/login/route.js
import mongodb from "@/lib/mongodb";
import User from "@/models/UserModel";
import { comparePassword, signToken, getAuthCookieHeader } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { successResponse, errorResponse } from "@/lib/response";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // 1️⃣ Connect to MongoDB
    await mongodb();

    // 2️⃣ Validate request body
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.message, 400);
    }

    const { email, password } = parsed.data;

    // 3️⃣ Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) return errorResponse("Invalid email or password", 401);

    // 4️⃣ Compare password
    const match = await comparePassword(password, user.password);
    if (!match) return errorResponse("Invalid email or password", 401);

    // 5️⃣ Sign JWT using JOSE
    const token = await signToken({
      userId: user._id.toString(),
      role: user.role,
    });

    // 6️⃣ Set cookie (HttpOnly, secure, maxAge)
    const setCookie = getAuthCookieHeader(token);

    // 7️⃣ Prepare safe user object
    const userSafe = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // 8️⃣ Return response with cookie
    return new NextResponse(
      JSON.stringify({
        status: "success",
        message: "Login successful",
        data: { user: userSafe },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": setCookie, // ✅ ensures browser stores JWT
        },
      }
    );
  } catch (err) {
    console.error("Login error:", err);
    return errorResponse("Login failed", 500);
  }
}
