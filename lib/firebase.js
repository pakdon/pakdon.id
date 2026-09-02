import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let db = null;
let auth = null;
try {
  // experimentalAutoDetectLongPolling: sebagian jaringan/ISP (termasuk beberapa di Indonesia)
  // memblokir koneksi WebChannel default Firestore sehingga request read/write hang tanpa
  // pernah error. Opsi ini otomatis beralih ke long-polling kalau koneksi standar gagal.
  db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
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
