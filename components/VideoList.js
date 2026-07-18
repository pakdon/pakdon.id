"use client";
import { useMemo, useState } from "react";
import { Play } from "lucide-react";
import Reveal from "./Reveal";

export default function VideoList({ videos, categories }) {
  const [cat, setCat] = useState("Semua");
  const filtered = useMemo(() => videos.filter((v) => cat === "Semua" || v.cat === cat), [videos, cat]);

  return (
    <>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 30 }}>
        {categories.map((c) => (
          <span key={c} className={`pd-chip ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</span>
        ))}
      </div>
      <div className="grid-3">
        {filtered.map((v, i) => {
          const href = v.youtubeId ? `https://www.youtube.com/watch?v=${v.youtubeId}` : "#";
          return (
            <Reveal key={v.title} delay={(i % 3) * 80}>
              <a href={href} target={v.youtubeId ? "_blank" : undefined} rel="noreferrer" className="pd-card" style={{ overflow: "hidden", display: "block", cursor: "pointer" }}>
                <div style={{ aspectRatio: "16/9", background: "linear-gradient(135deg, var(--bg-alt), color-mix(in srgb, var(--accent) 18%, var(--bg-alt)))", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Play size={20} fill="#04211F" color="#04211F" />
                  </div>
                  <span style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 11, padding: "3px 8px", borderRadius: 6 }}>{v.duration}</span>
                </div>
                <div style={{ padding: 18 }}>
                  <span className="pd-tag">{v.cat}</span>
                  <div className="pd-h3" style={{ fontSize: 15, marginTop: 10 }}>{v.title}</div>
                </div>
              </a>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
