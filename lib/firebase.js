import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// PENTING: setiap variabel NEXT_PUBLIC_* HARUS ditulis statis seperti di bawah
// (process.env.NAMA_VARIABEL secara harfiah). Next.js menyisipkan nilainya ke bundle
// browser lewat analisis statis saat build — akses dinamis seperti process.env[key]
// TIDAK akan tergantikan, sehingga nilainya undefined di browser meski build sukses
// dan tidak ada error sama sekali di log build.
//
// clean() hanya membuang tanda kutip/spasi yang tidak sengaja ikut ter-copy saat
// mengisi .env.local atau Environment Variables di Vercel. Contoh kasus nyata:
// PROJECT_ID="pak-don" membuat Firestore mencari project bernama "pak-don" beserta
// kutipnya, lalu gagal dengan pesan menyesatkan "client is offline".
function clean(value) {
  if (!value) return undefined;
  return String(value).trim().replace(/^["']|["']$/g, "").trim() || undefined;
}

const firebaseConfig = {
  apiKey: clean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: clean(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: clean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: clean(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: clean(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: clean(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
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
