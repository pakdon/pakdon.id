import { getCourses } from "@/lib/content";
import CourseCatalog from "@/components/CourseCatalog";

export const metadata = {
  title: "Kelas Online",
  description: "Kelas online untuk mempercepat pertumbuhan bisnis Anda: AI untuk UMKM, ecommerce, retail, personal branding, dan financial freedom.",
  alternates: { canonical: "/kelas" },
};

export default async function KelasPage() {
  const courses = await getCourses();
  return (
    <main className="pd-section" style={{ paddingTop: 168 }}>
      <div className="pd-container">
        <div style={{ maxWidth: 640, marginBottom: 10 }}>
          <span className="pd-eyebrow">Online Course</span>
          <h1 className="pd-h2">Kelas untuk Mempercepat Pertumbuhan Anda</h1>
          <p className="pd-sub" style={{ marginTop: 12 }}>
            Kelas terstruktur dengan modul yang bisa langsung diterapkan ke bisnis Anda.
          </p>
        </div>
        <div style={{ marginTop: 34 }}>
          <CourseCatalog courses={courses} />
        </div>
      </div>
    </main>
  );
}
