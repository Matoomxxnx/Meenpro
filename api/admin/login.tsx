import { useState } from "react";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setErr(null);
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    setLoading(false);

    if (!res.ok) {
      setErr("Token ไม่ถูกต้อง");
      return;
    }
    router.replace("/admin");
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#050505", color: "#fff" }}>
      <div style={{ width: 360, padding: 18, borderRadius: 18, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)" }}>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>เข้าสู่ระบบ</div>
        <div style={{ opacity: 0.6, fontSize: 13, marginBottom: 12 }}>สำหรับผู้ดูแลระบบเท่านั้น</div>

        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="กรอก Admin Token"
          type="password"
          style={{
            width: "100%",
            padding: "12px 12px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,.15)",
            background: "rgba(0,0,0,.35)",
            color: "#fff",
            outline: "none",
          }}
        />

        {err && <div style={{ marginTop: 10, color: "#ff6b6b", fontWeight: 800, fontSize: 13 }}>{err}</div>}

        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 12,
            padding: "12px 12px",
            borderRadius: 14,
            border: "none",
            background: "#fff",
            color: "#000",
            fontWeight: 900,
            cursor: "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </div>
    </div>
  );
}