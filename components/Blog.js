import { getBlogPosts } from "@/lib/content";
import { BLOG_CATEGORIES } from "@/lib/data";
import BlogList from "./BlogList";
import Reveal from "./Reveal";

export default async function Blog() {
  const posts = await getBlogPosts();
  return (
    <section id="blog" className="pd-section alt">
      <div className="pd-container">
        <Reveal>
          <div style={{ maxWidth: 640, marginBottom: 10 }}>
            <span className="pd-eyebrow">Blog</span>
            <h2 className="pd-h2">Insight Bisnis Terbaru</h2>
          </div>
        </Reveal>
        <BlogList posts={posts} categories={BLOG_CATEGORIES} />
      </div>
    </section>
  );
}
