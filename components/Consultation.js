"use client";
import { useState } from "react";
import { Calendar, MessageCircle, Mail, ArrowRight, ExternalLink } from "lucide-react";
import { DURATIONS as DEFAULT_DURATIONS, formatIDR } from "@/lib/data";
import Reveal from "./Reveal";

// `packages` dikirim dari app/konsultasi/page.js (Server Component) hasil fetch Firestore
// (lihat lib/content.js -> getConsultationDurations), dengan fallback ke DEFAULT_DURATIONS
// supaya form tetap tampil normal walau Firestore/CMS belum diisi.
// Setiap paket: { id, name, desc, minutes, price, lynkUrl }
// Pembayaran dilakukan lewat link produk Lynk.id masing-masing paket (lynkUrl),
// sementara form di bawah dipakai untuk mencatat detail booking & jadwal via WhatsApp.
export default function Consultation({ packages = DEFAULT_DURATIONS }) {
  const [selectedId, setSelectedId] = useState(packages[0]?.id);
  const [form, setForm] = useState({ name: "", whatsapp: "", topic: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const selectedPackage = packages.find((p) => p.id === selectedId) || packages[0];

  const submit = async () => {
    if (!form.name || !form.whatsapp) { setError("Nama dan WhatsApp wajib diisi"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, packageId: selectedPackage?.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal booking");
      setResult(data);
      // Kalau paket ini punya link Lynk.id, langsung buka di tab baru supaya
      // pembeli bisa lanjut bayar tanpa harus klik dua kali.
      if (selectedPackage?.lynkUrl) {
        window.open(selectedPackage.lynkUrl, "_blank", "noopener,noreferrer");
      }
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
            <p className="pd-sub" style={{ marginTop: 16 }}>Booking sesi konsultasi 1-on-1 untuk membahas tantangan bisnis Anda secara spesifik. Pembayaran diproses aman lewat Lynk.id.</p>
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
                <p className="pd-sub" style={{ fontSize: 13.5, marginTop: 8 }}>
                  {selectedPackage?.lynkUrl
                    ? "Halaman pembayaran Lynk.id sudah dibuka di tab baru. Setelah bayar, konfirmasi jadwal lewat WhatsApp agar segera dikunci."
                    : "Selesaikan konfirmasi lewat WhatsApp agar jadwal segera dikunci."}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
                  {selectedPackage?.lynkUrl && (
                    <a href={selectedPackage.lynkUrl} target="_blank" rel="noreferrer" className="pd-btn-primary" style={{ justifyContent: "center" }}>
                      Bayar via Lynk.id <ExternalLink size={15} />
                    </a>
                  )}
                  <a href={result.waLink} target="_blank" rel="noreferrer" className="pd-btn-secondary" style={{ justifyContent: "center" }}>
                    <MessageCircle size={15} /> Konfirmasi via WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 14 }}>Pilih paket konsultasi</div>
                <div className="grid-3">
                  {packages.map((p) => (
                    <div key={p.id} onClick={() => setSelectedId(p.id)}
                      style={{ border: `1.5px solid ${selectedId === p.id ? "var(--accent)" : "var(--border)"}`, borderRadius: 16, padding: 16, cursor: "pointer", background: selectedId === p.id ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent", transition: "all .25s ease" }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
                      <div className="pd-sub" style={{ fontSize: 12, marginTop: 4 }}>{p.minutes} menit</div>
                      <div className="pd-sub" style={{ fontSize: 12, marginTop: 2 }}>{p.desc}</div>
                      <div style={{ fontWeight: 600, marginTop: 10, fontSize: 13.5 }}>{formatIDR(p.price)}</div>
                      {p.lynkUrl && (
                        <a
                          href={p.lynkUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 11.5, fontWeight: 600, color: "var(--accent-dark)" }}
                        >
                          Lihat di Lynk.id <ExternalLink size={11} />
                        </a>
                      )}
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
                  {loading ? "Memproses..." : `Booking ${selectedPackage?.name || ""}`} <ArrowRight size={15} />
                </button>
                {selectedPackage?.lynkUrl && (
                  <p className="pd-sub" style={{ fontSize: 11.5, marginTop: 10, textAlign: "center" }}>
                    Klik booking akan membuka halaman pembayaran Lynk.id di tab baru.
                  </p>
                )}
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
