import dbConnect from "@/lib/dbConnection";
import User from "@/models/User.model";
import { comparePassword, signToken, getAuthCookieHeader } from "@/lib/auth";
import { rateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { z } from "zod";
import { successResponse, errorResponse } from "@/lib/response";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req) {
  const body = await req.json();
  const limit = rateLimit(req, `auth:login:${body?.email || "unknown"}`, 5, 60_000);
  if (limit.limited) return rateLimitResponse(limit);

  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

  const { email, password } = parsed.data;

  await dbConnect();

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) return errorResponse("Invalid email or password", 401);
    if (!user.emailVerified) return errorResponse("Email not verified. Please verify OTP before logging in.", 403);

    const match = await comparePassword(password, user.password);
    if (!match) return errorResponse("Invalid email or password", 401);

    const token = await signToken({ id: user._id }); // ✅ await token

    const cookieHeader = getAuthCookieHeader(token);

    const userSafe = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return successResponse(
      "Logged in successfully",
      userSafe,
      200, // status
      { "Set-Cookie": cookieHeader } // headers
    );

  } catch (err) {
    console.error("Login error:", err);
    return errorResponse(err.message || "Login failed", 500);
  }
}

