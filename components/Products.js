"use client";
import { useState } from "react";
import Script from "next/script";
import { FileText, Star, X } from "lucide-react";
import { DIGITAL_PRODUCTS, formatIDR } from "@/lib/data";
import Reveal from "./Reveal";

export default function Products() {
  const [selected, setSelected] = useState(null);
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
        body: JSON.stringify({ type: "product", itemId: selected.id, buyer: form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memulai pembayaran");

      if (window.snap && data.token) {
        window.snap.pay(data.token, {
          onSuccess: () => { setSelected(null); alert("Pembayaran berhasil! Cek email untuk akses produk."); },
          onPending: () => { setSelected(null); alert("Pembayaran tertunda, selesaikan pembayaran sesuai instruksi."); },
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
    <section id="products" className="pd-section alt">
      {midtransClientKey && (
        <Script
          src={process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true" ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js"}
          data-client-key={midtransClientKey}
          strategy="lazyOnload"
        />
      )}
      <div className="pd-container">
        <Reveal>
          <div style={{ maxWidth: 640, marginBottom: 40 }}>
            <span className="pd-eyebrow">Digital Product</span>
            <h2 className="pd-h2">Toolkit Siap Pakai untuk Bisnis Anda</h2>
          </div>
        </Reveal>
        <div className="grid-4">
          {DIGITAL_PRODUCTS.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 70}>
              <div className="pd-card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ aspectRatio: "4/3", background: "linear-gradient(150deg, color-mix(in srgb, var(--accent) 20%, var(--bg-alt)), var(--bg-alt))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileText size={26} color="var(--accent-dark)" />
                </div>
                <div style={{ padding: 18 }}>
                  <span className="pd-tag">{p.type}</span>
                  <div className="pd-h3" style={{ fontSize: 15.5, marginTop: 10 }}>{p.title}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 13 }}>
                    <Star size={13} fill="var(--accent)" color="var(--accent)" /> {p.rating}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                    <span style={{ fontWeight: 700 }}>{formatIDR(p.price)}</span>
                    <button className="pd-btn-secondary" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => { setSelected(p); setError(""); }}>Beli</button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="pd-card" style={{ width: 380, maxWidth: "100%", padding: 26, position: "relative" }}>
            <X size={18} style={{ position: "absolute", top: 18, right: 18, cursor: "pointer" }} onClick={() => setSelected(null)} />
            <div className="pd-h3">{selected.title}</div>
            <div style={{ fontWeight: 700, fontSize: 20, marginTop: 6, marginBottom: 18 }}>{formatIDR(selected.price)}</div>
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
      )}
    </section>
  );
}
