import Anthropic from "@anthropic-ai/sdk";
import { BLOG_POSTS, VIDEOS, DIGITAL_PRODUCTS, COURSES } from "@/lib/data";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `Kamu adalah "Tanya Pak Don", asisten AI resmi di website PakDon.id milik seorang entrepreneur Indonesia yang membahas bisnis, UMKM, retail, e-commerce, teknologi, AI, produktivitas, dan financial freedom.

Tugasmu:
- Menjawab pertanyaan seputar bisnis, UMKM, retail, AI, dan financial freedom secara ringkas, praktis, dan ramah dalam Bahasa Indonesia.
- Merekomendasikan artikel, video, atau produk digital yang relevan dari daftar konten di bawah bila cocok dengan pertanyaan pengguna.
- Mengarahkan ke halaman Konsultasi jika pertanyaan butuh pembahasan mendalam dan personal.
- Jawaban maksimal 3-4 kalimat, jangan bertele-tele.
- Jika ditanya di luar topik bisnis/UMKM/AI/retail/financial freedom, jawab singkat lalu arahkan kembali ke topik website.

Daftar artikel: ${BLOG_POSTS.map((p) => p.title).join(", ")}
Daftar video: ${VIDEOS.map((v) => v.title).join(", ")}
Daftar produk digital: ${DIGITAL_PRODUCTS.map((p) => p.title).join(", ")}
Daftar kelas online: ${COURSES.map((c) => c.title).join(", ")}`;

// Fallback jawaban berbasis kata kunci — dipakai bila ANTHROPIC_API_KEY belum diisi,
// supaya chatbot tetap merespons saat demo tanpa API key.
function keywordFallback(text) {
  const q = text.toLowerCase();
  if (q.includes("ai")) return "Untuk topik AI, coba baca artikel \"3 Cara UMKM Mulai Pakai AI Tanpa Tim IT\" atau tonton video \"Setup AI Customer Service dalam 20 Menit\".";
  if (q.includes("konsultasi") || q.includes("booking")) return "Anda bisa langsung booking di bagian Konsultasi — tersedia sesi 30, 60, atau 120 menit.";
  if (q.includes("produk") || q.includes("ebook") || q.includes("template")) return "Lihat koleksi Digital Product kami — ada SOP, dashboard, template, dan prompt AI siap pakai.";
  if (q.includes("kelas") || q.includes("course")) return "Kami punya 5 kelas online, mulai dari AI untuk UMKM hingga Financial Freedom Blueprint.";
  return "Terima kasih sudah bertanya. Untuk pembahasan lebih mendalam, saya sarankan booking sesi konsultasi dengan Pak Don ya.";
}

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ reply: keywordFallback(lastUserMessage), mode: "fallback" });
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content })),
    });

    const reply = response.content.find((b) => b.type === "text")?.text || "Maaf, saya belum bisa menjawab itu.";
    return Response.json({ reply, mode: "ai" });
  } catch (err) {
    console.error("[api/chat] error:", err.message);
    return Response.json({ reply: "Maaf, asisten AI sedang mengalami kendala. Coba beberapa saat lagi." }, { status: 200 });
  }
}
