"use client";
import Link from "next/link";

// Jaring pengaman: kalau ada error tak terduga saat render, pengunjung melihat
// halaman ini (masih bergaya PakDon.id) alih-alih layar 500 kosong dari server.
export default function Error({ error, reset }) {
  return (
    <main style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="pd-card" style={{ maxWidth: 460, padding: 34, textAlign: "center" }}>
        <div className="pd-h3">Halaman gagal dimuat</div>
        <p className="pd-sub" style={{ fontSize: 14, marginTop: 10 }}>
          Terjadi kendala sementara di sisi server. Silakan coba muat ulang.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 22, flexWrap: "wrap" }}>
          <button className="pd-btn-primary" onClick={() => reset()}>Coba Lagi</button>
          <Link href="/" className="pd-btn-secondary">Kembali ke Beranda</Link>
        </div>
        {process.env.NODE_ENV !== "production" && error?.message && (
          <p className="pd-sub" style={{ fontSize: 11.5, marginTop: 18, wordBreak: "break-word", textAlign: "left" }}>
            {error.message}
          </p>
        )}
      </div>
    </main>
  );
}
