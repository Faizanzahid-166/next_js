import dbConnect from "@/lib/dbConnection";
import User from "@/models/User.model";
import { comparePassword, signToken, getAuthCookieHeader } from "@/lib/auth";
import { validateBody } from "@/lib/validate";
import { z } from "zod";
import { successResponse, errorResponse } from "@/lib/response";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req) {
  await dbConnect();

  const { ok, data, error } = await validateBody(LoginSchema, req);
  if (!ok) return errorResponse(error, 400);

  const { email, password } = data;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) return errorResponse("Invalid email or password", 401);

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
