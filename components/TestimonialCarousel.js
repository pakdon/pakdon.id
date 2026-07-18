"use client";
import { useEffect, useState } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonialCarousel({ items }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, [items.length]);

  if (!items.length) return null;
  const t = items[index];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
      <div className="pd-card" style={{ padding: "42px 46px", textAlign: "center" }}>
        <Quote size={28} color="var(--accent)" style={{ margin: "0 auto 16px" }} />
        <div style={{ fontSize: 18, lineHeight: 1.6, fontWeight: 500 }}>&ldquo;{t.quote}&rdquo;</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 3, marginTop: 18 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={15} fill={i < t.rating ? "var(--accent)" : "none"} color="var(--accent)" />
          ))}
        </div>
        <div style={{ marginTop: 16, fontWeight: 700 }}>{t.name}</div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{t.role}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 22 }}>
        <button onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)} style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={16} />
        </button>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {items.map((_, i) => (
            <span key={i} onClick={() => setIndex(i)} style={{ width: i === index ? 20 : 7, height: 7, borderRadius: 4, background: i === index ? "var(--accent)" : "var(--border)", cursor: "pointer", transition: "all .3s ease" }} />
          ))}
        </div>
        <button onClick={() => setIndex((i) => (i + 1) % items.length)} style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
