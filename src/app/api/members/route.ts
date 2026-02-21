import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";
import { AUTH_COOKIE, verifySession } from "@/lib/auth";

async function requireAdmin() {
  const token = cookies().get(AUTH_COOKIE)?.value;
  const ok = await verifySession(token);
  return !!ok;
}

export async function GET() {
  const { rows } = await pool.query(
    "select id, name, role, rank_order, image_url, social_link from members order by rank_order asc, id desc"
  );
  return NextResponse.json({ ok: true, data: rows });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const b = await req.json();
  const name = String(b?.name || "").trim();
  if (!name) return NextResponse.json({ ok: false, error: "ต้องมีชื่อ" }, { status: 400 });

  const role = b?.role ? String(b.role) : null;
  const rankOrder = Number.isFinite(Number(b?.rank_order)) ? Number(b.rank_order) : 999;
  const imageUrl = b?.image_url ? String(b.image_url) : null;
  const socialLink = b?.social_link ? String(b.social_link) : null;

  const { rows } = await pool.query(
    `insert into members (name, role, rank_order, image_url, social_link)
     values ($1,$2,$3,$4,$5)
     returning id, name, role, rank_order, image_url, social_link`,
    [name, role, rankOrder, imageUrl, socialLink]
  );

  return NextResponse.json({ ok: true, data: rows[0] });
}