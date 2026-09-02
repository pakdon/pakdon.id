// Cek konfigurasi .env.local sebelum deploy.
// Jalankan: node scripts-check-env.mjs
import { readFileSync, existsSync } from "fs";

const FILE = ".env.local";

const WAJIB_TANPA_KUTIP = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "FIREBASE_ADMIN_PROJECT_ID",
  "FIREBASE_ADMIN_CLIENT_EMAIL",
];

// Variabel ini JUSTRU harus pakai tanda kutip (isinya multi-baris)
const HARUS_PAKAI_KUTIP = ["FIREBASE_ADMIN_PRIVATE_KEY"];

const OPSIONAL = [
  "ANTHROPIC_API_KEY",
  "MIDTRANS_SERVER_KEY",
  "NEXT_PUBLIC_MIDTRANS_CLIENT_KEY",
  "NEXT_PUBLIC_WHATSAPP_NUMBER",
];

if (!existsSync(FILE)) {
  console.error(`\n❌ File ${FILE} tidak ditemukan.`);
  console.error(`   Jalankan dulu: cp .env.local.example .env.local  (lalu isi kredensialnya)\n`);
  process.exit(1);
}

const isi = readFileSync(FILE, "utf8");
const baris = isi.split("\n");
const nilai = {};

for (const b of baris) {
  const trimmed = b.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const idx = trimmed.indexOf("=");
  if (idx === -1) continue;
  nilai[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
}

let masalah = 0;
let peringatan = 0;

console.log(`\n🔍 Memeriksa ${FILE}...\n`);

for (const key of WAJIB_TANPA_KUTIP) {
  const v = nilai[key];
  if (v === undefined || v === "") {
    console.log(`❌ ${key} — belum diisi`);
    masalah++;
  } else if (/^["'].*["']$/.test(v)) {
    console.log(`❌ ${key} — JANGAN pakai tanda kutip. Ubah jadi: ${key}=${v.slice(1, -1)}`);
    masalah++;
  } else {
    console.log(`✅ ${key}`);
  }
}

for (const key of HARUS_PAKAI_KUTIP) {
  const v = nilai[key];
  if (v === undefined || v === "" || v === '""') {
    console.log(`❌ ${key} — belum diisi (ambil dari file JSON service account Firebase)`);
    masalah++;
  } else if (!/^["']/.test(v)) {
    console.log(`❌ ${key} — HARUS diapit tanda kutip karena isinya multi-baris`);
    masalah++;
  } else if (!v.includes("\\n")) {
    console.log(`⚠️  ${key} — sepertinya baris barunya belum diubah jadi \\n, cek lagi`);
    peringatan++;
  } else {
    console.log(`✅ ${key}`);
  }
}

console.log("");
for (const key of OPSIONAL) {
  const v = nilai[key];
  if (!v) {
    console.log(`⚪ ${key} — kosong (opsional, fitur terkait akan pakai fallback)`);
  } else if (/^["'].*["']$/.test(v)) {
    console.log(`❌ ${key} — jangan pakai tanda kutip`);
    masalah++;
  } else {
    console.log(`✅ ${key}`);
  }
}

console.log("\n" + "─".repeat(60));
if (masalah > 0) {
  console.log(`\n❌ Ada ${masalah} masalah yang harus diperbaiki sebelum deploy.\n`);
  process.exit(1);
} else {
  console.log(`\n✅ Konfigurasi terlihat baik${peringatan ? ` (${peringatan} peringatan)` : ""}. Siap deploy.\n`);
}
