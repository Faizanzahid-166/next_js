// import { dbConnect } from "@/lib/dbConnection";
// import User from "@/models/User.model";
// import { successResponse, errorResponse } from "@/lib/response";

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const { email, code } = await req.json();
//     if (!email || !code) return errorResponse("Missing email or code", 400);

//     const user = await User.findOne({ email });
//     if (!user) return errorResponse("User not found", 404);

//     if (!user.otp || user.otp.code !== code) return errorResponse("Invalid OTP", 400);
//     if (new Date() > new Date(user.otp.expiresAt)) return errorResponse("OTP expired", 400);

//     user.emailVerified = true;
//     user.otp = undefined;
//     await user.save();

//     return successResponse("Email verified", { email: user.email });
//   } catch (err) {
//     return errorResponse(err.message || "OTP verify failed", 500);
//   }
// }

import { dbConnect } from "@/lib/dbConnection";
import User from "@/models/User.model";
import { validateBody } from "@/lib/validate";
import { z } from "zod";
import { successResponse, errorResponse } from "@/lib/response";


const VerifySchema = z.object({ email: z.string().email(), code: z.string().min(4) });


export async function POST(req) {
await dbConnect();
const { ok, data, error } = await validateBody(VerifySchema, req);
if (!ok) return errorResponse({ validation: error }, 400);


const { email, code } = data;
try {
const user = await User.findOne({ email });
if (!user) return errorResponse("User not found", 404);


if (!user.otp || user.otp.code !== code) return errorResponse("Invalid code", 400);
if (new Date() > new Date(user.otp.expiresAt)) return errorResponse("OTP expired", 400);


user.emailVerified = true;
user.otp = undefined;
await user.save();


return successResponse("Email verified", { email: user.email });
} catch (err) {
return errorResponse(err.message || "Verify failed", 500);
}
}
