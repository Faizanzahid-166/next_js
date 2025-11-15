// import { dbConnect } from "@/lib/db";
// import User from "@/models/User.model";
// import { hashPassword, signToken, generateOTP } from "@/lib/auth";
// import { successResponse, errorResponse } from "@/lib/response";

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();
//     const { name, email, password } = body;
//     if (!name || !email || !password) return errorResponse("Missing fields", 400);

//     const existing = await User.findOne({ email });
//     if (existing) return errorResponse("Email already exists", 409);

//     const hashed = await hashPassword(password);
//     const otpObj = generateOTP();

//     const user = await User.create({
//       name,
//       email,
//       password: hashed,
//       otp: { code: otpObj.code, expiresAt: otpObj.expiresAt },
//       emailVerified: false
//     });

//     // TODO: send OTP by email/SMS (use nodemailer or external service)
//     // sendOtpEmail(email, otpObj.code);

//     const token = signToken({ id: user._id });
//     const userSafe = { id: user._id, name: user.name, email: user.email, role: user.role };

//     return successResponse("User created. Verify OTP sent to email.", { user: userSafe, token }, 201);
//   } catch (err) {
//     return errorResponse(err.message || "Signup failed", 500);
//   }
// }

import { dbConnect } from "@/lib/dbConnection";
import User from "@/models/User.model";
import { hashPassword, signToken, generateOTP, getAuthCookieHeader } from "@/lib/auth";
import { sendOtpEmail } from "@/lib/mailer";
import { validateBody } from "@/lib/validate";
import { z } from "zod";
import { successResponse, errorResponse } from "@/lib/response";


const SignupSchema = z.object({
name: z.string().min(2),
email: z.string().email(),
password: z.string().min(6),
});


export async function POST(req) {
await dbConnect();
const { ok, data, error } = await validateBody(SignupSchema, req);
if (!ok) return errorResponse({ validation: error }, 400);


const { name, email, password } = data;
try {
const existing = await User.findOne({ email });
if (existing) return errorResponse("Email already registered", 409);


const hashed = await hashPassword(password);
const otpObj = generateOTP();


const user = await User.create({
name,
email,
password: hashed,
otp: { code: otpObj.code, expiresAt: otpObj.expiresAt },
emailVerified: false,
});


// send OTP
await sendOtpEmail(email, otpObj.code).catch(err => console.log("otp email error", err));


const token = signToken({ id: user._id });
const setCookie = getAuthCookieHeader(token);


const userSafe = { id: user._id, name: user.name, email: user.email, role: user.role };


return successResponse("User created. OTP sent.", { user: userSafe }, 201, { "Set-Cookie": setCookie });
} catch (err) {
return errorResponse(err.message || "Signup error", 500);
}
}