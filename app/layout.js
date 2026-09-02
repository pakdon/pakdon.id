import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pakdon.id";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PakDon.id — Bangun Bisnis yang Menghasilkan, Bukan Sekadar Ramai",
    template: "%s | PakDon.id",
  },
  description:
    "PakDon.id adalah personal brand entrepreneur Indonesia yang membahas bisnis, UMKM, retail, e-commerce, teknologi, AI, produktivitas, dan financial freedom.",
  keywords: ["bisnis", "UMKM", "AI untuk bisnis", "retail", "e-commerce", "financial freedom", "konsultasi bisnis", "PakDon"],
  authors: [{ name: "Pak Don" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "PakDon.id",
    title: "PakDon.id — Bangun Bisnis yang Menghasilkan, Bukan Sekadar Ramai",
    description: "Insight bisnis, UMKM, retail, e-commerce, teknologi, AI, produktivitas, dan financial freedom dari Pak Don.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "PakDon.id" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PakDon.id — Bangun Bisnis yang Menghasilkan, Bukan Sekadar Ramai",
    description: "Insight bisnis, UMKM, retail, e-commerce, teknologi, AI, produktivitas, dan financial freedom.",
    images: ["/og-image.jpg"],
  },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pak Don",
  url: SITE_URL,
  jobTitle: "Entrepreneur & Business Mentor",
  description: "Entrepreneur Indonesia yang membangun bisnis retail, e-commerce, dan mengedukasi UMKM seputar AI, sistem bisnis, dan financial freedom.",
  sameAs: [
    "https://instagram.com/pakdon.id",
    "https://youtube.com/@pakdon.id",
    "https://linkedin.com/in/pakdon",
    "https://tiktok.com/@pakdon.id",
  ],
  worksFor: { "@type": "Organization", name: "PakDon.id" },
};

const themeInitScript = `
try {
  const saved = localStorage.getItem('pd-theme');
  const theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (theme === 'dark') document.documentElement.classList.add('dark');
} catch (e) {}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
