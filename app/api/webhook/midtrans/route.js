import crypto from "crypto";
import { adminDb } from "@/lib/firebaseAdmin";

// Endpoint ini didaftarkan di Midtrans Dashboard > Settings > Configuration > Payment Notification URL
// Contoh: https://pakdon.id/api/webhook/midtrans
export async function POST(req) {
  try {
    const body = await req.json();
    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = body;

    const expectedSignature = crypto
      .createHash("sha512")
      .update(order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY)
      .digest("hex");

    if (signature_key !== expectedSignature) {
      return Response.json({ error: "Signature tidak valid" }, { status: 403 });
    }

    let newStatus = "pending";
    if (transaction_status === "capture" && fraud_status === "accept") newStatus = "paid";
    else if (transaction_status === "settlement") newStatus = "paid";
    else if (["cancel", "deny", "expire"].includes(transaction_status)) newStatus = "failed";
    else if (transaction_status === "pending") newStatus = "pending";

    if (adminDb) {
      await adminDb.collection("orders").doc(order_id).set(
        { status: newStatus, transactionStatus: transaction_status, updatedAt: new Date().toISOString() },
        { merge: true }
      );
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[webhook/midtrans] error:", err.message);
    return Response.json({ error: "Gagal memproses notifikasi" }, { status: 500 });
  }
}
