// src/app/api/auth/login/route.js
import mongodb from "@/lib/mongodb";
import User from "@/models/UserModel";
import {
  comparePassword,
  signToken,
  getAuthCookieHeader,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { successResponse,errorResponse } from "@/lib/response";

export async function POST(req) {
  try {
    await mongodb();

    // validate request body
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.message, 400);
    }

    const { email, password } = parsed.data;

    // check user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    // compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return errorResponse("Invalid email or password", 401);
    }

    // generate token (CONSISTENT PAYLOAD)
    const token = await signToken({ userId: user._id.toString(),role: user.role });

    // create cookie
    const setCookie = getAuthCookieHeader(token);

    // safe user object
    const userSafe = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

      const response = successResponse(
      "Login successful",
      {
       user: userSafe
      },
      200,
       { "Set-Cookie": setCookie } 
    );

    return response
  } catch (err) {
    console.error("Login error:", err);
    return errorResponse("Login failed", 500);
  }
}
