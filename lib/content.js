import { adminDb } from "./firebaseAdmin";
import * as fallback from "./data";

async function getCollection(name, fallbackData) {
  try {
    if (!adminDb) return fallbackData;
    const snap = await adminDb.collection(name).orderBy("createdAt", "desc").get();
    if (snap.empty) return fallbackData;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn(`[content] Gagal mengambil koleksi "${name}", memakai data contoh.`, err.message);
    return fallbackData;
  }
}

export const getBlogPosts = () => getCollection("posts", fallback.BLOG_POSTS);
export const getDigitalProducts = () => getCollection("products", fallback.DIGITAL_PRODUCTS);
export const getCourses = () => getCollection("courses", fallback.COURSES);
export const getPortfolio = () => getCollection("portfolio", fallback.PORTFOLIO);
export const getTestimonials = () => getCollection("testimonials", fallback.TESTIMONIALS);
export const getVideos = () => getCollection("videos", fallback.VIDEOS);

// Harga sesi konsultasi disimpan sebagai 1 dokumen tunggal (bukan koleksi),
// karena jumlah opsinya tetap (30/60/120 menit) dan hanya harga/deskripsinya yang berubah-ubah.
export async function getConsultationDurations() {
  try {
    if (!adminDb) return fallback.DURATIONS;
    const snap = await adminDb.collection("settings").doc("consultation").get();
    if (!snap.exists) return fallback.DURATIONS;
    const data = snap.data();
    return Array.isArray(data.durations) && data.durations.length ? data.durations : fallback.DURATIONS;
  } catch (err) {
    console.warn("[content] Gagal mengambil harga konsultasi, memakai data contoh.", err.message);
    return fallback.DURATIONS;
  }
}
