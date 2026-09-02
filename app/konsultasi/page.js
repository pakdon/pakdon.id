import { getConsultationDurations } from "@/lib/content";
import Consultation from "@/components/Consultation";

export const metadata = {
  title: "Konsultasi Bisnis",
  description: "Booking sesi konsultasi 1-on-1 dengan Pak Don untuk membahas tantangan bisnis Anda secara spesifik.",
  alternates: { canonical: "/konsultasi" },
};

export default async function KonsultasiPage() {
  const packages = await getConsultationDurations();
  return (
    <main>
      <Consultation packages={packages} />
    </main>
  );
}
