"use client";
import { useState } from "react";
import Script from "next/script";
import { X } from "lucide-react";
import { formatIDR } from "@/lib/data";

// Modal pembelian generik — dipakai untuk checkout Produk Digital (Ebook) maupun Kelas Online.
// `type` dikirim ke /api/checkout: "product" atau "course".
export default function BuyModal({ item, type, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

  const openCheckout = async () => {
    if (!form.name || !form.email) { setError("Nama dan email wajib diisi"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, itemId: item.id, buyer: form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memulai pembayaran");

      if (window.snap && data.token) {
        window.snap.pay(data.token, {
          onSuccess: () => { onClose(); alert("Pembayaran berhasil! Cek email untuk detail akses."); },
          onPending: () => { onClose(); alert("Pembayaran tertunda, selesaikan pembayaran sesuai instruksi."); },
          onError: () => setError("Pembayaran gagal, silakan coba lagi."),
          onClose: () => {},
        });
      } else if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {midtransClientKey && (
        <Script
          src={process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true" ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js"}
          data-client-key={midtransClientKey}
          strategy="lazyOnload"
        />
      )}
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div className="pd-card" style={{ width: 380, maxWidth: "100%", padding: 26, position: "relative" }}>
          <X size={18} style={{ position: "absolute", top: 18, right: 18, cursor: "pointer" }} onClick={onClose} />
          <div className="pd-h3">{item.title}</div>
          <div style={{ fontWeight: 700, fontSize: 20, marginTop: 6, marginBottom: 18 }}>{formatIDR(item.price)}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input className="pd-input" placeholder="Nama lengkap" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="pd-input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="pd-input" placeholder="Nomor WhatsApp (opsional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          {error && <div style={{ color: "#e5484d", fontSize: 12.5, marginTop: 10 }}>{error}</div>}
          <button className="pd-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 18 }} onClick={openCheckout} disabled={loading}>
            {loading ? "Memproses..." : "Lanjut ke Pembayaran"}
          </button>
        </div>
      </div>
    </>
  );
}
