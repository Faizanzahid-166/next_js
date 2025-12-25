import { NextResponse } from "next/server";

export function middleware(req) {
  console.log("🟢 MIDDLEWARE INIT HIT");
  //console.log("📌 Pathname:", req.nextUrl.pathname);

  // ✅ Log cookies correctly
  const cookies = req.cookies.getAll(); // returns array of { name, value }
  //console.log("📌 Cookies:", cookies);

  // Get token
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  const isCustomerDashboard = pathname.startsWith("/customer/dashboard");
  const isAdminDashboard = pathname.startsWith("/admin/dashboard");

  if (!token && (isCustomerDashboard || isAdminDashboard)) {
    console.log("🔴 NO TOKEN → REDIRECT LOGIN");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/customer/dashboard/:path*", "/admin/dashboard/:path*"],
};
