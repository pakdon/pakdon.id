export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://pakdon.id";
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
