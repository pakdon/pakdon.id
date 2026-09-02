"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Save, Plus, Trash2 } from "lucide-react";
import { DURATIONS as DEFAULT_DURATIONS, formatIDR, slugify } from "@/lib/data";

// Halaman ini mengatur paket konsultasi: Nama Paket, Deskripsi, Durasi, dan Harga.
// Disimpan sebagai 1 dokumen tunggal di Firestore: settings/consultation.
// Halaman /konsultasi (publik) membaca dokumen ini lewat lib/content.js -> getConsultationDurations().
export default function AdminConsultationPage() {
  const [packages, setPackages] = useState(DEFAULT_DURATIONS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    (async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "consultation"));
        if (snap.exists() && Array.isArray(snap.data().durations) && snap.data().durations.length) {
          setPackages(snap.data().durations);
        }
      } catch (e) {
        console.warn("Gagal memuat paket konsultasi:", e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateField = (index, field, value) => {
    setPackages((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const addPackage = () => {
    setPackages((prev) => [...prev, { id: `paket-baru-${prev.length + 1}`, name: "", desc: "", minutes: 60, price: 0, lynkUrl: "" }]);
  };

  const removePackage = (index) => {
    setPackages((prev) => prev.filter((_, i) => i !== index));
  };

  const save = async () => {
    if (!db) { setError("Firebase belum dikonfigurasi."); return; }
    setSaving(true);
    setError("");
    try {
      const usedIds = new Set();
      const cleaned = packages
        .map((p) => ({ name: (p.name || "").trim(), desc: p.desc || "", minutes: Number(p.minutes), price: Number(p.price), lynkUrl: (p.lynkUrl || "").trim() }))
        .filter((p) => p.name && p.minutes > 0 && p.price >= 0)
        .map((p) => {
          let id = slugify(p.name);
          let candidate = id;
          let n = 2;
          while (usedIds.has(candidate)) { candidate = `${id}-${n}`; n += 1; }
          usedIds.add(candidate);
          return { id: candidate, ...p };
        })
        .sort((a, b) => a.minutes - b.minutes);

      if (cleaned.length === 0) { setError("Minimal harus ada 1 paket dengan nama, durasi, dan harga terisi."); setSaving(false); return; }

      await setDoc(doc(db, "settings", "consultation"), { durations: cleaned, updatedAt: new Date().toISOString() });
      setPackages(cleaned);
      setSavedAt(new Date());
    } catch (e) {
      setError("Gagal menyimpan: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="pd-sub" style={{ fontSize: 13.5 }}>Memuat...</p>;

  return (
    <div>
      <h1 className="pd-h2" style={{ fontSize: 26 }}>Harga Konsultasi</h1>
      <p className="pd-sub" style={{ fontSize: 14, marginTop: 6 }}>
        Atur paket konsultasi yang tampil di halaman <code>/konsultasi</code>: nama paket, deskripsi, durasi, dan harga.
      </p>

      <div className="pd-card" style={{ padding: 22, marginTop: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {packages.map((p, i) => (
            <div key={i} style={{ border: "1px solid var(--border)", borderRadius: 14, padding: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="pd-sub" style={{ fontSize: 11.5, display: "block", marginBottom: 4 }}>1. Nama Paket</label>
                  <input className="pd-input" value={p.name} onChange={(e) => updateField(i, "name", e.target.value)} placeholder="mis. Konsultasi Singkat" />
                </div>
                <div>
                  <label className="pd-sub" style={{ fontSize: 11.5, display: "block", marginBottom: 4 }}>2. Deskripsi</label>
                  <input className="pd-input" value={p.desc} onChange={(e) => updateField(i, "desc", e.target.value)} placeholder="mis. Diskusi mendalam satu topik" />
                </div>
                <div>
                  <label className="pd-sub" style={{ fontSize: 11.5, display: "block", marginBottom: 4 }}>3. Durasi (menit)</label>
                  <input className="pd-input" type="number" value={p.minutes} onChange={(e) => updateField(i, "minutes", e.target.value)} />
                </div>
                <div>
                  <label className="pd-sub" style={{ fontSize: 11.5, display: "block", marginBottom: 4 }}>4. Harga (Rp)</label>
                  <input className="pd-input" type="number" value={p.price} onChange={(e) => updateField(i, "price", e.target.value)} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label className="pd-sub" style={{ fontSize: 11.5, display: "block", marginBottom: 4 }}>5. Link Lynk.id</label>
                  <input className="pd-input" value={p.lynkUrl || ""} onChange={(e) => updateField(i, "lynkUrl", e.target.value)} placeholder="https://lynk.id/pakdon/xxxxx" />
                </div>
              </div>
              <button onClick={() => removePackage(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e5484d", marginTop: 12, display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                <Trash2 size={15} /> Hapus paket ini
              </button>
            </div>
          ))}
        </div>

        <button className="pd-btn-secondary" style={{ marginTop: 18 }} onClick={addPackage}>
          <Plus size={15} /> Tambah Paket Konsultasi
        </button>

        {error && <div style={{ color: "#e5484d", fontSize: 12.5, marginTop: 14 }}>{error}</div>}

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 20 }}>
          <button className="pd-btn-primary" onClick={save} disabled={saving}>
            <Save size={15} /> {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          {savedAt && <span className="pd-sub" style={{ fontSize: 12.5 }}>Tersimpan {savedAt.toLocaleTimeString("id-ID")}</span>}
        </div>
      </div>

      <div className="pd-card" style={{ padding: 22, marginTop: 20 }}>
        <div className="pd-h3" style={{ fontSize: 15, marginBottom: 12 }}>Pratinjau di halaman publik</div>
        <div className="grid-3">
          {packages.map((p, i) => (
            <div key={i} style={{ border: "1.5px solid var(--border)", borderRadius: 16, padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name || "(Nama paket belum diisi)"}</div>
              <div className="pd-sub" style={{ fontSize: 12, marginTop: 4 }}>{p.minutes || 0} menit</div>
              <div className="pd-sub" style={{ fontSize: 12, marginTop: 2 }}>{p.desc || "—"}</div>
              <div style={{ fontWeight: 600, marginTop: 10, fontSize: 13.5 }}>{formatIDR(Number(p.price) || 0)}</div>
              {p.lynkUrl && <div className="pd-sub" style={{ fontSize: 11, marginTop: 6, wordBreak: "break-all" }}>{p.lynkUrl}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
