import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export function CategoryGrid() {
  const categories = [
    { name: "Rice & Flour", image: "/category-rice.png" },
    { name: "Grains & Pulses", image: "/category-grains.png" },
    { name: "Perfumes", image: "/category-perfumes.png" },
    { name: "Pantry Staples", image: "/category-pantry.png" },
    { name: "Dry Fruits & Nuts", image: "/category-dryfruits.png" },
    { name: "Bulk Essentials", image: "/category-bulk.png" }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">Shop What You Need</h2>
          <Link href="/" className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors">
            View All Categories <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8"
        >
          {categories.map((cat, i) => (
            <motion.div key={i} variants={item}>
              <Link href="/" className="block group relative w-full aspect-square md:aspect-[4/5] rounded-xl overflow-hidden shadow-sm">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  data-testid={`img-category-${i}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:bg-primary/40 transition-colors duration-300" />
                <div className="absolute inset-0 border-4 border-transparent group-hover:border-accent transition-colors duration-300 rounded-xl pointer-events-none" />
                
                <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 flex items-end justify-between">
                  <h3 className="text-white font-bold text-lg md:text-2xl leading-tight max-w-[80%]">{cat.name}</h3>
                  <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-lg">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        <Link href="/" className="md:hidden mt-8 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-4 rounded-md">
          View All Categories <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}