"use client";
import { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowRight, Play, TrendingUp, BadgeCheck } from "lucide-react";
import { STATS } from "@/lib/data";
import Reveal from "./Reveal";

function useCountUp(target, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let frame;
    const start = performance.now();
    const duration = 1400;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);
  return val;
}

function StatCard({ stat, active }) {
  const val = useCountUp(stat.value, active);
  return (
    <div className="pd-card" style={{ padding: "22px 16px", textAlign: "center" }}>
      <div style={{ fontSize: "1.9rem", fontWeight: 700, letterSpacing: "-0.02em" }}>{val}{stat.suffix}</div>
      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>{stat.label}</div>
    </div>
  );
}

export default function Hero() {
  const statsRef = useRef(null);
  const [statsInView, setStatsInView] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsInView(true); obs.disconnect(); } }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="home" className="pd-fade-hero" style={{ paddingTop: 168, paddingBottom: 90 }}>
      <div className="pd-container cols-2-collapse" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 56, alignItems: "center" }}>
        <Reveal>
          <div>
            <span className="pd-eyebrow"><Sparkles size={13} /> Entrepreneur &middot; Mentor &middot; AI Enthusiast</span>
            <h1 className="pd-h1">Bangun Bisnis yang Menghasilkan, Bukan Sekadar Ramai</h1>
            <p className="pd-sub" style={{ marginTop: 22, maxWidth: 520 }}>
              Saya berbagi pengalaman membangun bisnis, mengembangkan sistem, memanfaatkan AI, serta menciptakan aset yang terus bertumbuh.
            </p>
            <div style={{ display: "flex", gap: 14, marginTop: 34, flexWrap: "wrap" }}>
              <button className="pd-btn-primary" onClick={() => scrollTo("consultation")}>Konsultasi <ArrowRight size={15} /></button>
              <button className="pd-btn-secondary" onClick={() => scrollTo("blog")}>Baca Artikel</button>
              <button className="pd-btn-secondary" onClick={() => scrollTo("video")}><Play size={14} /> Lihat YouTube</button>
            </div>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div style={{ position: "relative" }}>
            <div className="pd-card pd-float" style={{ borderRadius: 32, overflow: "hidden", aspectRatio: "4/5", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, color-mix(in srgb, var(--accent) 30%, var(--bg-alt)), var(--bg-alt))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", fontSize: 14 }}>
                Foto Profesional Pak Don
              </div>
            </div>
            <div className="pd-card pd-glass" style={{ position: "absolute", bottom: -22, left: -22, padding: "16px 20px", borderRadius: 20, display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUp size={18} color="#04211F" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>9 Bisnis</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Dibangun sejak 2013</div>
              </div>
            </div>
            <div className="pd-card pd-glass" style={{ position: "absolute", top: 20, right: -18, padding: "12px 16px", borderRadius: 18, display: "flex", gap: 8, alignItems: "center" }}>
              <BadgeCheck size={16} color="var(--accent)" />
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Trusted Mentor</span>
            </div>
          </div>
        </Reveal>
      </div>
      <div ref={statsRef} className="pd-container grid-5" style={{ marginTop: 90 }}>
        {STATS.map((s, i) => <StatCard key={i} stat={s} active={statsInView} />)}
      </div>
    </section>
  );
}
