import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req) {
  const body = await req.json();
  const { name, email, subject, message } = body || {};
  if (!name || !email || !message) return Response.json({ error: "Nama, email, dan pesan wajib diisi" }, { status: 400 });
  try {
    if (adminDb) {
      await adminDb.collection("contacts").add({ name, email, subject: subject || "", message, status: "new", createdAt: new Date().toISOString() });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[api/contact] error:", err.message);
    return Response.json({ error: "Gagal mengirim pesan" }, { status: 500 });
  }
}
