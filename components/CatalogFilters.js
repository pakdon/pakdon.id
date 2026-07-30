"use client";

// Filter generik: chip kategori + dropdown rentang harga. Dipakai di halaman Ebook & Kelas.
export default function CatalogFilters({ categories, activeCategory, onCategoryChange, priceBuckets, activePriceKey, onPriceChange, resultCount }) {
  return (
    <div style={{ marginBottom: 30 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {categories.map((c) => (
            <span key={c} className={`pd-chip ${activeCategory === c ? "active" : ""}`} onClick={() => onCategoryChange(c)}>{c}</span>
          ))}
        </div>
        <select className="pd-input" style={{ width: 220, padding: "9px 14px" }} value={activePriceKey} onChange={(e) => onPriceChange(e.target.value)}>
          {priceBuckets.map((b) => <option key={b.key} value={b.key}>{b.label}</option>)}
        </select>
      </div>
      <div className="pd-sub" style={{ fontSize: 12.5, marginTop: 14 }}>{resultCount} hasil ditemukan</div>
    </div>
  );
}
