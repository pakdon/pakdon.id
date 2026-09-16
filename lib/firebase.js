import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Membersihkan nilai env dari tanda kutip yang tidak sengaja ikut ter-copy.
// Contoh kasus nyata: NEXT_PUBLIC_FIREBASE_PROJECT_ID="pak-don" membuat Firestore
// mencari project bernama "pak-don" (beserta kutipnya) lalu gagal dengan pesan
// menyesatkan "client is offline". Ini juga sering terjadi saat mengisi
// Environment Variables di Vercel.
function env(key) {
  const raw = process.env[key];
  if (!raw) return undefined;
  return String(raw).trim().replace(/^["']|["']$/g, "").trim() || undefined;
}

const firebaseConfig = {
  apiKey: env("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: env("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: env("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: env("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: env("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: env("NEXT_PUBLIC_FIREBASE_APP_ID"),
};

// Dipakai halaman admin untuk menampilkan diagnosa kalau koneksi bermasalah.
export const firebaseDiagnostics = {
  projectId: firebaseConfig.projectId || "(kosong)",
  authDomain: firebaseConfig.authDomain || "(kosong)",
  apiKeyPresent: Boolean(firebaseConfig.apiKey),
  missing: Object.entries(firebaseConfig).filter(([, v]) => !v).map(([k]) => k),
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let db = null;
let auth = null;
try {
  // experimentalAutoDetectLongPolling: sebagian jaringan/ISP memblokir koneksi
  // WebChannel default Firestore sehingga request hang tanpa pernah error.
  // Opsi ini otomatis beralih ke long-polling kalau koneksi standar gagal.
  db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
} catch (e) {
  console.warn("[firebase] Gagal inisialisasi Firestore (client).", e.message);
}
try {
  auth = getAuth(app);
} catch (e) {
  console.warn("[firebase] Gagal inisialisasi Auth (client).", e.message);
}

export { db, auth };
export default app;
