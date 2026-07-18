"use client";
import { useState } from "react";
import { MapPin, Mail, MessageCircle, Check, Send } from "lucide-react";
import { InstagramIcon, YoutubeIcon, LinkedinIcon } from "./SocialIcons";
import Reveal from "./Reveal";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!form.name || !form.email || !form.message) { setError("Nama, email, dan pesan wajib diisi"); return; }
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Gagal mengirim pesan");
      setSent(true);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section id="contact" className="pd-section">
      <div className="pd-container cols-2-collapse" style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 56 }}>
        <Reveal>
          <div>
            <span className="pd-eyebrow">Contact</span>
            <h2 className="pd-h2">Mari Terhubung</h2>
            <p className="pd-sub" style={{ marginTop: 14 }}>Punya pertanyaan atau ingin kolaborasi? Hubungi saya melalui salah satu channel berikut.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 26 }}>
              {[{ icon: MessageCircle, label: "+62 812-0000-0000 (WhatsApp)" }, { icon: Mail, label: "hello@pakdon.id" }, { icon: MapPin, label: "Jakarta, Indonesia" }].map((c) => (
                <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14.5 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: "var(--bg-alt)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <c.icon size={16} color="var(--accent-dark)" />
                  </div>
                  {c.label}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 26 }}>
              {[InstagramIcon, YoutubeIcon, LinkedinIcon].map((Icon, i) => (
                <span key={i} style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} />
                </span>
              ))}
            </div>
            <div className="pd-card" style={{ marginTop: 26, aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", fontSize: 13 }}>
              <MapPin size={16} style={{ marginRight: 6 }} /> Google Maps &mdash; Jakarta, Indonesia
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="pd-card" style={{ padding: 30 }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Check size={30} color="var(--accent)" style={{ margin: "0 auto 12px" }} />
                <div style={{ fontWeight: 700 }}>Pesan terkirim!</div>
                <div className="pd-sub" style={{ fontSize: 13.5, marginTop: 6 }}>Tim kami akan membalas dalam 1x24 jam.</div>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <input className="pd-input" placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <input className="pd-input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <input className="pd-input" placeholder="Subjek" style={{ marginTop: 12 }} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                <textarea className="pd-input" placeholder="Pesan Anda" rows={5} style={{ marginTop: 12, resize: "vertical" }} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                {error && <div style={{ color: "#e5484d", fontSize: 12.5, marginTop: 8 }}>{error}</div>}
                <button className="pd-btn-primary" style={{ marginTop: 16, width: "100%", justifyContent: "center" }} onClick={submit}>
                  Kirim Pesan <Send size={14} />
                </button>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
