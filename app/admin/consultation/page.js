"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Save, Plus, Trash2 } from "lucide-react";
import { DURATIONS as DEFAULT_DURATIONS, formatIDR } from "@/lib/data";

// Halaman ini mengatur harga & deskripsi sesi konsultasi (30/60/120 menit, atau custom).
// Disimpan sebagai 1 dokumen tunggal di Firestore: settings/consultation.
// Halaman /konsultasi (publik) membaca dokumen ini lewat lib/content.js -> getConsultationDurations().
export default function AdminConsultationPage() {
  const [durations, setDurations] = useState(DEFAULT_DURATIONS);
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
          setDurations(snap.data().durations);
        }
      } catch (e) {
        console.warn("Gagal memuat harga konsultasi:", e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateField = (index, field, value) => {
    setDurations((prev) => prev.map((d, i) => (i === index ? { ...d, [field]: value } : d)));
  };

  const addDuration = () => {
    setDurations((prev) => [...prev, { minutes: 90, price: 800000, desc: "" }]);
  };

  const removeDuration = (index) => {
    setDurations((prev) => prev.filter((_, i) => i !== index));
  };

  const save = async () => {
    if (!db) { setError("Firebase belum dikonfigurasi."); return; }
    setSaving(true);
    setError("");
    try {
      const cleaned = durations
        .map((d) => ({ minutes: Number(d.minutes), price: Number(d.price), desc: d.desc || "" }))
        .filter((d) => d.minutes > 0 && d.price >= 0)
        .sort((a, b) => a.minutes - b.minutes);

      if (cleaned.length === 0) { setError("Minimal harus ada 1 pilihan durasi."); setSaving(false); return; }

      await setDoc(doc(db, "settings", "consultation"), { durations: cleaned, updatedAt: new Date().toISOString() });
      setDurations(cleaned);
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
        Atur pilihan durasi, harga, dan deskripsi singkat yang tampil di halaman <code>/konsultasi</code>.
      </p>

      <div className="pd-card" style={{ padding: 22, marginTop: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {durations.map((d, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "110px 160px 1fr 40px", gap: 10, alignItems: "center" }}>
              <div>
                <label className="pd-sub" style={{ fontSize: 11.5, display: "block", marginBottom: 4 }}>Durasi (menit)</label>
                <input className="pd-input" type="number" value={d.minutes} onChange={(e) => updateField(i, "minutes", e.target.value)} />
              </div>
              <div>
                <label className="pd-sub" style={{ fontSize: 11.5, display: "block", marginBottom: 4 }}>Harga (Rp)</label>
                <input className="pd-input" type="number" value={d.price} onChange={(e) => updateField(i, "price", e.target.value)} />
              </div>
              <div>
                <label className="pd-sub" style={{ fontSize: 11.5, display: "block", marginBottom: 4 }}>Deskripsi singkat</label>
                <input className="pd-input" value={d.desc} onChange={(e) => updateField(i, "desc", e.target.value)} placeholder="mis. Diskusi mendalam satu topik" />
              </div>
              <button onClick={() => removeDuration(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e5484d", marginTop: 18 }} title="Hapus durasi ini">
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>

        <button className="pd-btn-secondary" style={{ marginTop: 18 }} onClick={addDuration}>
          <Plus size={15} /> Tambah Pilihan Durasi
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
          {durations.map((d, i) => (
            <div key={i} style={{ border: "1.5px solid var(--border)", borderRadius: 16, padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{d.minutes}<span style={{ fontSize: 12, fontWeight: 500 }}> menit</span></div>
              <div className="pd-sub" style={{ fontSize: 12, marginTop: 4 }}>{d.desc || "—"}</div>
              <div style={{ fontWeight: 600, marginTop: 10, fontSize: 13.5 }}>{formatIDR(Number(d.price) || 0)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
