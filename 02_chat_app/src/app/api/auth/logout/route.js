import { clearAuthCookieHeader } from "@/lib/auth";
import { getUserFromCookies } from "@/lib/getUserFromRequest";

export async function POST(req) {
  try {
    // 1️⃣ Get current user from cookies
    const user = await getUserFromCookies();

    // 2️⃣ Clear the auth cookie
    const setCookieHeader = clearAuthCookieHeader();

    // 3️⃣ Return JSON response with logged-out user info
    return new Response(
      JSON.stringify({
        success: true,
        message: "Logged out successfully",
        loggedOutUser: user
          ? { id: user._id, name: user.name, email: user.email }
          : null,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": setCookieHeader,
        },
      }
    );
  } catch (err) {
    console.error("Logout error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Logout failed",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
