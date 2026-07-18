import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, ArrowLeft } from "lucide-react";
import { getBlogPosts } from "@/lib/content";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: "Pak Don" },
  };

  return (
    <main className="pd-section" style={{ paddingTop: 168 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <div className="pd-container" style={{ maxWidth: 760 }}>
        <Link href="/#blog" className="pd-btn-secondary" style={{ display: "inline-flex", marginBottom: 30, padding: "10px 18px", fontSize: 13 }}>
          <ArrowLeft size={14} /> Kembali ke Blog
        </Link>
        <span className="pd-tag">{post.cat}</span>
        <h1 className="pd-h1" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", marginTop: 16 }}>{post.title}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, fontSize: 13, color: "var(--text-secondary)" }}>
          <Clock size={14} /> {post.read} baca &middot; oleh Pak Don
        </div>
        <p className="pd-sub" style={{ marginTop: 30, fontSize: 17 }}>{post.excerpt}</p>
        <div className="pd-sub" style={{ marginTop: 20, whiteSpace: "pre-line" }}>{post.content}</div>
      </div>
    </main>
  );
}
