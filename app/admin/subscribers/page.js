"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Download } from "lucide-react";

export default function AdminSubscribersPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "subscribers"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), (err) => console.warn(err.message));
    return () => unsub();
  }, []);

  const exportCsv = () => {
    const rows = ["email,createdAt", ...items.map((i) => `${i.email},${i.createdAt}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "subscribers.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="pd-h2" style={{ fontSize: 26 }}>Subscriber Newsletter</h1>
        <button className="pd-btn-secondary" onClick={exportCsv}><Download size={15} /> Export CSV</button>
      </div>
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((s) => (
          <div key={s.id} className="pd-card" style={{ padding: 14, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14 }}>{s.email}</span>
            <span className="pd-sub" style={{ fontSize: 12.5 }}>{new Date(s.createdAt).toLocaleDateString("id-ID")}</span>
          </div>
        ))}
        {items.length === 0 && <p className="pd-sub" style={{ fontSize: 13 }}>Belum ada subscriber.</p>}
      </div>
    </div>
  );
}
