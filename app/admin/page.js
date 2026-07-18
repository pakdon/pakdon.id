"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FileText, Package, Calendar, Users } from "lucide-react";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ posts: 0, products: 0, bookings: 0, subscribers: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [posts, products, bookings, subs] = await Promise.all(
          ["posts", "products", "bookings", "subscribers"].map((c) => getDocs(collection(db, c)))
        );
        setCounts({ posts: posts.size, products: products.size, bookings: bookings.size, subscribers: subs.size });
      } catch (e) {
        console.warn("Gagal memuat ringkasan dashboard:", e.message);
      }
    })();
  }, []);

  const cards = [
    { label: "Artikel", value: counts.posts, icon: FileText },
    { label: "Produk Digital", value: counts.products, icon: Package },
    { label: "Booking Konsultasi", value: counts.bookings, icon: Calendar },
    { label: "Subscriber", value: counts.subscribers, icon: Users },
  ];

  return (
    <div>
      <h1 className="pd-h2" style={{ fontSize: 26 }}>Dashboard</h1>
      <p className="pd-sub" style={{ fontSize: 14, marginTop: 6 }}>Ringkasan konten dan aktivitas website PakDon.id.</p>
      <div className="grid-4" style={{ marginTop: 26 }}>
        {cards.map((c) => (
          <div key={c.label} className="pd-card" style={{ padding: 22 }}>
            <c.icon size={18} color="var(--accent-dark)" />
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 12 }}>{c.value}</div>
            <div className="pd-sub" style={{ fontSize: 13 }}>{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
