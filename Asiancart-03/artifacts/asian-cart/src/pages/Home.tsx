import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ServiceStrip } from "@/components/ServiceStrip";
import { CategoryGrid } from "@/components/CategoryGrid";
import { DealsSection } from "@/components/DealsSection";
import { ShopByNeed } from "@/components/ShopByNeed";
import { B2BSection } from "@/components/B2BSection";
import { BrandStats } from "@/components/BrandStats";
import { ReviewsCarousel } from "@/components/ReviewsCarousel";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header cartCount={cartCount} />
      <main>
        <Hero />
        <ServiceStrip />
        <CategoryGrid />
        <DealsSection onAdd={handleAddToCart} />
        <ShopByNeed />
        <B2BSection />
        <BrandStats />
        <ReviewsCarousel />
      </main>
      <Footer />
    </div>
  );
}