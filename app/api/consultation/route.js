import { adminDb } from "@/lib/firebaseAdmin";
import { getConsultationDurations } from "@/lib/content";

// Catatan: booking di sini menyimpan permintaan ke Firestore koleksi "bookings".
// Harga per durasi diambil dari getConsultationDurations() (Firestore settings/consultation,
// diatur lewat Admin > Harga Konsultasi), supaya harga yang dicatat selalu konsisten dengan yang tampil di halaman.
// Untuk auto-create event di Google Calendar, hubungkan Google Calendar API
// (OAuth service account + calendar.events.insert) di sini setelah dokumen tersimpan.
export async function POST(req) {
  const body = await req.json();
  const { name, whatsapp, topic, duration } = body || {};

  if (!name || !whatsapp || !duration) {
    return Response.json({ error: "Nama, WhatsApp, dan durasi wajib diisi" }, { status: 400 });
  }

  try {
    const durations = await getConsultationDurations();
    const selected = durations.find((d) => String(d.minutes) === String(duration));
    const price = selected?.price ?? null;

    let bookingId = null;
    if (adminDb) {
      const ref = await adminDb.collection("bookings").add({
        name, whatsapp, topic: topic || "", duration, price,
        status: "pending_payment",
        createdAt: new Date().toISOString(),
      });
      bookingId = ref.id;
    }

    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281200000000";
    const waText = encodeURIComponent(
      `Halo Pak Don, saya ${name} ingin booking konsultasi ${duration} menit.\nTopik: ${topic || "-"}\nID Booking: ${bookingId || "-"}`
    );
    const waLink = `https://wa.me/${waNumber}?text=${waText}`;

    return Response.json({ ok: true, bookingId, waLink });
  } catch (err) {
    console.error("[api/consultation] error:", err.message);
    return Response.json({ error: "Gagal menyimpan booking" }, { status: 500 });
  }
}
