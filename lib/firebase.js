// Firebase CLIENT SDK — dipakai di komponen "use client" (browser).
// Jangan taruh Admin/service-account key di file ini.
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Hindari re-init saat hot reload / render ulang
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Inisialisasi dibungkus try/catch supaya build/preview TIDAK crash saat
// .env.local belum diisi (misal saat pertama kali clone project ini).
// Setelah env Firebase diisi dengan benar, db & auth akan berfungsi normal.
let db = null;
let auth = null;
try {
  db = getFirestore(app);
} catch (e) {
  console.warn("[firebase] Gagal inisialisasi Firestore (client) — cek NEXT_PUBLIC_FIREBASE_* di .env.local.", e.message);
}
try {
  auth = getAuth(app);
} catch (e) {
  console.warn("[firebase] Gagal inisialisasi Auth (client) — cek NEXT_PUBLIC_FIREBASE_* di .env.local.", e.message);
}

export { db, auth };
export default app;
