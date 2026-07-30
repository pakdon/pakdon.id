"use client";
import { useMemo, useState } from "react";
import { FileText, Star } from "lucide-react";
import { formatIDR, getPriceBuckets } from "@/lib/data";
import CatalogFilters from "./CatalogFilters";
import BuyModal from "./BuyModal";
import Reveal from "./Reveal";

export default function EbookCatalog({ products }) {
  const [category, setCategory] = useState("Semua");
  const [priceKey, setPriceKey] = useState("all");
  const [selected, setSelected] = useState(null);

  const categories = useMemo(() => ["Semua", ...Array.from(new Set(products.map((p) => p.type)))], [products]);
  const priceBuckets = useMemo(() => getPriceBuckets(products), [products]);

  const filtered = useMemo(() => {
    const bucket = priceBuckets.find((b) => b.key === priceKey) || priceBuckets[0];
    return products.filter((p) => (category === "Semua" || p.type === category) && bucket.test(Number(p.price)));
  }, [products, category, priceKey, priceBuckets]);

  return (
    <>
      <CatalogFilters
        categories={categories}
        activeCategory={category}
        onCategoryChange={setCategory}
        priceBuckets={priceBuckets}
        activePriceKey={priceKey}
        onPriceChange={setPriceKey}
        resultCount={filtered.length}
      />

      <div className="grid-4">
        {filtered.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 70}>
            <div className="pd-card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ aspectRatio: "4/3", background: "linear-gradient(150deg, color-mix(in srgb, var(--accent) 20%, var(--bg-alt)), var(--bg-alt))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileText size={26} color="var(--accent-dark)" />
              </div>
              <div style={{ padding: 18 }}>
                <span className="pd-tag">{p.type}</span>
                <div className="pd-h3" style={{ fontSize: 15.5, marginTop: 10 }}>{p.title}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 13 }}>
                  <Star size={13} fill="var(--accent)" color="var(--accent)" /> {p.rating}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                  <span style={{ fontWeight: 700 }}>{formatIDR(p.price)}</span>
                  <button className="pd-btn-secondary" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setSelected(p)}>Beli</button>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
        {filtered.length === 0 && <p className="pd-sub" style={{ fontSize: 13.5 }}>Tidak ada produk yang cocok dengan filter ini.</p>}
      </div>

      {selected && <BuyModal item={selected} type="product" onClose={() => setSelected(null)} />}
    </>
  );
}
