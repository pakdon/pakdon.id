"use client";
import { useState } from "react";
import { Calendar, MessageCircle, Mail, ArrowRight } from "lucide-react";
import { DURATIONS, formatIDR } from "@/lib/data";
import Reveal from "./Reveal";

export default function Consultation() {
  const [duration, setDuration] = useState(60);
  const [form, setForm] = useState({ name: "", whatsapp: "", topic: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!form.name || !form.whatsapp) { setError("Nama dan WhatsApp wajib diisi"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, duration }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal booking");
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="consultation" className="pd-section alt">
      <div className="pd-container cols-2-collapse" style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 56 }}>
        <Reveal>
          <div>
            <span className="pd-eyebrow">Consultation</span>
            <h2 className="pd-h2">Diskusi Langsung dengan Pak Don</h2>
            <p className="pd-sub" style={{ marginTop: 16 }}>Booking sesi konsultasi 1-on-1 untuk membahas tantangan bisnis Anda secara spesifik.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 26 }}>
              {[{ icon: Calendar, label: "Terintegrasi Google Calendar" }, { icon: MessageCircle, label: "Konfirmasi via WhatsApp" }, { icon: Mail, label: "Notifikasi & recap via Email" }].map((f) => (
                <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                  <f.icon size={17} color="var(--accent-dark)" /> {f.label}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="pd-card" style={{ padding: 30 }}>
            {result ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div className="pd-h3">Booking diterima!</div>
                <p className="pd-sub" style={{ fontSize: 13.5, marginTop: 8 }}>Selesaikan konfirmasi lewat WhatsApp agar jadwal segera dikunci.</p>
                <a href={result.waLink} target="_blank" rel="noreferrer" className="pd-btn-primary" style={{ marginTop: 18, justifyContent: "center" }}>
                  <MessageCircle size={15} /> Konfirmasi via WhatsApp
                </a>
              </div>
            ) : (
              <>
                <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 14 }}>Pilih durasi sesi</div>
                <div className="grid-3">
                  {DURATIONS.map((d) => (
                    <div key={d.minutes} onClick={() => setDuration(d.minutes)}
                      style={{ border: `1.5px solid ${duration === d.minutes ? "var(--accent)" : "var(--border)"}`, borderRadius: 16, padding: 16, cursor: "pointer", background: duration === d.minutes ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent", transition: "all .25s ease" }}>
                      <div style={{ fontWeight: 700, fontSize: 18 }}>{d.minutes}<span style={{ fontSize: 12, fontWeight: 500 }}> menit</span></div>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>{d.desc}</div>
                      <div style={{ fontWeight: 600, marginTop: 10, fontSize: 13.5 }}>{formatIDR(d.price)}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 22 }}>
                  <input className="pd-input" placeholder="Nama lengkap" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <input className="pd-input" placeholder="Nomor WhatsApp" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
                </div>
                <input className="pd-input" placeholder="Topik yang ingin dibahas" style={{ marginTop: 12 }} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
                {error && <div style={{ color: "#e5484d", fontSize: 12.5, marginTop: 10 }}>{error}</div>}
                <button className="pd-btn-primary" style={{ marginTop: 18, width: "100%", justifyContent: "center" }} onClick={submit} disabled={loading}>
                  {loading ? "Memproses..." : `Booking Sesi ${duration} Menit`} <ArrowRight size={15} />
                </button>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
