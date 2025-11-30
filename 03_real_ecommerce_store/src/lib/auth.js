// src/lib/auth.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setTokenCookie, clearTokenCookie } from "./cookie";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");

const OTP_EXPIRES_MIN = Number(process.env.OTP_EXPIRES_MIN || 10);

// -------------------- Password --------------------
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}

// -------------------- JWT --------------------
export function signToken(payload) {
  // payload: object
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// -------------------- OTP --------------------
export function generateOTP(length = 6) {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  const expiresAt = new Date(Date.now() + OTP_EXPIRES_MIN * 60 * 1000);
  return { code, expiresAt };
}

// -------------------- Cookies --------------------
export function getAuthCookieHeader(token) {
  // sets JWT in HttpOnly cookie
  return setTokenCookie(token);
}

export function clearAuthCookieHeader() {
  // clears JWT cookie
  return clearTokenCookie();
}
