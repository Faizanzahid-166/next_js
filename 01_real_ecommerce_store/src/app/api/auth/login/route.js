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

  // validate request body
  const { ok, data, error } = await validateBody(LoginSchema, req);
  if (!ok) return errorResponse(error, 400);

  const { email, password } = data;

  try {
    // check user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) return errorResponse("Invalid email or password", 401);

    // optionally block unverified email
    // if (!user.emailVerified) return errorResponse("Please verify your email", 403);

    // compare password
    const match = await comparePassword(password, user.password);
    if (!match) return errorResponse("Invalid email or password", 401);

    // generate token
    const token = signToken({ id: user._id });

    // create cookie header
    const cookieHeader = getAuthCookieHeader(token);

    // safe user object
    const userSafe = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return new Response(
      JSON.stringify({
        message: "Logged in",
        user: userSafe,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookieHeader,
        },
      }
    );

  } catch (err) {
    console.error("Login error:", err);
    return errorResponse(err.message || "Login failed", 500);
  }
}
