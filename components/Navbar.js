"use client";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight, Sun, Moon } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);

    const sections = NAV_LINKS.map((n) => document.getElementById(n.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => { window.removeEventListener("scroll", onScroll); obs.disconnect(); };
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("pd-theme", next ? "dark" : "light");
  };

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={`pd-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="pd-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <div onClick={() => scrollTo("home")} style={{ cursor: "pointer", fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: 4, background: "var(--accent)", display: "inline-block" }} />
          PakDon<span style={{ color: "var(--accent)" }}>.id</span>
        </div>

        <nav className="hidden md:flex" style={{ gap: 28, alignItems: "center" }}>
          {NAV_LINKS.map((l) => (
            <span key={l.id} onClick={() => scrollTo(l.id)} className={`pd-navlink ${active === l.id ? "active" : ""}`}>
              {l.label}
            </span>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={toggleDark} aria-label="Ganti mode gelap/terang"
            style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="pd-btn-primary hidden md:inline-flex" onClick={() => scrollTo("consultation")}>
            Konsultasi <ArrowRight size={15} />
          </button>
          <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)}
            style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            {menuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden" style={{ borderTop: "1px solid var(--border)", padding: "12px 24px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_LINKS.map((l) => (
            <div key={l.id} onClick={() => scrollTo(l.id)} style={{ padding: "12px 4px", fontWeight: 500, color: active === l.id ? "var(--accent)" : "var(--text)" }}>
              {l.label}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
