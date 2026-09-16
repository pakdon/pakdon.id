import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// File ini hanya berjalan di server, jadi process.env selalu tersedia penuh.
// clean() membuang tanda kutip/spasi yang tidak sengaja ikut ter-copy.
function clean(value) {
  if (!value) return undefined;
  return String(value).trim().replace(/^["']|["']$/g, "").trim() || undefined;
}

function getAdminApp() {
  if (getApps().length) return getApps()[0];

  const projectId = clean(process.env.FIREBASE_ADMIN_PROJECT_ID);
  const clientEmail = clean(process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
  // Private key: kutip pembungkus dibuang, lalu \n literal diubah jadi baris baru asli.
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
