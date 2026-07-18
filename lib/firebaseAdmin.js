// Firebase ADMIN SDK — HANYA dipakai di server (API routes / Server Components).
// Menggunakan service account, punya akses penuh, jangan pernah di-import di komponen client.
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function getAdminApp() {
  if (getApps().length) return getApps()[0];

  const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n");

  if (!process.env.FIREBASE_ADMIN_PROJECT_ID || !privateKey) {
    // Biarkan build/dev tetap jalan walau env belum diisi (misal saat preview UI tanpa Firebase).
    console.warn("[firebaseAdmin] Env Firebase Admin belum lengkap — fitur server-side Firestore/Auth tidak akan berfungsi sampai .env.local diisi.");
    return null;
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

const adminApp = getAdminApp();

export const adminDb = adminApp ? getFirestore(adminApp) : null;
export const adminAuth = adminApp ? getAuth(adminApp) : null;
