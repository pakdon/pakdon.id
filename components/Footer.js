"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import { InstagramIcon, YoutubeIcon, LinkedinIcon } from "./SocialIcons";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const subscribe = async () => {
    if (!email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "60px 0 30px" }}>
      <div className="pd-container">
        <div className="grid-4 cols-2-collapse">
          <div>
            <div style={{ fontWeight: 800, fontSize: 19, marginBottom: 12 }}>PakDon<span style={{ color: "var(--accent)" }}>.id</span></div>
            <p className="pd-sub" style={{ fontSize: 14 }}>Bangun Bisnis yang Bertumbuh dengan Sistem, Teknologi, dan AI.</p>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              {[InstagramIcon, YoutubeIcon, LinkedinIcon].map((Icon, i) => (
                <span key={i} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={15} />
                </span>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 13.5 }}>Navigasi</div>
            {["Tentang", "Portfolio", "Blog", "Video"].map((l) => <div key={l} className="pd-sub" style={{ fontSize: 13.5, marginBottom: 10 }}>{l}</div>)}
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 13.5 }}>Layanan</div>
            {["Produk Digital", "Kelas Online", "Konsultasi"].map((l) => <div key={l} className="pd-sub" style={{ fontSize: 13.5, marginBottom: 10 }}>{l}</div>)}
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 13.5 }}>Newsletter</div>
            <p className="pd-sub" style={{ fontSize: 13 }}>Belajar bisnis setiap minggu, langsung ke inbox Anda.</p>
            {status === "done" ? (
              <p style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600, marginTop: 10 }}>Terima kasih, cek email Anda.</p>
            ) : (
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <input className="pd-input" placeholder="Email" style={{ padding: "9px 14px", fontSize: 13 }} value={email} onChange={(e) => setEmail(e.target.value)} />
                <button className="pd-btn-primary" style={{ padding: "9px 14px" }} onClick={subscribe} disabled={status === "loading"}><Send size={13} /></button>
              </div>
            )}
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--border)", marginTop: 40, paddingTop: 20, display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--text-secondary)", flexWrap: "wrap", gap: 10 }}>
          <span>&copy; {new Date().getFullYear()} PakDon.id — All rights reserved.</span>
          <span>Made with a focus on Bisnis, Teknologi & AI.</span>
        </div>
      </div>
    </footer>
  );
}
