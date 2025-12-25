// src/proxy.js
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export default async function proxy(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

//console.log("4🟢 PROXY HIT:", path);

  // ------------------ Logout endpoint ------------------
  if (path === "/api/auth/logout") {
  //  console.log("1🔴 Logout request triggered ⚡ ");
    return NextResponse.next();
  }

  // ------------------ Check if token exists ------------------
  // if (!token) {
  //   console.log("🔴 User is logged out. Token cleared.");
  //   const loginUrl = request.nextUrl.clone();
  //   loginUrl.pathname = "/login";
  //   return NextResponse.redirect(loginUrl);
  //}

  // ------------------ Verify JWT ------------------
  let payload = null;
  try {
    payload = await verifyToken(token);
  //  console.log("2✅ JWT payload:", payload);
  } catch (err) {
    console.log("❌ Token invalid or expired → redirect to login");
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // ------------------ Role-based access ------------------
  if (path.startsWith("/admin") && payload.role !== "admin") {
    console.log("❌ Admin role required → redirecting to login");
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  if (path.startsWith("/customer/dashboard") && payload.role !== "customer") {
    console.log("❌ Customer role required → redirecting to login");
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

//  console.log("3 🟢 ACCESS GRANTED");
  return NextResponse.next();
}

// ------------------ Routes to protect ------------------
export const config = {
  matcher: [
    "/customer/dashboard/:path*",
    "/admin/dashboard/:path*",
    "/api/auth/logout",
  ],
};
