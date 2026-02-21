"use client";

import Link from "next/link";

export default function AdminHome() {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button onClick={logout} className="rounded-xl border border-white/15 px-4 py-2 hover:bg-white/10">
            Logout
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link href="/admin/members" className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
            <div className="text-lg font-semibold">Members</div>
            <div className="text-white/60 text-sm mt-1">เพิ่ม/แก้/ลบรายชื่อ</div>
          </Link>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-lg font-semibold">System</div>
            <div className="text-white/60 text-sm mt-1">Online</div>
          </div>
        </div>
      </div>
    </div>
  );
}