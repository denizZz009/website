import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import DesignFeatures from "@/components/home/DesignFeatures";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <DesignFeatures />
      <Testimonials />
    </div>
  );
}
