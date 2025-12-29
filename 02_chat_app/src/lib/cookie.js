import { serialize, parse } from "cookie";

const isProduction = process.env.NODE_ENV === "production";

console.log("isProduction:", isProduction);

// Set JWT token cookie
export function setTokenCookie(token) {
  if (!token) throw new Error("Token is required to set cookie");

  return serialize("token", token, {
    httpOnly: true,                // inaccessible to JS
    secure: isProduction,          // only send over HTTPS in production
    sameSite: "lax",               // CSRF protection
    path: "/",                     // accessible to entire site
    maxAge: 60 * 60 * 24 * 7,      // 7 days
  });
}

// Clear JWT cookie
export function clearTokenCookie() {
  return serialize("token", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

// Parse cookies from a request header (safe fallback)
export function parseCookies(cookieHeader) {
  try {
    return parse(cookieHeader || "");
  } catch (err) {
    console.error("Failed to parse cookies:", err);
    return {};
  }
}

// Debug helper to log cookies (useful for Edge/Chrome mismatch)
export function logCookies(cookieHeader) {
  const cookies = parseCookies(cookieHeader);
  console.log("Cookies received:", cookies);
  return cookies;
}
