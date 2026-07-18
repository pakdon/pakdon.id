import { BookOpen } from "lucide-react";
import { getCourses } from "@/lib/content";
import { formatIDR } from "@/lib/data";
import Reveal from "./Reveal";

export default async function Courses() {
  const courses = await getCourses();
  return (
    <section id="courses" className="pd-section">
      <div className="pd-container">
        <Reveal>
          <div style={{ maxWidth: 640, marginBottom: 40 }}>
            <span className="pd-eyebrow">Online Course</span>
            <h2 className="pd-h2">Kelas untuk Mempercepat Pertumbuhan Anda</h2>
          </div>
        </Reveal>
        <div className="grid-5">
          {courses.map((c, i) => (
            <Reveal key={c.id || c.title} delay={i * 70}>
              <div className="pd-card" style={{ padding: 22, height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "color-mix(in srgb, var(--accent) 14%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <BookOpen size={18} color="var(--accent-dark)" />
                </div>
                <div className="pd-h3" style={{ fontSize: 15.5, flexGrow: 1 }}>{c.title}</div>
                <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 8 }}>{c.level} &middot; {c.modules} modul</div>
                <div style={{ fontWeight: 700, marginTop: 14 }}>{formatIDR(c.price)}</div>
                <button className="pd-btn-primary" style={{ marginTop: 14, width: "100%", justifyContent: "center", padding: "10px 16px", fontSize: 13.5 }}>Gabung Kelas</button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
