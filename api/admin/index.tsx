import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Member = {
  id: string;
  name: string;
  role: string | null;
  rank_order: number | null;
  image_url: string | null;
  social_link: string | null;
};

export default function AdminHome() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/members");
    if (res.status === 401) {
      router.replace("/admin/login");
      return;
    }
    const data = await res.json();
    setMembers(data.members || []);
    setLoading(false);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardStyle: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: 18,
    padding: 16,
    background: "rgba(255,255,255,.05)",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 900 }}>Admin Dashboard</div>
            <div style={{ opacity: 0.6, fontSize: 13 }}>ระบบหลังบ้านสำหรับผู้ดูแล</div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => router.push("/admin/members")}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,.15)",
                background: "rgba(255,255,255,.08)",
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              จัดการสมาชิก
            </button>

            <button
              onClick={logout}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid rgba(255,80,80,.25)",
                background: "rgba(255,80,80,.12)",
                color: "#fff",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 13, opacity: 0.6 }}>จำนวนสมาชิกทั้งหมด</div>
            <div style={{ fontSize: 34, fontWeight: 1000 }}>{loading ? "…" : members.length}</div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 13, opacity: 0.6 }}>สถานะระบบ</div>
            <div style={{ fontSize: 18, fontWeight: 900 }}>Online</div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 13, opacity: 0.6 }}>เมนูลัด</div>
            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a
                href="/"
                style={{ color: "#fff", textDecoration: "none", padding: "8px 10px", borderRadius: 12, border: "1px solid rgba(255,255,255,.12)" }}
              >
                หน้าเว็บหลัก
              </a>
              <a
                href="/members"
                style={{ color: "#fff", textDecoration: "none", padding: "8px 10px", borderRadius: 12, border: "1px solid rgba(255,255,255,.12)" }}
              >
                หน้ารายชื่อ
              </a>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, opacity: 0.6, fontSize: 12 }}>
          * ถ้าเข้าหน้านี้ได้ แปลว่า cookie admin session ทำงานแล้ว ✅
        </div>
      </div>
    </div>
  );
}