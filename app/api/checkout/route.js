import { getSnap } from "@/lib/midtrans";
import { adminDb } from "@/lib/firebaseAdmin";
import { DIGITAL_PRODUCTS, COURSES } from "@/lib/data";
import { getConsultationDurations } from "@/lib/content";

// Menerima: { type: "product" | "course" | "consultation", itemId, buyer: { name, email, phone } }
// Mengembalikan Midtrans Snap token untuk dibuka lewat window.snap.pay(token) di client.
export async function POST(req) {
  if (!process.env.MIDTRANS_SERVER_KEY) {
    return Response.json(
      { error: "MIDTRANS_SERVER_KEY belum diisi di .env.local — lihat README untuk cara mendapatkan kredensial Midtrans." },
      { status: 500 }
    );
  }

  try {
    const { type, itemId, buyer } = await req.json();
    if (!buyer?.name || !buyer?.email) {
      return Response.json({ error: "Nama dan email pembeli wajib diisi" }, { status: 400 });
    }

    let item;
    if (type === "product") item = DIGITAL_PRODUCTS.find((p) => p.id === itemId);
    else if (type === "course") item = COURSES.find((c) => c.id === itemId);
    else if (type === "consultation") {
      const durations = await getConsultationDurations();
      item = durations.find((d) => d.id === itemId);
    }
    if (!item) return Response.json({ error: "Item tidak ditemukan" }, { status: 404 });

    const price = item.price;
    const name = item.title || item.name || `Konsultasi ${item.minutes} Menit`;
    const orderId = `${type}-${itemId}-${Date.now()}`;

    const snap = getSnap();
    const transaction = await snap.createTransaction({
      transaction_details: { order_id: orderId, gross_amount: price },
      customer_details: { first_name: buyer.name, email: buyer.email, phone: buyer.phone || "" },
      item_details: [{ id: itemId, price, quantity: 1, name }],
    });

    if (adminDb) {
      await adminDb.collection("orders").doc(orderId).set({
        orderId, type, itemId, name, price, buyer,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
    }

    return Response.json({ token: transaction.token, redirectUrl: transaction.redirect_url, orderId });
  } catch (err) {
    console.error("[api/checkout] error:", err.message);
    return Response.json({ error: "Gagal membuat transaksi pembayaran" }, { status: 500 });
  }
}
