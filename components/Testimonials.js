import { getTestimonials } from "@/lib/content";
import TestimonialCarousel from "./TestimonialCarousel";
import Reveal from "./Reveal";

export default async function Testimonials() {
  const items = await getTestimonials();
  return (
    <section className="pd-section">
      <div className="pd-container">
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 46px" }}>
            <span className="pd-eyebrow">Testimonial</span>
            <h2 className="pd-h2">Apa Kata Mereka</h2>
          </div>
        </Reveal>
        <TestimonialCarousel items={items} />
      </div>
    </section>
  );
}
