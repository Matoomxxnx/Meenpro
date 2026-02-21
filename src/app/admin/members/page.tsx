"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Member = {
  id: number;
  name: string;
  role: string | null;
  rank_order: number;
  image_url: string | null;
  social_link: string | null;
};

export default function MembersPage() {
  const [items, setItems] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((m) => (m.name || "").toLowerCase().includes(s) || (m.role || "").toLowerCase().includes(s));
  }, [items, q]);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/members");
    const data = await res.json();
    setItems(data.data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function addQuick() {
    const name = prompt("ชื่อสมาชิก:");
    if (!name) return;
    const res = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, rank_order: 999 }),
    });
    const data = await res.json();
    if (!data.ok) return alert(data.error || "เพิ่มไม่สำเร็จ");
    await load();
  }

  async function del(id: number) {
    if (!confirm("ลบรายการนี้?")) return;
    const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!data.ok) return alert(data.error || "ลบไม่สำเร็จ");
    await load();
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Members</h1>
            <p className="text-white/60 text-sm">จัดการรายชื่อสมาชิก</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin" className="rounded-xl border border-white/15 px-4 py-2 hover:bg-white/10">Back</Link>
            <button onClick={addQuick} className="rounded-xl bg-white text-black px-4 py-2 font-semibold hover:opacity-90">
              + Add
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหาชื่อ / role"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
          />
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-white/5 text-xs text-white/60">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Name</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-2">Rank</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          {loading ? (
            <div className="p-6 text-white/60">กำลังโหลด...</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-white/60">ไม่พบข้อมูล</div>
          ) : (
            filtered.map((m) => (
              <div key={m.id} className="grid grid-cols-12 gap-2 px-4 py-3 border-t border-white/10 items-center">
                <div className="col-span-1 text-white/60">{m.id}</div>
                <div className="col-span-4 font-semibold">{m.name}</div>
                <div className="col-span-3 text-white/70">{m.role || "-"}</div>
                <div className="col-span-2 text-white/70">{m.rank_order}</div>
                <div className="col-span-2 text-right">
                  <button onClick={() => del(m.id)} className="rounded-lg border border-red-400/30 text-red-200 px-3 py-1 hover:bg-red-500/10">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}