import { TIMELINE } from "@/lib/data";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="pd-section">
      <div className="pd-container cols-2-collapse" style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 60 }}>
        <Reveal>
          <div>
            <span className="pd-eyebrow">Tentang Saya</span>
            <h2 className="pd-h2">Dari Toko Kecil, Menuju Sistem yang Bertumbuh Sendiri</h2>
            <p className="pd-sub" style={{ marginTop: 20 }}>
              Saya memulai perjalanan sebagai pemilik toko retail kecil, lalu perlahan membangun sistem, tim, dan teknologi hingga menjadi beberapa lini bisnis yang berjalan mandiri. Hari ini saya fokus membagikan apa yang saya pelajari kepada pemilik UMKM, entrepreneur, dan profesional muda.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 26 }}>
              {["Entrepreneur", "Business Builder", "AI Enthusiast", "Retail Expert", "Digital Transformation", "Mentor UMKM"].map((t) => (
                <span key={t} className="pd-tag">{t}</span>
              ))}
            </div>
          </div>
        </Reveal>
        <div style={{ position: "relative", paddingLeft: 26, borderLeft: "1.5px solid var(--border)" }}>
          {TIMELINE.map((t, i) => (
            <Reveal key={i} delay={i * 90}>
              <div style={{ position: "relative", paddingBottom: i === TIMELINE.length - 1 ? 0 : 34 }}>
                <span style={{ position: "absolute", left: -32.5, top: 4, width: 11, height: 11, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 0 4px color-mix(in srgb, var(--accent) 20%, transparent)" }} />
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", marginBottom: 4 }}>{t.year}</div>
                <div className="pd-h3">{t.title}</div>
                <div className="pd-sub" style={{ fontSize: 14.5, marginTop: 4 }}>{t.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
