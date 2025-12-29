import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { setTokenCookie, clearTokenCookie } from "./cookie";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const secret = new TextEncoder().encode(JWT_SECRET);
const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

// Password
export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}

// JWT
export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyToken(token) {
  console.log("🔐 VERIFY TOKEN LENGTH:", token?.length);
  console.log("🔐 VERIFY SECRET EXISTS:", !!process.env.JWT_SECRET);

  const { payload } = await jwtVerify(token, secret);
  return payload;
}

// Cookies
export function getAuthCookieHeader(token) {
  return setTokenCookie(token);
}

export function clearAuthCookieHeader() {
  return clearTokenCookie();
}
