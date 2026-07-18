"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { collection, addDoc, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Plus } from "lucide-react";

const empty = { title: "", slug: "", cat: "Bisnis", read: "5 menit", excerpt: "", content: "" };

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), (err) => console.warn(err.message));
    return () => unsub();
  }, []);

  const save = async () => {
    if (!form.title || !form.slug) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "posts"), { ...form, createdAt: new Date().toISOString() });
      setForm(empty);
    } catch (e) {
      alert("Gagal menyimpan: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Hapus artikel ini?")) return;
    await deleteDoc(doc(db, "posts", id));
  };

  return (
    <div>
      <h1 className="pd-h2" style={{ fontSize: 26 }}>Kelola Artikel</h1>
      <div className="pd-card" style={{ padding: 22, marginTop: 20 }}>
        <div className="pd-h3" style={{ fontSize: 16, marginBottom: 14 }}>Tambah Artikel Baru</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <input className="pd-input" placeholder="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") })} />
          <input className="pd-input" placeholder="Slug URL" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <input className="pd-input" placeholder="Kategori" value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })} />
          <input className="pd-input" placeholder="Estimasi baca (mis. 5 menit)" value={form.read} onChange={(e) => setForm({ ...form, read: e.target.value })} />
        </div>
        <textarea className="pd-input" placeholder="Ringkasan (excerpt)" rows={2} style={{ marginTop: 12 }} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        <textarea className="pd-input" placeholder="Isi artikel lengkap" rows={6} style={{ marginTop: 12 }} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <button className="pd-btn-primary" style={{ marginTop: 14 }} onClick={save} disabled={saving}>
          <Plus size={15} /> {saving ? "Menyimpan..." : "Simpan Artikel"}
        </button>
      </div>

      <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 10 }}>
        {posts.map((p) => (
          <div key={p.id} className="pd-card" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14.5 }}>{p.title}</div>
              <div className="pd-sub" style={{ fontSize: 12.5 }}>{p.cat} &middot; /blog/{p.slug}</div>
            </div>
            <button onClick={() => remove(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e5484d" }}><Trash2 size={17} /></button>
          </div>
        ))}
        {posts.length === 0 && <p className="pd-sub" style={{ fontSize: 13 }}>Belum ada artikel di Firestore — website akan menampilkan artikel contoh sampai Anda menambahkan yang baru.</p>}
      </div>
    </div>
  );
}
