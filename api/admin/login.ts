import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { makeSessionCookie } from "../_lib/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { token } = req.body || {};
  const adminToken = process.env.ADMIN_TOKEN || "";
  if (!adminToken) return res.status(500).json({ error: "Missing ADMIN_TOKEN" });

  const t1 = Buffer.from(String(token || ""));
  const t2 = Buffer.from(adminToken);

  const ok = t1.length === t2.length && crypto.timingSafeEqual(t1, t2);

  if (!ok) return res.status(401).json({ error: "Invalid token" });

  res.setHeader("Set-Cookie", makeSessionCookie());
  return res.status(200).json({ ok: true });
}