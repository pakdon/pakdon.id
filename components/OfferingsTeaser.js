import Link from "next/link";
import { FileText, BookOpen, Calendar, ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

const OFFERINGS = [
  { href: "/ebook", icon: FileText, tag: "Ebook & Produk Digital", title: "Toolkit siap pakai untuk bisnis Anda", desc: "SOP, dashboard, template, dan prompt AI — bisa langsung dipakai hari ini." },
  { href: "/kelas", icon: BookOpen, tag: "Online Course", title: "Kelas untuk mempercepat pertumbuhan", desc: "Dari AI untuk UMKM sampai Financial Freedom Blueprint." },
  { href: "/konsultasi", icon: Calendar, tag: "Consultation", title: "Diskusi langsung dengan Pak Don", desc: "Booking sesi 1-on-1 untuk membahas tantangan bisnis Anda." },
];

export default function OfferingsTeaser() {
  return (
    <section className="pd-section alt">
      <div className="pd-container">
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 46px" }}>
            <span className="pd-eyebrow">Yang Bisa Anda Dapatkan</span>
            <h2 className="pd-h2">Produk, Kelas & Konsultasi</h2>
            <p className="pd-sub" style={{ marginTop: 12 }}>Pilih cara belajar yang paling cocok untuk kebutuhan bisnis Anda.</p>
          </div>
        </Reveal>
        <div className="grid-3">
          {OFFERINGS.map((o, i) => (
            <Reveal key={o.href} delay={i * 90}>
              <Link href={o.href} className="pd-card" style={{ display: "block", padding: 28, height: "100%" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "color-mix(in srgb, var(--accent) 14%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <o.icon size={22} color="var(--accent-dark)" />
                </div>
                <span className="pd-tag">{o.tag}</span>
                <div className="pd-h3" style={{ fontSize: 17, marginTop: 12 }}>{o.title}</div>
                <div className="pd-sub" style={{ fontSize: 14, marginTop: 8 }}>{o.desc}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 18, fontSize: 13.5, fontWeight: 600, color: "var(--accent-dark)" }}>
                  Lihat selengkapnya <ArrowRight size={14} />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
