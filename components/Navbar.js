"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X, ArrowRight, Sun, Moon } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);

    if (!isHome) return () => window.removeEventListener("scroll", onScroll);

    const anchorLinks = NAV_LINKS.filter((n) => n.type === "anchor");
    const sections = anchorLinks.map((n) => document.getElementById(n.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => { window.removeEventListener("scroll", onScroll); obs.disconnect(); };
  }, [isHome]);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("pd-theme", next ? "dark" : "light");
  };

  const goToAnchor = (id) => {
    setMenuOpen(false);
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(id === "home" ? "/" : `/#${id}`);
    }
  };

  const isActive = (link) => {
    if (link.type === "route") return pathname === link.href;
    return isHome && active === link.id;
  };

  const renderLink = (link, extraClass = "") => {
    if (link.type === "route") {
      return (
        <Link key={link.id} href={link.href} onClick={() => setMenuOpen(false)} className={`pd-navlink ${extraClass} ${isActive(link) ? "active" : ""}`}>
          {link.label}
        </Link>
      );
    }
    return (
      <span key={link.id} onClick={() => goToAnchor(link.id)} className={`pd-navlink ${extraClass} ${isActive(link) ? "active" : ""}`} style={{ cursor: "pointer" }}>
        {link.label}
      </span>
    );
  };

  return (
    <header className={`pd-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="pd-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <Link href="/" style={{ cursor: "pointer", fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: 4, background: "var(--accent)", display: "inline-block" }} />
          PakDon<span style={{ color: "var(--accent)" }}>.id</span>
        </Link>

        <nav className="hidden md:flex" style={{ gap: 28, alignItems: "center" }}>
          {NAV_LINKS.map((l) => renderLink(l))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={toggleDark} aria-label="Ganti mode gelap/terang"
            style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link href="/konsultasi" className="pd-btn-primary hidden md:inline-flex">
            Konsultasi <ArrowRight size={15} />
          </Link>
          <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)}
            style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            {menuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden" style={{ borderTop: "1px solid var(--border)", padding: "12px 24px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_LINKS.map((l) => (
            <div key={l.id} style={{ padding: "12px 4px" }}>
              {renderLink(l)}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
