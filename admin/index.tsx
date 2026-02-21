// pages/admin/index.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Member = {
  id: string;
  name: string;
  role?: string;
  rankOrder?: number;
  imageUrl?: string;
  socialLink?: string;
};

const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: 18,
  padding: 16,
  background: "rgba(255,255,255,.05)",
};

const btnStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,.15)",
  background: "rgba(255,77,77,.20)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

export default function AdminPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMembers() {
    setLoading(true);
    const res = await fetch("/api/admin/members");
    if (res.status === 401) {
      router.replace("/admin/login");
      return;
    }
    const data = await res.json();
    setMembers(data?.members ?? data ?? []);
    setLoading(false);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  useEffect(() => {
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#fff",
        padding: 24,
        fontFamily:
          'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>Admin Dashboard</div>
          <div style={{ opacity: 0.6, fontSize: 13 }}>
            จัดการสมาชิก / เพิ่ม-แก้ไข-ลบ
          </div>
        </div>

        <button onClick={logout} style={btnStyle}>
          Logout
        </button>
      </div>

      {/* Dashboard Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div style={cardStyle}>
          <div style={{ fontSize: 13, opacity: 0.6 }}>จำนวนสมาชิกทั้งหมด</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>
            {loading ? "..." : members.length}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: 13, opacity: 0.6 }}>สถานะระบบ</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#6d7cff" }}>
            Online
          </div>
        </div>
      </div>

      {/* Members List */}
      <div style={cardStyle}>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>
          รายชื่อสมาชิก (Members)
        </div>

        {loading ? (
          <div style={{ opacity: 0.7 }}>กำลังโหลด...</div>
        ) : members.length === 0 ? (
          <div style={{ opacity: 0.7 }}>ยังไม่มีสมาชิก</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {members.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: 12,
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,.10)",
                  background: "rgba(255,255,255,.03)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: "rgba(255,255,255,.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                    }}
                  >
                    {m.name?.slice(0, 1)?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 900 }}>{m.name}</div>
                    <div style={{ opacity: 0.6, fontSize: 12 }}>
                      {m.role || "-"}
                      {typeof m.rankOrder === "number"
                        ? ` • Rank ${m.rankOrder}`
                        : ""}
                    </div>
                  </div>
                </div>

                <a
                  href={m.socialLink || "#"}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    opacity: m.socialLink ? 0.9 : 0.35,
                    pointerEvents: m.socialLink ? "auto" : "none",
                    color: "#fff",
                    textDecoration: "none",
                    border: "1px solid rgba(255,255,255,.12)",
                    padding: "8px 10px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,.06)",
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  Social
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}