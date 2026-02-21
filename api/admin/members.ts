import type { NextApiRequest, NextApiResponse } from "next";
import { isAuthed } from "../_lib/auth";
import { getPool } from "../_lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthed(req)) return res.status(401).json({ error: "Unauthorized" });

  const pool = getPool();

  try {
    if (req.method === "GET") {
      const { rows } = await pool.query(
        "select id, name, role, rank_order, image_url, social_link from members order by rank_order asc nulls last, created_at desc"
      );
      return res.status(200).json({ members: rows });
    }

    if (req.method === "POST") {
      const { name, role, rankOrder, imageUrl, socialLink } = req.body || {};
      if (!name) return res.status(400).json({ error: "Missing name" });

      const { rows } = await pool.query(
        `insert into members (name, role, rank_order, image_url, social_link)
         values ($1,$2,$3,$4,$5)
         returning id, name, role, rank_order, image_url, social_link`,
        [name, role || null, Number.isFinite(rankOrder) ? rankOrder : null, imageUrl || null, socialLink || null]
      );
      return res.status(200).json({ member: rows[0] });
    }

    if (req.method === "PUT") {
      const { id, name, role, rankOrder, imageUrl, socialLink } = req.body || {};
      if (!id) return res.status(400).json({ error: "Missing id" });

      const { rows } = await pool.query(
        `update members set
          name = coalesce($2, name),
          role = $3,
          rank_order = $4,
          image_url = $5,
          social_link = $6
         where id = $1
         returning id, name, role, rank_order, image_url, social_link`,
        [id, name ?? null, role ?? null, Number.isFinite(rankOrder) ? rankOrder : null, imageUrl ?? null, socialLink ?? null]
      );
      return res.status(200).json({ member: rows[0] });
    }

    if (req.method === "DELETE") {
      const id = (req.query?.id as string) || (req.body?.id as string);
      if (!id) return res.status(400).json({ error: "Missing id" });

      await pool.query("delete from members where id = $1", [id]);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}