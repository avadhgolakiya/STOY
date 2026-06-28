import Hero from "../components/Hero";
import AtelierEdit from "../components/AtelierEdit";
import BrandShowcase from "../components/BrandShowcase";
import ProductGrid from "../components/ProductGrid";
import RoyalMandate from "../components/RoyalMandate";
import Testimonials from "../components/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <AtelierEdit />
      {/* <BrandShowcase /> */}
      <ProductGrid />
      <RoyalMandate />
      <Testimonials />
    </>
  );
}
