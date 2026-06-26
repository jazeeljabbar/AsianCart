import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export function ShopByNeed() {
  const needs = [
    { title: "Monthly Grocery Refill", img: "/need-1.png" },
    { title: "Festival & Gifting Dry Fruits", img: "/need-2.png" },
    { title: "Restaurant & Hotel Supply", img: "/need-3.png" },
    { title: "Premium Fragrances", img: "/need-4.png" }
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-10 md:mb-14 text-center">Shop by Need</h2>
        
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {needs.map((need, i) => (
            <Link key={i} href="/" className="group relative w-full aspect-[16/9] md:aspect-[3/2] lg:aspect-[21/9] rounded-2xl overflow-hidden block">
              <img 
                src={need.img} 
                alt={need.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                data-testid={`img-need-${i}`}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              
              <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl md:text-3xl font-black text-white max-w-[80%] leading-tight">{need.title}</h3>
                  <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}