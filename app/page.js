import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Blog from "@/components/Blog";
import Video from "@/components/Video";
import Products from "@/components/Products";
import Courses from "@/components/Courses";
import Consultation from "@/components/Consultation";
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
      <Products />
      <Courses />
      <Consultation />
      <Testimonials />
      <Newsletter />
      <Contact />
    </main>
  );
}
