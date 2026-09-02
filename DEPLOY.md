# Panduan Deploy PakDon.id

## Sebelum deploy — cek konfigurasi

```bash
npm run check-env
```

Skrip ini memeriksa `.env.local` dan menangkap kesalahan umum, terutama **tanda kutip yang tidak seharusnya ada**.

### Aturan tanda kutip di file .env

| Variabel | Pakai kutip? | Contoh benar |
|---|---|---|
| Semua `NEXT_PUBLIC_FIREBASE_*` | ❌ TIDAK | `NEXT_PUBLIC_FIREBASE_PROJECT_ID=pak-don` |
| `FIREBASE_ADMIN_PROJECT_ID` / `_CLIENT_EMAIL` | ❌ TIDAK | `FIREBASE_ADMIN_PROJECT_ID=pak-don` |
| `ANTHROPIC_API_KEY`, `MIDTRANS_*` | ❌ TIDAK | `MIDTRANS_SERVER_KEY=SB-Mid-server-xxx` |
| `FIREBASE_ADMIN_PRIVATE_KEY` | ✅ YA | `FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"` |

> Kesalahan paling sering: menulis `PROJECT_ID="pak-don"` (pakai kutip). Firestore akan mencari project bernama `"pak-don"` beserta tanda kutipnya, lalu gagal dengan pesan menyesatkan **"client is offline"**.

---

## Langkah deploy

### 1. Test lokal dulu

```bash
npm install
npm run check-env
npm run dev
```

Buka http://localhost:3000 dan pastikan:
- Homepage tampil normal
- `/ebook`, `/kelas`, `/konsultasi` bisa dibuka
- Login `/admin/login` berhasil
- `/admin/consultation` — coba **Simpan Perubahan**, harus muncul "Tersimpan [jam]"

Kalau semua lolos, hentikan server (`Ctrl+C`) dan lanjut.

### 2. Deploy Firestore rules

```bash
firebase deploy --only firestore:rules
```

Pastikan `.firebaserc` sudah berisi project ID asli (bukan placeholder). Verifikasi di Firebase Console → Firestore → Rules bahwa baris berikut ada:

```
match /settings/{id}   { allow read: if true; allow write: if request.auth != null; }
```

### 3. Push ke GitHub

```bash
git add .
git commit -m "Update website PakDon.id"
git push
```

### 4. Vercel

Kalau repo sudah terhubung ke Vercel, push di atas **otomatis memicu deploy**. Tidak perlu langkah tambahan.

Kalau belum terhubung: buka https://vercel.com/new → Import repo → isi Environment Variables → Deploy.

### 5. PENTING — cek Environment Variables di Vercel

Kesalahan tanda kutip yang sama juga sering terjadi di Vercel. Buka:

**Vercel → Project → Settings → Environment Variables**

Cek satu per satu. Di Vercel, isi nilainya **polos tanpa tanda kutip** (kecuali `FIREBASE_ADMIN_PRIVATE_KEY`). Vercel tidak butuh kutip karena setiap nilai sudah punya field sendiri.

Setelah memperbaiki env var, wajib **Redeploy**: tab Deployments → klik ⋯ pada deployment teratas → **Redeploy**.

### 6. Verifikasi setelah live

Buka domain produksi Anda dan ulangi checklist di langkah 1. Perhatikan khususnya `/admin/consultation` — kalau tombol simpan timeout di produksi padahal lokal berhasil, hampir pasti env var di Vercel yang bermasalah (biasanya tanda kutip).

### 7. Authorized domains Firebase

Firebase Auth menolak login dari domain yang belum terdaftar. Buka:

**Firebase Console → Authentication → Settings → Authorized domains**

Pastikan domain Vercel Anda (`xxx.vercel.app`) dan domain custom (`pakdon.id`) ada di daftar. Kalau belum, klik **Add domain**.

---

## Troubleshooting cepat

| Gejala | Penyebab paling sering |
|---|---|
| "client is offline" / simpan timeout | Tanda kutip di `NEXT_PUBLIC_FIREBASE_PROJECT_ID` |
| Login admin gagal terus | Domain belum ada di Authorized domains, atau user belum dibuat di Authentication → Users |
| `permission-denied` | `firestore.rules` belum di-deploy |
| Harga konsultasi tidak berubah di halaman publik | Rules `settings` belum ada, atau belum Redeploy setelah ubah env |
| Perubahan `.env.local` tidak berefek | Belum restart `npm run dev` |
