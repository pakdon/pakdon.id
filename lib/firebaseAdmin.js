import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Sama seperti di lib/firebase.js: bersihkan tanda kutip yang tidak sengaja ikut,
// supaya salah format di .env.local atau Vercel tidak membuat koneksi gagal diam-diam.
function env(key) {
  const raw = process.env[key];
  if (!raw) return undefined;
  return String(raw).trim().replace(/^["']|["']$/g, "").trim() || undefined;
}

function getAdminApp() {
  if (getApps().length) return getApps()[0];

  const projectId = env("FIREBASE_ADMIN_PROJECT_ID");
  const clientEmail = env("FIREBASE_ADMIN_CLIENT_EMAIL");
  // Private key: kutip pembungkusnya dibuang, lalu \n literal diubah jadi baris baru asli.
  const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("[firebaseAdmin] Env Firebase Admin belum lengkap — fitur server-side Firestore/Auth tidak akan berfungsi sampai diisi.");
    return null;
  }

  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

const adminApp = getAdminApp();
export const adminDb = adminApp ? getFirestore(adminApp) : null;
export const adminAuth = adminApp ? getAuth(adminApp) : null;
