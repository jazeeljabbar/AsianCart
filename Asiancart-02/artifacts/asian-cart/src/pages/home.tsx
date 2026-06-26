import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Search, ShoppingCart, Heart, User, Menu, Wheat, Leaf, Droplet, Star, Tag, X, ChevronRight, CheckCircle2, Truck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Assume images are successfully generated at these paths
import logoPath from "@assets/Asiancart_Logo_1782069565471.png";

const PRODUCTS = [
  { id: 1, name: "Aged Basmati Rice", price: 320, weight: "1kg", badge: "Popular", image: "/images/cat-rice.png" },
  { id: 2, name: "Chakki Fresh Atta", price: 185, weight: "5kg", badge: "Best Value", image: "/images/cat-rice.png" },
  { id: 3, name: "Premium Moong Dal", price: 165, weight: "1kg", badge: "Popular", image: "/images/cat-pulses.png" },
  { id: 4, name: "Whole Black Pepper", price: 680, weight: "100g", badge: "Popular", image: "/images/cat-spices.png" },
  { id: 5, name: "California Almonds", price: 950, weight: "500g", badge: "Best Value", image: "/images/cat-dryfruits.png" },
  { id: 6, name: "W240 Cashew Nuts", price: 1100, weight: "500g", badge: "Popular", image: "/images/cat-dryfruits.png" },
  { id: 7, name: "Cold Pressed Groundnut Oil", price: 420, weight: "1litre", badge: "Best Value", image: "/images/cat-spices.png" },
  { id: 8, name: "Signature Oud Attar", price: 2200, weight: "10ml", badge: "Popular", image: "/images/cat-perfumes.png" }
];

export default function Home() {
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeChip, setActiveChip] = useState("Rice & Flour");

  const filteredProducts = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = () => {
    setCartCount((c) => c + 1);
    toast("Added to cart ✓", {
      description: "Item has been successfully added to your shopping cart.",
    });
  };

  return (
    <div className="min-h-screen bg-background w-full flex flex-col font-sans">
      {/* 1. Top Announcement Bar */}
      <div className="sticky top-0 z-50 bg-primary text-primary-foreground text-xs text-center py-2 font-medium tracking-wide">
        Fresh arrivals every week | Free shipping above ₹999
      </div>

      {/* 2. Navigation / Header */}
      <header className="sticky top-[32px] z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-6 w-6 text-foreground" />
            </button>
            <Link href="/" className="flex items-center">
              <img src={logoPath} alt="Asian Cart Logo" className="h-14 object-contain" />
            </Link>
          </div>

          <div className="hidden lg:flex flex-1 max-w-md mx-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for essentials..."
              className="w-full pl-9 rounded-full bg-muted/50 border-muted-foreground/20 focus-visible:ring-secondary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <a href="#" className="hover:text-secondary transition-colors">Shop by Category</a>
            <a href="#" className="hover:text-secondary transition-colors">Offers</a>
            <a href="#" className="hover:text-secondary transition-colors">Bulk Orders</a>
            <a href="#" className="hover:text-secondary transition-colors">Track Order</a>
          </nav>

          <div className="flex items-center gap-5">
            <button className="hidden sm:flex text-foreground hover:text-secondary transition-colors">
              <User className="h-5 w-5" />
            </button>
            <button className="hidden sm:flex text-foreground hover:text-secondary transition-colors">
              <Heart className="h-5 w-5" />
            </button>
            <button className="relative text-foreground hover:text-secondary transition-colors flex items-center">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search - Visible only on small screens */}
        <div className="lg:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for essentials..."
              className="w-full pl-9 rounded-full bg-muted/50 border-muted-foreground/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="w-[80vw] max-w-sm h-full bg-background border-r p-6 relative z-10 flex flex-col"
          >
            <button className="absolute top-4 right-4" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-6 w-6" />
            </button>
            <div className="mb-8">
              <img src={logoPath} alt="Asian Cart Logo" className="h-14 object-contain" />
            </div>
            <nav className="flex flex-col gap-4 text-lg font-medium">
              <a href="#" className="pb-2 border-b">Shop by Category</a>
              <a href="#" className="pb-2 border-b">Offers</a>
              <a href="#" className="pb-2 border-b">Bulk Orders</a>
              <a href="#" className="pb-2 border-b">Track Order</a>
              <a href="#" className="pb-2 border-b">My Account</a>
            </nav>
          </motion.div>
        </div>
      )}

      {/* 3. Hero Section */}
      <section className="relative w-full bg-[#F8F6EE] overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32">
        <div className="container mx-auto px-4 flex flex-col-reverse lg:flex-row items-center gap-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-6 text-center lg:text-left"
          >
            <h1 className="text-4xl lg:text-6xl font-serif text-primary leading-tight tracking-tight">
              Good ingredients begin with trusted sourcing.
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0">
              Essentials for every Indian kitchen. Carefully selected for purity, taste, and tradition.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-12 px-8 text-base">
                Shop Best Sellers
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-muted-foreground/30 text-foreground hover:bg-muted/50 rounded-full h-12 px-8 text-base">
                Browse Categories
              </Button>
            </div>
            <div className="pt-6 flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
              <span>📍 Delivering to:</span>
              <Input placeholder="Enter Pincode" className="w-32 h-8 text-xs bg-white/50 border-muted-foreground/30 focus-visible:ring-secondary" />
            </div>
          </motion.div>
          <div className="flex-1 w-full lg:w-auto relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="aspect-[4/3] lg:aspect-square relative rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/10 border-8 border-white/50"
            >
              <img
                src="/images/hero.png"
                alt="Premium Indian Pantry Ingredients"
                className="object-cover w-full h-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Category Chips Row */}
      <section className="py-8 bg-white border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto pb-4 gap-3 hide-scrollbar snap-x">
            {[
              { name: "Rice & Flour", icon: Wheat },
              { name: "Grains & Pulses", icon: Leaf },
              { name: "Pantry Staples", icon: Droplet },
              { name: "Dry Fruits & Nuts", icon: Star },
              { name: "Perfumes", icon: Droplet },
              { name: "Offers", icon: Tag },
            ].map((chip) => (
              <button
                key={chip.name}
                onClick={() => setActiveChip(chip.name)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border whitespace-nowrap snap-start transition-all duration-200 ${
                  activeChip === chip.name
                    ? "bg-secondary/10 border-secondary text-primary font-medium"
                    : "bg-background border-border text-muted-foreground hover:border-secondary/50 hover:bg-secondary/5"
                }`}
              >
                <chip.icon className={`h-4 w-4 ${activeChip === chip.name ? "text-secondary" : "text-muted-foreground"}`} />
                {chip.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Shop by Category — Editorial Cards Grid */}
      <section className="py-20 bg-background container mx-auto px-4">
        <h2 className="text-3xl font-serif text-primary mb-10">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
          <div className="col-span-1 md:col-span-2 row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer">
            <img src="/images/cat-rice.png" alt="Rice & Flour" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-serif mb-2">Rice & Flour</h3>
              <span className="text-sm flex items-center gap-1 group-hover:text-secondary transition-colors">Shop now <ChevronRight className="h-4 w-4" /></span>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
            <img src="/images/cat-pulses.png" alt="Grains & Pulses" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-serif mb-1">Grains & Pulses</h3>
              <span className="text-sm flex items-center gap-1 group-hover:text-secondary transition-colors">Shop now <ChevronRight className="h-4 w-4" /></span>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
            <img src="/images/cat-dryfruits.png" alt="Dry Fruits & Nuts" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-serif mb-1">Dry Fruits & Nuts</h3>
              <span className="text-sm flex items-center gap-1 group-hover:text-secondary transition-colors">Shop now <ChevronRight className="h-4 w-4" /></span>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
            <img src="/images/cat-spices.png" alt="Pantry Staples" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-serif mb-1">Pantry Staples</h3>
              <span className="text-sm flex items-center gap-1 group-hover:text-secondary transition-colors">Shop now <ChevronRight className="h-4 w-4" /></span>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
            <img src="/images/cat-perfumes.png" alt="Perfumes" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-serif mb-1">Perfumes</h3>
              <span className="text-sm flex items-center gap-1 group-hover:text-secondary transition-colors">Shop now <ChevronRight className="h-4 w-4" /></span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Best of Asian Cart — Product Grid */}
      <section className="py-20 bg-[#F8F6EE]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-serif text-primary">Best of Asian Cart</h2>
            {searchQuery && (
              <p className="text-muted-foreground text-sm">Showing results for "{searchQuery}"</p>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              No products found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-border/50 flex flex-col group relative"
                >
                  <Badge className="absolute top-4 left-4 z-10 bg-secondary text-secondary-foreground border-none">
                    {product.badge}
                  </Badge>
                  <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-muted/20">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1 line-clamp-2 min-h-[3rem]">{product.name}</h3>
                  <div className="text-xs text-muted-foreground mb-3">{product.weight}</div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="font-serif text-lg font-semibold text-primary">₹{product.price}</div>
                    <Button onClick={handleAddToCart} size="icon" className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90">
                      <ShoppingCart className="h-4 w-4 text-primary-foreground" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 7. Fresh Deals This Week */}
      <section className="py-20 bg-background container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
          <div className="relative rounded-[2rem] overflow-hidden min-h-[300px] flex items-center p-8 lg:p-12 group cursor-pointer">
            <img src="/images/banner-staples.png" alt="Staples banner" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
            <div className="relative z-10 text-white max-w-sm">
              <div className="text-secondary font-bold tracking-wider text-sm mb-2 uppercase">Up to 25% Off</div>
              <h3 className="text-3xl lg:text-4xl font-serif mb-6 leading-tight">Save More on Daily Staples</h3>
              <Button className="bg-white text-primary hover:bg-white/90 rounded-full px-8">Shop Now</Button>
            </div>
          </div>
          <div className="relative rounded-[2rem] overflow-hidden min-h-[300px] flex items-center p-8 lg:p-12 group cursor-pointer">
            <img src="/images/banner-dryfruits.png" alt="Dry fruits banner" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-amber-900/30 mix-blend-multiply" />
            <div className="relative z-10 text-white max-w-sm">
              <div className="text-amber-200 font-bold tracking-wider text-sm mb-2 uppercase">Festive Special</div>
              <h3 className="text-3xl lg:text-4xl font-serif mb-6 leading-tight">Premium Dry Fruits for Every Celebration</h3>
              <Button className="bg-white text-primary hover:bg-white/90 rounded-full px-8">Shop Now</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Trust Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif mb-4">From trusted traders to your table</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">We've spent years building relationships with the best sources across India.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Carefully selected suppliers</h3>
              <p className="text-primary-foreground/70 leading-relaxed">Direct relationships with reliable mills and estates to ensure authenticity.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Clean packing and quality checks</h3>
              <p className="text-primary-foreground/70 leading-relaxed">Rigorous standards at every step to maintain the highest levels of purity.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                <Truck className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Simple, dependable delivery</h3>
              <p className="text-primary-foreground/70 leading-relaxed">Timely updates and careful handling from our warehouse to your doorstep.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Kitchen Inspiration */}
      <section className="py-24 bg-background container mx-auto px-4">
        <h2 className="text-3xl font-serif text-primary mb-12 text-center lg:text-left">Kitchen Inspiration</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { img: "/images/life-dal.png", title: "Comforting Dal and Rice Bowl" },
            { img: "/images/life-festive.png", title: "Festive Dry Fruit Platter" },
            { img: "/images/life-dal.png", title: "Everyday Breakfast Pantry Staples" }
          ].map((item, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <h3 className="text-xl font-serif text-primary mb-2 group-hover:text-accent transition-colors">{item.title}</h3>
              <span className="text-sm text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">Explore <ChevronRight className="h-4 w-4" /></span>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Bulk Orders Callout */}
      <section className="py-24 bg-[#E8E1D1]">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl font-serif text-primary mb-6">Supplying homes, stores, restaurants and offices.</h2>
          <p className="text-lg text-primary/80 mb-10">Get competitive pricing on bulk orders — talk to our team today.</p>
          <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full h-14 px-10 text-lg">
            Talk to Our Bulk Order Team
          </Button>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="bg-primary text-primary-foreground pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <img src={logoPath} alt="Asian Cart Logo" className="h-16 object-contain brightness-0 invert" />
              <p className="text-primary-foreground/70 max-w-xs">Good ingredients, trusted sourcing. Your reliable partner for premium Indian pantry staples.</p>
            </div>
            
            <div>
              <h4 className="font-serif text-lg mb-6">Quick Links</h4>
              <ul className="space-y-4 text-primary-foreground/70">
                <li><a href="#" className="hover:text-secondary transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Shop</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Offers</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Bulk Orders</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Track Order</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg mb-6">Customer Care</h4>
              <ul className="space-y-4 text-primary-foreground/70">
                <li><a href="#" className="hover:text-secondary transition-colors">My Account</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Wishlist</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">FAQs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg mb-6">Stay Updated</h4>
              <p className="text-primary-foreground/70 mb-4">Subscribe to get special offers, free giveaways, and updates.</p>
              <div className="flex gap-2">
                <Input type="email" placeholder="Enter your email" className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-secondary rounded-full" />
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-6">Subscribe</Button>
              </div>
              <div className="mt-8 flex items-center gap-4 text-primary-foreground/70">
                <a href="#" className="hover:text-secondary transition-colors">Instagram</a>
                <a href="#" className="hover:text-secondary transition-colors">Facebook</a>
                <a href="#" className="hover:text-secondary transition-colors">WhatsApp</a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>© 2026 Asian Cart. All rights reserved.</p>
            <div className="flex items-center gap-1">
              Built with <Heart className="h-4 w-4 text-secondary fill-secondary" /> for Indian Kitchens
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
