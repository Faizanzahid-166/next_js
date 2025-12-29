// src/lib/getUserFromRequest.js
import User from "@/models/UserModel";
import mongodb from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth"; // Edge-safe jose verifyToken
import { cookies } from "next/headers";

/**
 * Get logged-in user
 * @param {string} token Optional JWT token (for Socket.IO)
 */
export async function getUserFromCookies(token) {
  try {
    let jwtToken = token;

    if (!jwtToken) {
      const cookieStore = await cookies();
      jwtToken = cookieStore.get("token")?.value;
      console.log("Cookie token:", jwtToken);
    }

    if (!jwtToken) return null;

    console.log("🔐 VERIFY TOKEN LENGTH:", jwtToken.length);
    const payload = await verifyToken(jwtToken);
    console.log("Token payload:", payload);

    await mongodb();
    const user = await User.findById(payload.userId).select("-password");
    return user || null;
  } catch (err) {
    console.error("🔥 ERROR in getUserFromCookies:", err);
    return null;
  }
}
