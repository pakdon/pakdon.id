import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// File ini hanya berjalan di server, jadi process.env selalu tersedia penuh.
// clean() membuang tanda kutip/spasi yang tidak sengaja ikut ter-copy.
function clean(value) {
  if (!value) return undefined;
  return String(value).trim().replace(/^["']|["']$/g, "").trim() || undefined;
}

// PENTING: seluruh isi fungsi ini dibungkus try/catch dan TIDAK PERNAH melempar error.
// Halaman publik (mis. /konsultasi) di-render di server setiap kunjungan, jadi kalau
// inisialisasi di sini gagal — misal private key salah format — error-nya akan
// menjatuhkan seluruh halaman menjadi 500. Lebih baik kembalikan null, biarkan
// lib/content.js memakai data contoh, dan halaman tetap tampil.
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

function safeAuth(app) {
  if (!app) return null;
  try {
    return getAuth(app);
  } catch (err) {
    console.error("[firebaseAdmin] Gagal membuka Auth:", err.message);
    return null;
  }
}

const adminApp = getAdminApp();
export const adminDb = safeFirestore(adminApp);
export const adminAuth = safeAuth(adminApp);
