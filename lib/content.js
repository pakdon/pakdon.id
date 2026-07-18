// Helper server-side untuk membaca koleksi Firestore, dengan fallback ke data contoh
// (lib/data.js) selama koleksi belum diisi lewat Admin CMS. Dipanggil dari Server Components.
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
