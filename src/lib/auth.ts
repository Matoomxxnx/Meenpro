import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";

const COOKIE_NAME = "mp_admin";

function getSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("Missing JWT_SECRET in .env.local");
  return new TextEncoder().encode(s);
}

export function safeEqual(a: string, b: string) {
  // timing-safe compare
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export async function createSession() {
  const secret = getSecret();
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
  return token;
}

export async function verifySession(token?: string) {
  if (!token) return null;
  try {
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);
    if (payload?.role !== "admin") return null;
    return payload;
  } catch {
    return null;
  }
}

export const AUTH_COOKIE = COOKIE_NAME;