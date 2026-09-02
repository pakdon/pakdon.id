"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LayoutDashboard, FileText, Package, Calendar, Users, LogOut, Wallet } from "lucide-react";
import Link from "next/link";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/blog", label: "Artikel", icon: FileText },
  { href: "/admin/products", label: "Produk Digital", icon: Package },
  { href: "/admin/consultation", label: "Harga Konsultasi", icon: Wallet },
  { href: "/admin/bookings", label: "Booking Konsultasi", icon: Calendar },
  { href: "/admin/subscribers", label: "Subscriber", icon: Users },
];

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(undefined);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!auth) { setUser(null); return; }
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user === null && pathname !== "/admin/login") router.push("/admin/login");
  }, [user, pathname, router]);

  if (pathname === "/admin/login") return children;
  if (user === undefined) return <div style={{ padding: 60, textAlign: "center" }} className="pd-sub">Memuat...</div>;
  if (!user) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 240, borderRight: "1px solid var(--border)", padding: 24, position: "sticky", top: 0, height: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 30 }}>PakDon<span style={{ color: "var(--accent)" }}>.id</span> <span className="pd-sub" style={{ fontSize: 11 }}>Admin</span></div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flexGrow: 1 }}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, fontSize: 14, fontWeight: 500, background: pathname === l.href ? "var(--bg-alt)" : "transparent", color: pathname === l.href ? "var(--accent-dark)" : "var(--text)" }}>
              <l.icon size={16} /> {l.label}
            </Link>
          ))}
        </nav>
        <button onClick={() => signOut(auth)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, fontSize: 14, fontWeight: 500, background: "transparent", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
          <LogOut size={16} /> Keluar
        </button>
      </aside>
      <div style={{ flex: 1, padding: 32, background: "var(--bg-alt)" }}>{children}</div>
    </div>
  );
}
