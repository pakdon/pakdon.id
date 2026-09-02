"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatIDR } from "@/lib/data";

const STATUS_OPTIONS = ["pending_payment", "confirmed", "completed", "cancelled"];

export default function AdminBookingsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), (err) => console.warn(err.message));
    return () => unsub();
  }, []);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "bookings", id), { status });
  };

  return (
    <div>
      <h1 className="pd-h2" style={{ fontSize: 26 }}>Booking Konsultasi</h1>
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((b) => (
          <div key={b.id} className="pd-card" style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14.5 }}>{b.name} &middot; {b.packageName || `${b.duration} menit`} {b.price ? `· ${formatIDR(b.price)}` : ""}</div>
              <div className="pd-sub" style={{ fontSize: 12.5 }}>{b.whatsapp} &middot; {b.topic || "Tanpa topik spesifik"}</div>
            </div>
            <select className="pd-input" style={{ width: 180, padding: "8px 12px" }} value={b.status} onChange={(e) => updateStatus(b.id, e.target.value)}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
        {items.length === 0 && <p className="pd-sub" style={{ fontSize: 13 }}>Belum ada booking masuk.</p>}
      </div>
    </div>
  );
}
