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
    // Use provided token (Socket.IO) or read from request cookies (API routes)
    let jwtToken = token;

    if (!jwtToken) {
      const cookieStore = await cookies();
      jwtToken = cookieStore.get("token")?.value;
    }

    if (!jwtToken) return null;

    // Connect to MongoDB
    await mongodb();

    // ✅ Await JWT verification
    const payload = await verifyToken(jwtToken);

    // Find user in DB, exclude password
    const user = await User.findById(payload.userId).select("-password");

    return user || null;
  } catch (err) {
    console.error("🔥 ERROR in getUserFromCookies:", err);
    return null;
  }
}
