// middleware.js (PROJECT ROOT)
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth"; // Edge-safe verifyToken (jose)

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("token")?.value;

  console.log("🟢 MIDDLEWARE HIT:", path);

  // ------------------ Check if token exists ------------------
  // if (!token) {
  //   console.log("🔴 User is logged out. Token cleared.");
  //   return NextResponse.next()
  // }

  //  if (path === "/api/auth/logout") {
  //   console.log("⚡ Logout request triggered");
  //   return NextResponse.next(); // just continue, logout API will clear cookie
  // }

  // ------------------ Verify token ------------------
  let payload = null;
  try {
    payload = await verifyToken(token);
    console.log("✅ JWT payload:", payload);
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // ------------------ Role-based access ------------------
  const isCustomerDashboard = path.startsWith("/customer/dashboard");
  const isAdminDashboard = path.startsWith("/admin/dashboard");

  if (payload) {
    const role = payload.role;
    console.log("🟢 USER ROLE:", role);

    if (isCustomerDashboard && role !== "customer") {
      console.log("❌ ROLE MISMATCH → redirect to /login");
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminDashboard && role !== "admin") {
      console.log("❌ ROLE MISMATCH → redirect to /login");
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  console.log("🟢 ACCESS GRANTED");
  return NextResponse.next();
}

// ------------------ Apply middleware only to dashboard paths ------------------
export const config = {
  matcher: ["/customer/dashboard/:path*", "/admin/dashboard/:path*"],
};
