"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, firebaseDiagnostics } from "@/lib/firebase";
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
          // Kompatibilitas: paket yang tersimpan sebelum durasi jadi teks bebas
          // masih memakai `minutes` (angka). Ubah jadi teks supaya kolomnya tidak kosong.
          setPackages(snap.data().durations.map((p) => ({
            ...p,
            duration: (p.duration || "").trim() || (p.minutes ? `${p.minutes} menit` : ""),
          })));
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
    setPackages((prev) => [...prev, { id: `paket-baru-${prev.length + 1}`, name: "", desc: "", duration: "", price: 0, lynkUrl: "" }]);
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
        .map((p) => ({ name: (p.name || "").trim(), desc: p.desc || "", duration: (p.duration || "").trim(), price: Number(p.price), lynkUrl: (p.lynkUrl || "").trim() }))
        .filter((p) => p.name && p.duration && p.price >= 0)
        .map((p) => {
          let id = slugify(p.name);
          let candidate = id;
          let n = 2;
          while (usedIds.has(candidate)) { candidate = `${id}-${n}`; n += 1; }
          usedIds.add(candidate);
          return { id: candidate, ...p };
        });

      if (cleaned.length === 0) { setError("Minimal harus ada 1 paket dengan nama, durasi, dan harga terisi."); setSaving(false); return; }

      // Batas waktu 15 detik — kalau Firestore tidak merespons sama sekali (bukan error, tapi hang),
      // tombol tidak akan stuck selamanya dan penyebabnya lebih mudah didiagnosis.
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), 15000));
      await Promise.race([
        setDoc(doc(db, "settings", "consultation"), { durations: cleaned, updatedAt: new Date().toISOString() }),
        timeout,
      ]);
      setPackages(cleaned);
      setSavedAt(new Date());
    } catch (e) {
      if (e.message === "TIMEOUT") {
        setError(`Waktu penyimpanan habis (15 detik). Firestore sedang mencoba menghubungi project: "${firebaseDiagnostics.projectId}" — pastikan nama ini persis sama dengan Project ID di Firebase Console (tanpa tanda kutip, tanpa spasi).`);
      } else if (e.code === "permission-denied") {
        setError("Akses ditolak Firestore — pastikan firestore.rules sudah di-deploy dan Anda login sebagai admin yang valid.");
      } else {
        setError("Gagal menyimpan: " + e.message);
      }
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

      <div className="pd-card" style={{ padding: 16, marginTop: 16, borderColor: firebaseDiagnostics.missing.length ? "#e5484d" : "var(--border)" }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Status koneksi Firebase</div>
        <div className="pd-sub" style={{ fontSize: 12.5, lineHeight: 1.8 }}>
          Project ID: <code>{firebaseDiagnostics.projectId}</code><br />
          Auth domain: <code>{firebaseDiagnostics.authDomain}</code><br />
          API key: {firebaseDiagnostics.apiKeyPresent ? "terisi" : "KOSONG"}
          {firebaseDiagnostics.missing.length > 0 && (
            <>
              <br />
              <span style={{ color: "#e5484d" }}>Belum diisi: {firebaseDiagnostics.missing.join(", ")}</span>
            </>
          )}
        </div>
      </div>

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
                  <label className="pd-sub" style={{ fontSize: 11.5, display: "block", marginBottom: 4 }}>3. Durasi</label>
                  <input className="pd-input" value={p.duration || ""} onChange={(e) => updateField(i, "duration", e.target.value)} placeholder="mis. 30 menit / 2 jam / 1 hari" />
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
              <div className="pd-sub" style={{ fontSize: 12, marginTop: 4 }}>{p.duration || "—"}</div>
              <div className="pd-sub" style={{ fontSize: 12, marginTop: 2 }}>{p.desc || "—"}</div>
              <div style={{ fontWeight: 600, marginTop: 10, fontSize: 13.5 }}>{formatIDR(Number(p.price) || 0)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
