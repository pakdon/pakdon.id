import { adminDb } from "@/lib/firebaseAdmin";
import { getConsultationDurations } from "@/lib/content";

// Booking di sini menyimpan permintaan ke Firestore koleksi "bookings".
// Detail paket (nama, durasi, harga) diambil dari getConsultationDurations() (Firestore
// settings/consultation, diatur lewat Admin > Harga Konsultasi) berdasarkan packageId yang dipilih,
// supaya data yang dicatat selalu konsisten dengan yang tampil di halaman publik.
// Untuk auto-create event di Google Calendar, hubungkan Google Calendar API
// (OAuth service account + calendar.events.insert) di sini setelah dokumen tersimpan.
export async function POST(req) {
  const body = await req.json();
  const { name, whatsapp, topic, packageId } = body || {};

  if (!name || !whatsapp || !packageId) {
    return Response.json({ error: "Nama, WhatsApp, dan paket konsultasi wajib diisi" }, { status: 400 });
  }

  try {
    const packages = await getConsultationDurations();
    const pkg = packages.find((p) => p.id === packageId);
    if (!pkg) return Response.json({ error: "Paket konsultasi tidak ditemukan" }, { status: 404 });

    let bookingId = null;
    if (adminDb) {
      const ref = await adminDb.collection("bookings").add({
        name, whatsapp, topic: topic || "",
        packageId: pkg.id, packageName: pkg.name, duration: pkg.minutes, price: pkg.price,
        status: "pending_payment",
        createdAt: new Date().toISOString(),
      });
      bookingId = ref.id;
    }

    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281200000000";
    const waText = encodeURIComponent(
      `Halo Pak Don, saya ${name} ingin booking ${pkg.name} (${pkg.minutes} menit).\nTopik: ${topic || "-"}\nID Booking: ${bookingId || "-"}`
    );
    const waLink = `https://wa.me/${waNumber}?text=${waText}`;

    return Response.json({ ok: true, bookingId, waLink });
  } catch (err) {
    console.error("[api/consultation] error:", err.message);
    return Response.json({ error: "Gagal menyimpan booking" }, { status: 500 });
  }
}
