"use client";
import { useMemo, useState } from "react";
import { BookOpen } from "lucide-react";
import { formatIDR, getPriceBuckets } from "@/lib/data";
import CatalogFilters from "./CatalogFilters";
import BuyModal from "./BuyModal";
import Reveal from "./Reveal";

export default function CourseCatalog({ courses }) {
  const [level, setLevel] = useState("Semua");
  const [priceKey, setPriceKey] = useState("all");
  const [selected, setSelected] = useState(null);

  const levels = useMemo(() => ["Semua", ...Array.from(new Set(courses.map((c) => c.level)))], [courses]);
  const priceBuckets = useMemo(() => getPriceBuckets(courses), [courses]);

  const filtered = useMemo(() => {
    const bucket = priceBuckets.find((b) => b.key === priceKey) || priceBuckets[0];
    return courses.filter((c) => (level === "Semua" || c.level === level) && bucket.test(Number(c.price)));
  }, [courses, level, priceKey, priceBuckets]);

  return (
    <>
      <CatalogFilters
        categories={levels}
        activeCategory={level}
        onCategoryChange={setLevel}
        priceBuckets={priceBuckets}
        activePriceKey={priceKey}
        onPriceChange={setPriceKey}
        resultCount={filtered.length}
      />

      <div className="grid-4">
        {filtered.map((c, i) => (
          <Reveal key={c.id} delay={(i % 4) * 70}>
            <div className="pd-card" style={{ padding: 22, height: "100%", display: "flex", flexDirection: "column" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "color-mix(in srgb, var(--accent) 14%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <BookOpen size={18} color="var(--accent-dark)" />
              </div>
              <div className="pd-h3" style={{ fontSize: 15.5, flexGrow: 1 }}>{c.title}</div>
              <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 8 }}>{c.level} &middot; {c.modules} modul</div>
              <div style={{ fontWeight: 700, marginTop: 14 }}>{formatIDR(c.price)}</div>
              <button className="pd-btn-primary" style={{ marginTop: 14, width: "100%", justifyContent: "center", padding: "10px 16px", fontSize: 13.5 }} onClick={() => setSelected(c)}>
                Gabung Kelas
              </button>
            </div>
          </Reveal>
        ))}
        {filtered.length === 0 && <p className="pd-sub" style={{ fontSize: 13.5 }}>Tidak ada kelas yang cocok dengan filter ini.</p>}
      </div>

      {selected && <BuyModal item={selected} type="course" onClose={() => setSelected(null)} />}
    </>
  );
}
