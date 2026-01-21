import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import TrustBadges from "@/components/TrustBadges";
import PartnerCTA from "@/components/PartnerCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <TrustBadges />
        <CategoriesSection />
        <FeaturedProducts />
        <PartnerCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
