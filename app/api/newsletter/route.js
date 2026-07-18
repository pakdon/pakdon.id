import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req) {
  const { email } = await req.json();
  if (!email || !email.includes("@")) {
    return Response.json({ error: "Email tidak valid" }, { status: 400 });
  }

  try {
    if (adminDb) {
      await adminDb.collection("subscribers").doc(email.toLowerCase()).set({
        email: email.toLowerCase(),
        createdAt: new Date().toISOString(),
        source: "website-footer",
      }, { merge: true });
    }

    // Opsional: sinkronkan ke Brevo (Sendinblue) bila BREVO_API_KEY diisi.
    if (process.env.BREVO_API_KEY && process.env.BREVO_LIST_ID) {
      await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json", "api-key": process.env.BREVO_API_KEY },
        body: JSON.stringify({ email, listIds: [Number(process.env.BREVO_LIST_ID)], updateEnabled: true }),
      }).catch((e) => console.warn("[newsletter] Brevo sync gagal:", e.message));
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[api/newsletter] error:", err.message);
    return Response.json({ error: "Gagal menyimpan email" }, { status: 500 });
  }
}
