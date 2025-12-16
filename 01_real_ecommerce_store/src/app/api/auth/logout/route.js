// src/app/api/auth/logout/route.js
import { clearAuthCookieHeader } from "@/lib/auth";

export async function POST() {
  const header = clearAuthCookieHeader();
  return new Response(null, {
    status: 200,
    headers: { "Set-Cookie": header },
  });
}
