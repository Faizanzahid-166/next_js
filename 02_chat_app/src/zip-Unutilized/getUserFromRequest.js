import User from "@/models/UserModel";
import mongodb from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import mongoose from "mongoose";

export async function getUserFromCookies() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");
    const token = tokenCookie?.value;

    // Create an array of objects
    console.table([
      { name: "getUserFromRequest", value: "info" },
      { name: "cookieStore", value: JSON.stringify(cookieStore.getAll()) },
      { name: "tokenCookie", value: JSON.stringify(tokenCookie) },
      { name: "token", value: token },
    ]);
    
    if (!token) return null;

    await mongodb(); // ensure DB connection

    const payload = verifyToken(token);

    // FIX: Use 'new' with ObjectId
    const user = await User.findById(new mongoose.Types.ObjectId(payload.userId)).select("-password");

    return user || null;
  } catch (err) {
    console.error("Error in getUserFromCookies:", err);
    return null;
  }
}
