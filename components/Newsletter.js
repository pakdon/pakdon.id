"use client";
import { useState } from "react";
import { Send, Check } from "lucide-react";
import Reveal from "./Reveal";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!email.includes("@")) return;
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) setDone(true);
  };

  return (
    <section className="pd-section alt">
      <div className="pd-container" style={{ textAlign: "center" }}>
        <Reveal>
          <div style={{ maxWidth: 520, margin: "0 auto" }}>
            <span className="pd-eyebrow">Newsletter</span>
            <h2 className="pd-h2">Belajar Bisnis Setiap Minggu</h2>
            <p className="pd-sub" style={{ marginTop: 12 }}>Insight bisnis, AI, dan produktivitas langsung ke inbox Anda. Tanpa spam.</p>
            {done ? (
              <div style={{ marginTop: 26, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--accent-dark)", fontWeight: 600 }}>
                <Check size={18} /> Terima kasih, cek email Anda untuk konfirmasi.
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10, marginTop: 26, maxWidth: 420, margin: "26px auto 0" }}>
                <input className="pd-input" placeholder="Alamat email Anda" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button className="pd-btn-primary" onClick={submit}><Send size={15} /></button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
