// // middleware helper to use inside routes
// import { verifyToken } from "./auth";
// import User from "@/models/User.model";
// import { dbConnect } from "./dbConnection";

// export async function getUserFromAuthHeader(req) {
//   const auth = req.headers.get("authorization") || "";
//   const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
//   if (!token) return null;
//   await dbConnect();
//   try {
//     const payload = verifyToken(token);
//     const user = await User.findById(payload.id).select("-password");
//     return user;
//   } catch (err) {
//     return null;
//   }
// }

import { parse } from "cookie";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User.model";
import { connectDB } from "@/lib/dbConnection";


export async function getUserFromRequest(req) {
const cookieHeader = req.headers.get("cookie") || "";
const cookies = parse(cookieHeader || "");
const token = cookies.token;
if (!token) return null;
try {
await connectDB();
const payload = verifyToken(token);
const user = await User.findById(payload.id).select("-password");
return user;
} catch (err) {
return null;
}
}