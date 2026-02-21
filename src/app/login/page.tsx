"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/admin";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Login failed");
      router.push(next);
    } catch (e: any) {
      setErr(e.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h1 className="text-2xl font-bold tracking-wide">เข้าสู่ระบบ</h1>
        <p className="text-white/60 mt-1 text-sm">สำหรับผู้ดูแลระบบเท่านั้น</p>

        <label className="block mt-6 text-sm text-white/70">Admin Token</label>
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
          placeholder="กรอก token"
          type="password"
        />

        {err && <div className="mt-3 text-sm text-red-300">{err}</div>}

        <button
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-white text-black py-3 font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </div>
  );
}