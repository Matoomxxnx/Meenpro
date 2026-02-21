import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";
import { AUTH_COOKIE, verifySession } from "@/lib/auth";

async function requireAdmin() {
  const token = cookies().get(AUTH_COOKIE)?.value;
  const ok = await verifySession(token);
  return !!ok;
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(ctx.params.id);
  const b = await req.json();

  const name = b?.name !== undefined ? String(b.name).trim() : undefined;
  const role = b?.role !== undefined ? (b.role ? String(b.role) : null) : undefined;
  const rankOrder = b?.rank_order !== undefined ? Number(b.rank_order) : undefined;
  const imageUrl = b?.image_url !== undefined ? (b.image_url ? String(b.image_url) : null) : undefined;
  const socialLink = b?.social_link !== undefined ? (b.social_link ? String(b.social_link) : null) : undefined;

  const { rows } = await pool.query(
    `update members set
      name = coalesce($1, name),
      role = coalesce($2, role),
      rank_order = coalesce($3, rank_order),
      image_url = coalesce($4, image_url),
      social_link = coalesce($5, social_link)
     where id = $6
     returning id, name, role, rank_order, image_url, social_link`,
    [name ?? null, role ?? null, Number.isFinite(rankOrder as number) ? rankOrder : null, imageUrl ?? null, socialLink ?? null, id]
  );

  return NextResponse.json({ ok: true, data: rows[0] });
}

export async function DELETE(_: Request, ctx: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const id = Number(ctx.params.id);
  await pool.query("delete from members where id = $1", [id]);
  return NextResponse.json({ ok: true });
}