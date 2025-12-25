// src/lib/auth.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtVerify, SignJWT } from "jose";
import { setTokenCookie, clearTokenCookie } from "./cookie";

// -------------------- JWT -------------------- secret and expires
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
// const JWT_SECRET = process.env.JWT_SECRET;
// if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");

// -------------------- JWT- jose--------------- secret and expires

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const expiresIn = process.env.JWT_EXPIRES_IN || "7d";


// -------------------- Password --------------------
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}

// -------------------- JWT --------------------
// export function signToken(payload) {
//   // payload: object
//   return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
// }

// export function verifyToken(token) {
//   return jwt.verify(token, JWT_SECRET);
// }

// -------------------- JWT-jose --------------------
export async function signToken(payload) {
  // Edge-safe async JWT signing
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyToken(token) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
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
