import { getBlogPosts } from "@/lib/content";

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://pakdon.id";
  const posts = await getBlogPosts();

  const staticRoutes = ["", "/#about", "/#portfolio", "/#blog", "/#video", "/ebook", "/kelas", "/konsultasi"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const postRoutes = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
