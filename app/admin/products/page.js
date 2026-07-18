"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { collection, addDoc, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Plus } from "lucide-react";
import { formatIDR } from "@/lib/data";

const empty = { title: "", type: "Ebook", price: 0, rating: 5 };

export default function AdminProductsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), (err) => console.warn(err.message));
    return () => unsub();
  }, []);

  const save = async () => {
    if (!form.title || !form.price) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "products"), { ...form, price: Number(form.price), rating: Number(form.rating), createdAt: new Date().toISOString() });
      setForm(empty);
    } catch (e) {
      alert("Gagal menyimpan: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Hapus produk ini?")) return;
    await deleteDoc(doc(db, "products", id));
  };

  return (
    <div>
      <h1 className="pd-h2" style={{ fontSize: 26 }}>Kelola Produk Digital</h1>
      <div className="pd-card" style={{ padding: 22, marginTop: 20 }}>
        <div className="pd-h3" style={{ fontSize: 16, marginBottom: 14 }}>Tambah Produk Baru</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
          <input className="pd-input" placeholder="Nama produk" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="pd-input" placeholder="Tipe (Ebook, SOP, dll)" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <input className="pd-input" placeholder="Harga (Rp)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input className="pd-input" placeholder="Rating (1-5)" type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
        </div>
        <p className="pd-sub" style={{ fontSize: 12, marginTop: 10 }}>Catatan: produk yang dibuat di sini perlu ID unik untuk checkout — hubungkan alur checkout ke produk Firestore dengan menyesuaikan <code>itemId</code> di <code>/api/checkout</code> (saat ini contoh checkout memakai katalog di <code>lib/data.js</code>).</p>
        <button className="pd-btn-primary" style={{ marginTop: 14 }} onClick={save} disabled={saving}>
          <Plus size={15} /> {saving ? "Menyimpan..." : "Simpan Produk"}
        </button>
      </div>

      <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((p) => (
          <div key={p.id} className="pd-card" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14.5 }}>{p.title}</div>
              <div className="pd-sub" style={{ fontSize: 12.5 }}>{p.type} &middot; {formatIDR(p.price)} &middot; ⭐ {p.rating}</div>
            </div>
            <button onClick={() => remove(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e5484d" }}><Trash2 size={17} /></button>
          </div>
        ))}
        {items.length === 0 && <p className="pd-sub" style={{ fontSize: 13 }}>Belum ada produk di Firestore — website memakai katalog contoh sampai Anda menambahkan produk baru.</p>}
      </div>
    </div>
  );
}
