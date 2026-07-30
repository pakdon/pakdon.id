import Consultation from "@/components/Consultation";

export const metadata = {
  title: "Konsultasi Bisnis",
  description: "Booking sesi konsultasi 1-on-1 dengan Pak Don untuk membahas tantangan bisnis Anda secara spesifik.",
  alternates: { canonical: "/konsultasi" },
};

export default function KonsultasiPage() {
  return (
    <main>
      <Consultation />
    </main>
  );
}
