// import { dbConnect } from "@/lib/dbConnection";
// import User from "@/models/User.model";
// import { comparePassword, signToken } from "@/lib/auth";
// import { successResponse, errorResponse } from "@/lib/response";

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const { email, password } = await req.json();
//     if (!email || !password) return errorResponse("Missing credentials", 400);

//     const user = await User.findOne({ email }).select("+password");
//     if (!user) return errorResponse("Invalid credentials", 401);

//     const ok = await comparePassword(password, user.password);
//     if (!ok) return errorResponse("Invalid credentials", 401);

//     const token = signToken({ id: user._id });
//     const userSafe = { id: user._id, name: user.name, email: user.email, role: user.role };

//     return successResponse("Logged in", { user: userSafe, token });
//   } catch (err) {
//     return errorResponse(err.message || "Login failed", 500);
//   }
// }

import { dbConnect } from "@/lib/dbConnection";
import User from "@/models/User.model";
import { comparePassword, signToken, getAuthCookieHeader } from "@/lib/auth";
import { validateBody } from "@/lib/validate";
import { z } from "zod";
import { successResponse, errorResponse } from "@/lib/response";


const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });


export async function POST(req) {
await dbConnect();
const { ok, data, error } = await validateBody(LoginSchema, req);
if (!ok) return errorResponse({ validation: error }, 400);


const { email, password } = data;
try {
const user = await User.findOne({ email }).select("+password");
if (!user) return errorResponse("Invalid credentials", 401);


const match = await comparePassword(password, user.password);
if (!match) return errorResponse("Invalid credentials", 401);


const token = signToken({ id: user._id });
const setCookie = getAuthCookieHeader(token);


const userSafe = { id: user._id, name: user.name, email: user.email, role: user.role };
return successResponse("Logged in", { user: userSafe }, 200, { "Set-Cookie": setCookie });
} catch (err) {
return errorResponse(err.message || "Login failed", 500);
}
}