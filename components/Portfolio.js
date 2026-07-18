import { Briefcase } from "lucide-react";
import { getPortfolio } from "@/lib/content";
import Reveal from "./Reveal";

export default async function Portfolio() {
  const items = await getPortfolio();
  return (
    <section id="portfolio" className="pd-section">
      <div className="pd-container">
        <Reveal>
          <div style={{ maxWidth: 640, marginBottom: 50 }}>
            <span className="pd-eyebrow">Portfolio</span>
            <h2 className="pd-h2">Bisnis & Produk yang Sudah Dibangun</h2>
          </div>
        </Reveal>
        <div className="grid-4">
          {items.map((p, i) => (
            <Reveal key={p.id || p.title} delay={(i % 4) * 70}>
              <div className="pd-card" style={{ overflow: "hidden" }}>
                <div style={{ aspectRatio: "16/10", background: "linear-gradient(135deg, color-mix(in srgb, var(--accent) 22%, var(--bg-alt)), var(--bg-alt))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Briefcase size={26} color="var(--accent-dark)" />
                </div>
                <div style={{ padding: 20 }}>
                  <span className="pd-tag">{p.tag}</span>
                  <div className="pd-h3" style={{ fontSize: 16.5, marginTop: 10 }}>{p.title}</div>
                  <div className="pd-sub" style={{ fontSize: 13.5, marginTop: 6 }}>{p.desc}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--accent-dark)", marginTop: 10 }}>{p.result}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                    {(p.tech || []).map((t) => <span key={t} style={{ fontSize: 11, padding: "4px 9px", borderRadius: 8, background: "var(--bg-alt)", color: "var(--text-secondary)" }}>{t}</span>)}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
