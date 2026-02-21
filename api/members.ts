import type { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "./_lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const pool = getPool();
    const { rows } = await pool.query(
      "select id, name, role, rank_order, image_url, social_link from members order by rank_order asc nulls last, created_at desc"
    );
    return res.status(200).json({ members: rows });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}