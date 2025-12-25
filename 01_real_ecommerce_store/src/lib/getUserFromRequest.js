// lib/getUserFromRequest.js
import User from "@/models/User.model";
import { verifyToken } from "@/lib/auth";

export async function getUserFromCookies(req) {
  try {
    if (!req || !req.headers) {
      //console.log("❌ [Auth] Request object is missing or invalid:", req);
      return null;
    }

    const cookie = req.headers.get("cookie") || "";
    const token = cookie
      .split("; ")
      .find(c => c.startsWith("token="))
      ?.split("=")[1];

    //console.log("🔑 [Auth] Cookie header:", cookie);
    //console.log("🔑 [Auth] Token:", token);

    if (!token) return null;

    const payload = await verifyToken(token);
    //console.log("🧩 [Auth] Token payload:", payload);

    if (!payload?.id) return null;

    // ✅ Ensure id is a string for MongoDB
    const user = await User.findById(payload.id);
    return user || null;

  } catch (err) {
    console.log("🔥 [Auth] getUserFromCookies error:", err);
    return null;
  }
}
