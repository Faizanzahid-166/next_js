import { serialize, parse } from "cookie";

const isProduction = process.env.NODE_ENV === "production";

export function setTokenCookie(token: string) {
  return serialize("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearTokenCookie() {
  return serialize("token", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

// parse cookies from a string header
export function parseCookies(cookieHeader: string = "") {
  return parse(cookieHeader || "");
}
