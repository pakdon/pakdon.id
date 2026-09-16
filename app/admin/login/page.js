"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firebaseDiagnostics } from "@/lib/firebase";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!auth) { setError("Firebase belum dikonfigurasi. Isi NEXT_PUBLIC_FIREBASE_* di .env.local terlebih dahulu."); return; }
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err) {
      setError("Email atau password salah, atau Firebase belum dikonfigurasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <form onSubmit={submit} className="pd-card" style={{ width: 380, maxWidth: "100%", padding: 34 }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: "color-mix(in srgb, var(--accent) 14%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
          <Lock size={20} color="var(--accent-dark)" />
        </div>
        <div className="pd-h3">Admin PakDon.id</div>
        <p className="pd-sub" style={{ fontSize: 13.5, marginTop: 6, marginBottom: 22 }}>Masuk untuk mengelola konten website.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input className="pd-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="pd-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <div style={{ color: "#e5484d", fontSize: 12.5, marginTop: 10 }}>{error}</div>}

        {firebaseDiagnostics.missing.length > 0 && (
          <div style={{ marginTop: 14, padding: 12, borderRadius: 12, border: "1px solid #e5484d", fontSize: 12, lineHeight: 1.7 }}>
            <div style={{ fontWeight: 600, marginBottom: 6, color: "#e5484d" }}>Konfigurasi Firebase belum lengkap</div>
            <div className="pd-sub" style={{ fontSize: 11.5 }}>
              Tidak terbaca: {firebaseDiagnostics.missing.join(", ")}
              <br /><br />
              Di Vercel, variabel <code>NEXT_PUBLIC_*</code> harus bertipe <b>Config</b>, bukan <b>Secret</b>.
              Secret bersifat write-only sehingga nilainya tidak ikut ter-build ke browser.
            </div>
          </div>
        )}
        <button type="submit" className="pd-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 18 }} disabled={loading}>
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </main>
  );
}
