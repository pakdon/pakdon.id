import { Briefcase, Cpu, Store, ShoppingCart, Wallet, Zap } from "lucide-react";
import { SERVICES } from "@/lib/data";
import Reveal from "./Reveal";

const ICONS = { Briefcase, Cpu, Store, ShoppingCart, Wallet, Zap };

export default function Services() {
  return (
    <section id="services" className="pd-section alt">
      <div className="pd-container">
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 56px" }}>
            <span className="pd-eyebrow">What I Do</span>
            <h2 className="pd-h2">Fokus Kerja Saya</h2>
            <p className="pd-sub" style={{ marginTop: 14 }}>Enam area yang saya dalami dan terapkan langsung dalam bisnis saya sendiri.</p>
          </div>
        </Reveal>
        <div className="grid-3">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon] || Briefcase;
            return (
              <Reveal key={s.title} delay={i * 80}>
                <div className="pd-card" style={{ padding: 30, height: "100%" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "color-mix(in srgb, var(--accent) 14%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <Icon size={22} color="var(--accent-dark)" />
                  </div>
                  <div className="pd-h3">{s.title}</div>
                  <div className="pd-sub" style={{ fontSize: 14.5, marginTop: 8 }}>{s.desc}</div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
