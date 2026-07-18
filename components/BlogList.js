"use client";
import { useMemo, useState } from "react";
import { Search, Clock } from "lucide-react";
import Link from "next/link";
import Reveal from "./Reveal";

export default function BlogList({ posts, categories }) {
  const [cat, setCat] = useState("Semua");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => posts.filter((p) => {
    const matchCat = cat === "Semua" || p.cat === cat;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }), [posts, cat, search]);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <div style={{ position: "relative", width: 280, maxWidth: "100%" }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: 14, color: "var(--text-secondary)" }} />
          <input className="pd-input" style={{ paddingLeft: 40 }} placeholder="Cari artikel..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 30 }}>
        {categories.map((c) => (
          <span key={c} className={`pd-chip ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</span>
        ))}
      </div>
      <div className="grid-4">
        {filtered.map((p, i) => (
          <Reveal key={p.slug || p.title} delay={(i % 4) * 70}>
            <Link href={`/blog/${p.slug || ""}`} className="pd-card" style={{ padding: 22, height: "100%", display: "flex", flexDirection: "column" }}>
              <span className="pd-tag" style={{ alignSelf: "flex-start" }}>{p.cat}</span>
              <div className="pd-h3" style={{ fontSize: 16, marginTop: 12, lineHeight: 1.35 }}>{p.title}</div>
              <div className="pd-sub" style={{ fontSize: 13.5, marginTop: 8, flexGrow: 1 }}>{p.excerpt}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16, fontSize: 12.5, color: "var(--text-secondary)" }}>
                <Clock size={13} /> {p.read} baca
              </div>
            </Link>
          </Reveal>
        ))}
        {filtered.length === 0 && <div className="pd-sub">Tidak ada artikel yang cocok.</div>}
      </div>
    </>
  );
}
