import { getConsultationDurations } from "@/lib/content";
import Consultation from "@/components/Consultation";

// Harga selalu diambil ulang dari Firestore setiap kunjungan.
// Tanpa ini, Next.js akan memprerender halaman saat build sehingga harga yang tampil
// "beku" pada nilai terakhir waktu deploy — perubahan dari Admin tidak akan muncul
// sampai ada build baru. Harga tidak boleh basi, jadi halaman ini dibuat dinamis.
export const revalidate = 0;

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
