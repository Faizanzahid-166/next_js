import User from "@/models/User.model";
import connectDB from "@/lib/dbConnection";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function getUserFromCookies() {
  try {
    console.log("📌 getUserFromCookies() called");

    // Must await cookies()
    const cookieStore = await cookies();

    console.log("🍪 ALL COOKIES:", cookieStore.getAll());

    const tokenCookie = cookieStore.get("token");
    console.log("🍪 TOKEN COOKIE:", tokenCookie);

    const token = tokenCookie?.value;
    console.log("🔑 TOKEN VALUE:", token);

    if (!token) {
      console.log("❌ No token found");
      return null;
    }

    await connectDB();
    console.log("🔗 DB connected");

    const payload = verifyToken(token);
    console.log("🧩 PAYLOAD:", payload);

    const user = await User.findById(payload.id).select("-password");
    console.log("👤 USER:", user);

    return user || null;

  } catch (err) {
    console.error("🔥 ERROR in getUserFromCookies:", err);
    return null;
  }
}
