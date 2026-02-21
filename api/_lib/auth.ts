import crypto from "crypto";

const COOKIE_NAME = "admin_session";

function b64url(input: Buffer | string) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function b64urlToBuf(s: string) {
  const pad = 4 - (s.length % 4 || 4);
  const base64 = (s + "=".repeat(pad)).replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(base64, "base64");
}

function hmac(data: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(data).digest();
}

export function makeSessionCookie(maxAgeSeconds = 60 * 60 * 8) {
  const secret = process.env.SESSION_SECRET || "";
  if (!secret) throw new Error("Missing SESSION_SECRET");

  const now = Math.floor(Date.now() / 1000);
  const payload = { role: "admin", iat: now, exp: now + maxAgeSeconds };

  const payloadStr = JSON.stringify(payload);
  const payloadB64 = b64url(payloadStr);
  const sigB64 = b64url(hmac(payloadB64, secret));

  const value = `${payloadB64}.${sigB64}`;
  const cookie = `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}; Secure`;

  return cookie;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure`;
}

export function isAuthed(req: any) {
  const secret = process.env.SESSION_SECRET || "";
  if (!secret) return false;

  const cookieHeader = req.headers?.cookie || "";
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return false;

  const value = match[1];
  const parts = value.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, sigB64] = parts;
  const expectedSig = b64url(hmac(payloadB64, secret));

  // timing-safe compare
  const a = Buffer.from(sigB64);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;

  const payload = JSON.parse(b64urlToBuf(payloadB64).toString("utf8"));
  const now = Math.floor(Date.now() / 1000);
  if (!payload?.exp || payload.exp < now) return false;
  if (payload?.role !== "admin") return false;

  return true;
}