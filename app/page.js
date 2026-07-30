import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Blog from "@/components/Blog";
import Video from "@/components/Video";
import OfferingsTeaser from "@/components/OfferingsTeaser";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Contact from "@/components/Contact";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Blog />
      <Video />
      <OfferingsTeaser />
      <Testimonials />
      <Newsletter />
      <Contact />
    </main>
  );
}
