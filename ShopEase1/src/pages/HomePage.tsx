import Hero from "../components/home/Hero";
import FeaturesStrip from "../components/home/FeaturesStrip";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Newsletter from "../components/home/Newsletter.";

function HomePage() {
  return (
    <div className="space-y-16">
      <Hero />
      <FeaturesStrip />
      <FeaturedProducts />
      <Newsletter />
    </div>
  );
}

export default HomePage;
