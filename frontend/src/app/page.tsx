import Hero from "../components/Hero";
import AtelierEdit from "../components/AtelierEdit";
import BrandShowcase from "../components/BrandShowcase";
import ProductGrid from "../components/ProductGrid";
import Testimonials from "../components/Testimonials";
import LookingFor from "../components/LookingFor";
import TrustFeatures from "../components/TrustFeatures";

export default function Home() {
  return (
    <>
      <Hero />
      <LookingFor />
      {/* <AtelierEdit /> */}
      {/* <BrandShowcase /> */}
      <ProductGrid />
      <TrustFeatures />
      <Testimonials />
    </>
  );
}
