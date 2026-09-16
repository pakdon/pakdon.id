import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// CATATAN PENTING — jangan impor "firebase-admin/auth" di file ini.
// Modul itu menarik dependensi jwks-rsa -> jose yang berformat ESM, sehingga gagal
// dimuat di runtime Vercel dengan error ERR_REQUIRE_ESM dan menjatuhkan halaman
// menjadi 500. Kita memang tidak membutuhkannya: login admin diverifikasi oleh
// Firebase client SDK di browser (lib/firebase.js), bukan oleh Admin SDK.
// Admin SDK di sini hanya dipakai untuk membaca/menulis Firestore dari server.

// clean() membuang tanda kutip/spasi yang tidak sengaja ikut ter-copy.
function clean(value) {
  if (!value) return undefined;
  return String(value).trim().replace(/^["']|["']$/g, "").trim() || undefined;
}

// Seluruh isi fungsi ini dibungkus try/catch dan TIDAK PERNAH melempar error.
// Halaman publik di-render di server setiap kunjungan, jadi kegagalan di sini
// tidak boleh menjatuhkan halaman — cukup kembalikan null dan pakai data contoh.
function getAdminApp() {
  try {
    if (getApps().length) return getApps()[0];

    const projectId = clean(process.env.FIREBASE_ADMIN_PROJECT_ID);
    const clientEmail = clean(process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
    // Private key: kutip pembungkus dibuang, lalu \n literal diubah jadi baris baru asli.
    const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "")
      .trim()
      .replace(/^["']|["']$/g, "")
      .replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      console.warn("[firebaseAdmin] Env Firebase Admin belum lengkap — memakai data contoh.");
      return null;
    }

    return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  } catch (err) {
    console.error("[firebaseAdmin] Gagal inisialisasi Admin SDK, memakai data contoh:", err.message);
    return null;
  }
}

function safeFirestore(app) {
  if (!app) return null;
  try {
    return getFirestore(app);
  } catch (err) {
    console.error("[firebaseAdmin] Gagal membuka Firestore:", err.message);
    return null;
  }
}

const adminApp = getAdminApp();
export const adminDb = safeFirestore(adminApp);
