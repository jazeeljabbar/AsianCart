import { motion } from "framer-motion";
import { Button } from "./ui/button";

export function Hero() {
  return (
    <section className="relative w-full bg-primary overflow-hidden min-h-[600px] flex items-center">
      {/* Decorative background shape */}
      <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[140%] rounded-full bg-primary/80 blur-3xl mix-blend-screen pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Text */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-xl text-center lg:text-left pt-12 lg:pt-0"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary-foreground leading-[1.1] tracking-tight mb-6">
              India's everyday essentials, sourced better.
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 font-medium leading-relaxed">
              From premium rice and pantry staples to dry fruits and perfumes, Asian Cart brings dependable quality at trader-friendly prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg font-bold h-14 px-8 rounded-md" data-testid="button-start-shopping">
                Start Shopping
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary text-lg font-bold h-14 px-8 rounded-md bg-transparent" data-testid="button-get-quote">
                Get Bulk Quote
              </Button>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square flex justify-center items-center pb-12 lg:pb-0"
          >
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-[100px] transform translate-x-10 translate-y-10" />
            <div className="relative w-full h-full max-w-[500px] max-h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-primary-foreground/10">
              <img 
                src="/hero.png" 
                alt="Premium Indian Groceries Collection" 
                className="w-full h-full object-cover"
                data-testid="img-hero"
              />
              {/* Overlay accent */}
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-primary/80 to-transparent" />
            </div>
            
            {/* Floating accent elements */}
            <div className="absolute top-10 -left-6 bg-white rounded-lg shadow-xl p-4 hidden md:flex items-center gap-3 animate-pulse" style={{ animationDuration: '3s' }}>
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-lg">★</div>
              <div>
                <p className="text-sm font-bold text-foreground">Top Quality</p>
                <p className="text-xs text-muted-foreground">Sourced direct</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}