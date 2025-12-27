// src/lib/auth.js
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { setTokenCookie, clearTokenCookie } from "./cookie";

/* -------------------- ENV -------------------- */
const JWT_SECRET = process.env.JWT_SECRET;
export function requireJWTSecret() {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  return JWT_SECRET;
}


const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const OTP_EXPIRES_MIN = Number(process.env.OTP_EXPIRES_MIN || 10);

/* JOSE requires Uint8Array secret */
const secret = new TextEncoder().encode(JWT_SECRET);

/* -------------------- Password -------------------- */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}

/* -------------------- JWT (JOSE) -------------------- */
export async function signToken(payload) {
  // Convert _id to string if present
  const safePayload = { ...payload };
  if (safePayload.id && typeof safePayload.id !== "string") {
    safePayload.id = safePayload.id.toString();
  }

  return await new SignJWT(safePayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secret);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null; // invalid or expired token
  }
}

/* -------------------- OTP -------------------- */
export function generateOTP(length = 6) {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }

  const expiresAt = new Date(
    Date.now() + OTP_EXPIRES_MIN * 60 * 1000
  );

  return { code, expiresAt };
}

/* -------------------- Cookies -------------------- */
export function getAuthCookieHeader(token) {
  return setTokenCookie(token);
}

export function clearAuthCookieHeader() {
  return clearTokenCookie();
}
