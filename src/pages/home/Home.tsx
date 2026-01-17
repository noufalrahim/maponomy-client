import { Header } from "@/layout/Header";
import { FeatureGrid, HeroSection } from "./_components";
import { Footer } from "@/layout/Footer";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <HeroSection />
      <FeatureGrid />
      <Footer />
    </div>
  );
}
