# PakDon.id — Website Personal Branding (Next.js)

Website personal branding premium untuk entrepreneur Indonesia. Dibangun dengan **Next.js 16 (App Router)**, **Firebase** (Auth + Firestore), **Midtrans** (pembayaran), dan **Anthropic Claude API** (chatbot AI).

## 1. Jalankan secara lokal

```bash
npm install
cp .env.local.example .env.local   # lalu isi semua kredensial (lihat bagian 2-4)
npm run dev
```

Buka http://localhost:3000. Tanpa env terisi sekalipun, website tetap tampil penuh (memakai data contoh di `lib/data.js`) — hanya fitur backend (login admin, chatbot AI, pembayaran) yang butuh kredensial asli.

## 2. Setup Firebase (Auth + Firestore + Admin CMS)

1. Buat project di https://console.firebase.google.com
2. Aktifkan **Authentication > Sign-in method > Email/Password**, lalu tambahkan 1 user (email+password) sebagai akun admin Anda di tab **Users**.
3. Aktifkan **Firestore Database** (mode production).
4. Buka **Project Settings > General > Your apps > Web app**, salin config ke variabel `NEXT_PUBLIC_FIREBASE_*` di `.env.local`.
5. Buka **Project Settings > Service accounts > Generate new private key**, unduh JSON, lalu isi:
   - `FIREBASE_ADMIN_PROJECT_ID` = `project_id`
   - `FIREBASE_ADMIN_CLIENT_EMAIL` = `client_email`
   - `FIREBASE_ADMIN_PRIVATE_KEY` = `private_key` (biarkan tanda `\n`, jangan diubah jadi baris baru asli)
6. Deploy `firestore.rules` yang sudah disediakan (lewat Firebase Console > Firestore > Rules, atau `firebase deploy --only firestore:rules` kalau pakai Firebase CLI).

Koleksi Firestore yang dipakai: `posts`, `products`, `courses`, `portfolio`, `testimonials`, `videos`, `bookings`, `subscribers`, `contacts`, `orders`.
Semua koleksi konten (posts, products, dst) akan **fallback ke data contoh** di `lib/data.js` selama masih kosong, jadi website tidak pernah tampil blank.

Login admin ada di **`/admin/login`**. Setelah login Anda bisa mengelola Artikel dan Produk Digital langsung (real-time, tersambung ke Firestore), serta melihat Booking Konsultasi dan Subscriber. Pola CRUD di `app/admin/blog/page.js` dan `app/admin/products/page.js` bisa dicontoh untuk menambah CRUD Kelas/Portfolio/Testimonial bila dibutuhkan.

## 3. Setup Pembayaran (Midtrans)

1. Daftar di https://dashboard.midtrans.com (mode Sandbox dulu untuk testing).
2. Ambil **Server Key** dan **Client Key** di **Settings > Access Keys**, isi ke `.env.local`.
3. Set `MIDTRANS_IS_PRODUCTION` dan `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION` ke `true` saat sudah siap live.
4. Daftarkan **Payment Notification URL** di Midtrans Dashboard: `https://domain-anda.com/api/webhook/midtrans` — ini yang otomatis mengubah status order jadi `paid` di Firestore.

Alur: tombol **Beli** di bagian Digital Product membuka modal data pembeli → `/api/checkout` membuat transaksi Midtrans Snap → popup pembayaran muncul di browser → setelah bayar, webhook mengonfirmasi status ke Firestore koleksi `orders`.

> Kelas Online & Konsultasi saat ini memakai alur booking/WhatsApp; hubungkan ke `/api/checkout` dengan pola yang sama seperti Produk Digital bila ingin pembayaran langsung di tempat.

## 4. Setup Chatbot AI ("Tanya Pak Don")

1. Ambil API key di https://console.anthropic.com/settings/keys
2. Isi `ANTHROPIC_API_KEY` di `.env.local`.
3. Tanpa API key, chatbot tetap jalan dengan jawaban berbasis kata kunci (fallback) — supaya demo tetap berfungsi. Begitu API key diisi, chatbot otomatis memakai Claude untuk menjawab dan merekomendasikan artikel/video/produk secara natural (lihat prompt sistem di `app/api/chat/route.js`).

## 5. Newsletter (opsional — Brevo)

Isi `BREVO_API_KEY` dan `BREVO_LIST_ID` bila ingin subscriber otomatis tersinkron ke Brevo. Tanpa ini, email tetap tersimpan ke Firestore koleksi `subscribers` dan bisa diekspor CSV dari halaman admin.

## 6. Konsultasi → WhatsApp & Google Calendar

Booking konsultasi tersimpan ke Firestore (`bookings`) lalu mengarahkan user ke link WhatsApp berisi detail booking (`NEXT_PUBLIC_WHATSAPP_NUMBER`). Untuk auto-create event Google Calendar, tambahkan integrasi **Google Calendar API** (service account + `calendar.events.insert`) di `app/api/consultation/route.js` — sudah diberi komentar penanda di file tersebut.

## 7. Deploy

Cara termudah: deploy ke **Vercel** (dibuat oleh tim yang sama dengan Next.js).

```bash
npm i -g vercel
vercel
```

Lalu masukkan semua variabel dari `.env.local` ke **Project Settings > Environment Variables** di Vercel Dashboard, dan arahkan domain `pakdon.id` ke project tersebut.

### 7a. GitHub — menyimpan & menghubungkan kode

```bash
cd pakdon-nextjs
git init
git add .
git commit -m "Initial commit: PakDon.id website"
git branch -M main
git remote add origin https://github.com/USERNAME/pakdon-id.git
git push -u origin main
```

Ganti `USERNAME/pakdon-id` dengan repo GitHub Anda (buat dulu repo kosong di https://github.com/new — jangan centang "Add README" supaya tidak konflik).

Workflow GitHub Actions sudah disediakan di `.github/workflows/`:
- **`ci.yml`** — otomatis menjalankan `npm run build` di setiap push/PR ke `main`, supaya error ketahuan sebelum deploy.
- **`firebase-rules.yml`** — otomatis deploy `firestore.rules` setiap ada perubahan file rules, dengan syarat 2 secret berikut sudah diisi di **Settings > Secrets and variables > Actions**:
  - `FIREBASE_TOKEN` — dapatkan dengan `npx firebase-tools login:ci` di komputer Anda (bukan di CI), lalu salin token yang muncul.
  - `FIREBASE_PROJECT_ID` — project ID Firebase Anda (sama dengan isi `.firebaserc`).

### 7b. Vercel — deploy otomatis dari GitHub

Cara paling praktis (tanpa perlu Vercel CLI/Action tambahan):
1. Buka https://vercel.com/new, pilih **Import Git Repository**, dan pilih repo GitHub yang barusan di-push.
2. Vercel otomatis mendeteksi framework Next.js — biarkan default build command (`next build`).
3. Di step **Environment Variables**, masukkan seluruh isi `.env.local` Anda (semua variabel `NEXT_PUBLIC_FIREBASE_*`, `FIREBASE_ADMIN_*`, `ANTHROPIC_API_KEY`, `MIDTRANS_*`, dll).
4. Klik **Deploy**. Setiap push ke branch `main` setelah ini akan otomatis men-deploy ulang (Vercel sudah terhubung langsung ke GitHub, tidak perlu GitHub Action khusus untuk ini).
5. Tambahkan domain custom `pakdon.id` di **Project Settings > Domains**, lalu arahkan DNS domain Anda (biasanya A record ke `76.76.21.21` atau CNAME ke `cname.vercel-dns.com`, ikuti instruksi persis yang muncul di dashboard Vercel).

### 7c. Firebase CLI — untuk deploy Firestore rules manual (opsional, di luar GitHub Actions)

```bash
npm i -g firebase-tools
firebase login
# Buka .firebaserc, ganti "GANTI-DENGAN-PROJECT-ID-FIREBASE-ANDA" dengan project ID asli Anda
firebase deploy --only firestore:rules,firestore:indexes
```

Atau jalankan Firestore Emulator untuk testing lokal tanpa menyentuh data production:
```bash
npm run firebase:emulators
```

## 8. Struktur folder penting

```
app/
  page.js               → merakit semua section homepage
  layout.js              → SEO metadata, schema.org Person, font, dark mode init
  blog/[slug]/page.js    → halaman artikel dinamis + metadata SEO per artikel
  sitemap.js robots.js   → SEO otomatis
  api/                   → chat, newsletter, contact, consultation, checkout, webhook midtrans
  admin/                 → login, dashboard, CRUD artikel/produk, booking, subscriber
components/               → semua section (Hero, About, Blog, Products, dst)
lib/
  firebase.js             → Firebase client SDK
  firebaseAdmin.js         → Firebase Admin SDK (server-only)
  data.js                  → data contoh/fallback
  content.js                → fetch Firestore + fallback ke data.js
firebase.json firestore.rules firestore.indexes.json .firebaserc → konfigurasi Firebase CLI
vercel.json                → konfigurasi Vercel (security headers, build command)
.github/workflows/         → CI build check + auto-deploy Firestore rules
```

## 9. Catatan keamanan

- Jangan commit `.env.local` ke git (sudah otomatis di-ignore lewat `.gitignore` bawaan Next.js).
- `firestore.rules` membatasi tulis ke Firestore hanya untuk user yang login — pastikan sudah di-deploy sebelum go-live.
- Endpoint `/api/webhook/midtrans` memverifikasi `signature_key` dari Midtrans sebelum mengubah status order — jangan hapus pengecekan ini.
