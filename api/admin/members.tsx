import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

type Member = {
  id: string;
  name: string;
  role: string | null;
  rank_order: number | null;
  image_url: string | null;
  social_link: string | null;
};

export default function AdminMembers() {
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [rankOrder, setRankOrder] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [socialLink, setSocialLink] = useState("");

  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return members;
    return members.filter(m =>
      [m.name, m.role || "", m.social_link || ""].join(" ").toLowerCase().includes(s)
    );
  }, [members, q]);

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

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addMember() {
    if (!name.trim()) return alert("กรอกชื่อก่อน");
    const res = await fetch("/api/admin/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        role: role.trim() || null,
        rankOrder: rankOrder === "" ? null : Number(rankOrder),
        imageUrl: imageUrl.trim() || null,
        socialLink: socialLink.trim() || null,
      }),
    });

    if (res.status === 401) return router.replace("/admin/login");
    if (!res.ok) return alert("เพิ่มไม่สำเร็จ");

    setName(""); setRole(""); setRankOrder(""); setImageUrl(""); setSocialLink("");
    await load();
  }

  async function updateMember(m: Member) {
    const newName = prompt("แก้ชื่อ", m.name);
    if (newName === null) return;

    const newRole = prompt("แก้ตำแหน่ง/บทบาท", m.role || "") ?? "";
    const newRank = prompt("แก้ลำดับ (ตัวเลข)", m.rank_order?.toString() || "") ?? "";
    const newImg = prompt("แก้ Image URL", m.image_url || "") ?? "";
    const newSocial = prompt("แก้ Social Link", m.social_link || "") ?? "";

    const res = await fetch("/api/admin/members", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: m.id,
        name: newName.trim() || m.name,
        role: newRole.trim() || null,
        rankOrder: newRank.trim() === "" ? null : Number(newRank),
        imageUrl: newImg.trim() || null,
        socialLink: newSocial.trim() || null,
      }),
    });

    if (res.status === 401) return router.replace("/admin/login");
    if (!res.ok) return alert("แก้ไขไม่สำเร็จ");

    await load();
  }

  async function deleteMember(id: string) {
    if (!confirm("ลบสมาชิกคนนี้แน่ใจไหม?")) return;
    const res = await fetch(`/api/admin/members?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.status === 401) return router.replace("/admin/login");
    if (!res.ok) return alert("ลบไม่สำเร็จ");
    await load();
  }

  const box: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: 18,
    background: "rgba(255,255,255,.05)",
    padding: 16,
  };

  const input: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.15)",
    background: "rgba(0,0,0,.35)",
    color: "#fff",
    outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 900 }}>Members Management</div>
            <div style={{ opacity: 0.6, fontSize: 13 }}>เพิ่ม/แก้/ลบสมาชิก (เฉพาะแอดมิน)</div>
          </div>
          <button
            onClick={() => router.push("/admin")}
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
            กลับ Dashboard
          </button>
        </div>

        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "380px 1fr", gap: 12 }}>
          {/* Form */}
          <div style={box}>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>Add New Member</div>

            <div style={{ display: "grid", gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6 }}>NAME *</div>
                <input style={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Member Name" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6 }}>ROLE</div>
                  <input style={input} value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Leader" />
                </div>
                <div>
                  <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6 }}>RANK ORDER</div>
                  <input style={input} value={rankOrder} onChange={(e) => setRankOrder(e.target.value)} placeholder="1 = Top" />
                </div>
              </div>

              <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6 }}>IMAGE URL</div>
                <input style={input} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
              </div>

              <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6 }}>SOCIAL LINK</div>
                <input style={input} value={socialLink} onChange={(e) => setSocialLink(e.target.value)} placeholder="Facebook / Discord URL" />
              </div>

              <button
                onClick={addMember}
                style={{
                  width: "100%",
                  padding: "12px 12px",
                  borderRadius: 14,
                  border: "none",
                  background: "#7c3aed",
                  color: "#fff",
                  fontWeight: 1000,
                  cursor: "pointer",
                }}
              >
                Save Member
              </button>
            </div>
          </div>

          {/* List */}
          <div style={box}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
              <div style={{ fontWeight: 900 }}>
                รายชื่อสมาชิก {loading ? "" : `(${members.length})`}
              </div>
              <input
                style={{ ...input, maxWidth: 320 }}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ค้นหา..."
              />
            </div>

            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              {loading && <div style={{ opacity: 0.6 }}>กำลังโหลด...</div>}
              {!loading && filtered.length === 0 && <div style={{ opacity: 0.6 }}>ไม่พบรายการ</div>}

              {filtered.map((m) => (
                <div
                  key={m.id}
                  style={{
                    padding: 12,
                    borderRadius: 16,
                    border: "1px solid rgba(255,255,255,.10)",
                    background: "rgba(0,0,0,.25)",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: "rgba(255,255,255,.08)",
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,.10)",
                      }}
                    >
                      {m.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.image_url} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : null}
                    </div>

                    <div>
                      <div style={{ fontWeight: 1000 }}>
                        {m.rank_order ? `#${m.rank_order} ` : ""}{m.name}
                      </div>
                      <div style={{ opacity: 0.6, fontSize: 12 }}>
                        {m.role || "—"} {m.social_link ? `• ${m.social_link}` : ""}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => updateMember(m)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 12,
                        border: "1px solid rgba(255,255,255,.15)",
                        background: "rgba(255,255,255,.08)",
                        color: "#fff",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMember(m.id)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 12,
                        border: "1px solid rgba(255,80,80,.25)",
                        background: "rgba(255,80,80,.12)",
                        color: "#fff",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.6 }}>
              * ปุ่ม Edit ใช้ prompt เพื่อให้ทำงานไว (เดี๋ยวค่อยทำ modal UI ให้สวยแบบตัวอย่างได้)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}