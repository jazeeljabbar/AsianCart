import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Search, 
  User, 
  Heart, 
  ShoppingCart, 
  Menu, 
  X, 
  ChevronRight,
  CheckCircle2,
  UtensilsCrossed,
  Hotel,
  Building2,
  Building,
  PartyPopper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const products = [
  { id: 1, name: "Premium Basmati Rice", category: "Rice & Flour", weight: "5 kg", originalPrice: 750, price: 620, rating: 4.8, discount: 17, image: "/prod-basmati.png" },
  { id: 2, name: "Kerala Matta Rice", category: "Rice & Flour", weight: "5 kg", originalPrice: 520, price: 449, rating: 4.6, discount: 14, image: "/prod-matta.png" },
  { id: 3, name: "Whole Wheat Flour", category: "Rice & Flour", weight: "5 kg", originalPrice: 380, price: 310, rating: 4.7, discount: 18, image: "/prod-wheat.png" },
  { id: 4, name: "Toor Dal", category: "Grains & Pulses", weight: "1 kg", originalPrice: 210, price: 175, rating: 4.5, discount: 17, image: "/prod-toor.png" },
  { id: 5, name: "Black Pepper", category: "Pantry Staples", weight: "200 g", originalPrice: 180, price: 145, rating: 4.9, discount: 19, image: "/prod-pepper.png" },
  { id: 6, name: "Cashew Nuts", category: "Dry Fruits & Nuts", weight: "500 g", originalPrice: 680, price: 540, rating: 4.8, discount: 21, image: "/prod-cashew.png" },
  { id: 7, name: "Premium Almonds", category: "Dry Fruits & Nuts", weight: "500 g", originalPrice: 620, price: 499, rating: 4.7, discount: 20, image: "/prod-almond.png" },
  { id: 8, name: "Premium Attar", category: "Perfumes", weight: "12 ml", originalPrice: 850, price: 699, rating: 4.9, discount: 18, image: "/prod-attar.png" },
];

export default function Home() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(id)) {
        newWishlist.delete(id);
      } else {
        newWishlist.add(id);
      }
      return newWishlist;
    });
  };

  const addToCart = () => setCartCount((prev) => prev + 1);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-xs md:text-sm py-2 px-4 text-center overflow-hidden">
        <motion.div
          animate={{ x: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="whitespace-nowrap flex items-center justify-center gap-4"
        >
          <span>🚚 Free delivery on orders above ₹999</span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline">Fresh stock. Trusted quality.</span>
          <span className="hidden md:inline">|</span>
          <a href="#" className="font-semibold hover:underline">Now serving bulk orders for businesses →</a>
        </motion.div>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 bg-background/95 backdrop-blur-md transition-shadow ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 -ml-2"
              onClick={() => setMobileMenuOpen(true)}
              data-testid="button-mobile-menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href="/">
              <img src="/asian-cart-logo.png" alt="Asian Cart" className="h-14 lg:h-20 object-contain" />
            </Link>

            {/* Desktop Search */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-8 relative">
              <Input 
                type="text" 
                placeholder="Search rice, pulses, dry fruits and more..." 
                className="w-full pl-10 pr-4 py-2 rounded-full border-border bg-card"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-desktop-search"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>

            {/* Icons */}
            <div className="flex items-center gap-4 lg:gap-6">
              <button className="lg:hidden p-2" data-testid="button-mobile-search">
                <Search className="w-6 h-6" />
              </button>
              <button className="hidden md:flex p-2 hover:bg-muted rounded-full transition-colors" data-testid="button-account">
                <User className="w-6 h-6" />
              </button>
              <button className="hidden md:flex p-2 hover:bg-muted rounded-full transition-colors relative" data-testid="button-wishlist">
                <Heart className="w-6 h-6" />
                {wishlist.size > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-destructive rounded-full" />
                )}
              </button>
              <button className="p-2 hover:bg-muted rounded-full transition-colors relative" onClick={addToCart} data-testid="button-cart">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <motion.span 
                    key={cartCount}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center justify-center gap-8 py-3 border-t border-border">
            {['Home', 'Shop', 'Categories', 'Offers', 'Bulk Orders', 'About Us', 'Contact'].map((item) => (
              <a key={item} href="#" className="text-sm font-medium hover:text-secondary transition-colors" data-testid={`link-nav-${item.toLowerCase().replace(' ', '-')}`}>
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <motion.div 
            initial={{ x: "-100%" }} 
            animate={{ x: 0 }}
            className="relative w-4/5 max-w-sm bg-background h-full shadow-xl flex flex-col"
          >
            <div className="p-4 flex items-center justify-between border-b border-border">
              <img src="/asian-cart-logo.png" alt="Asian Cart" className="h-8" />
              <button onClick={() => setMobileMenuOpen(false)} className="p-2" data-testid="button-close-menu">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-4 overflow-y-auto">
              <div className="relative mb-4">
                <Input placeholder="Search..." className="pl-10" />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              {['Home', 'Shop', 'Categories', 'Offers', 'Bulk Orders', 'About Us', 'Contact'].map((item) => (
                <a key={item} href="#" className="py-2 border-b border-border/50 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  {item}
                </a>
              ))}
            </div>
            <div className="mt-auto p-4 border-t border-border flex justify-between bg-muted/30">
              <button className="flex flex-col items-center gap-1 text-sm font-medium">
                <User className="w-5 h-5" /> Account
              </button>
              <button className="flex flex-col items-center gap-1 text-sm font-medium relative">
                <Heart className="w-5 h-5" /> Wishlist
                {wishlist.size > 0 && <span className="absolute top-0 right-2 w-2 h-2 bg-destructive rounded-full" />}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 lg:px-8 py-8 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full w-fit">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-sm font-semibold tracking-wide uppercase">Premium Quality Guaranteed</span>
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] text-primary">
                Everyday essentials.<br/>
                Better quality.
              </h1>
              <p className="text-xl font-medium text-foreground/80">
                From trusted traders to your kitchen.
              </p>
              <p className="text-lg text-muted-foreground max-w-xl">
                Asian Cart brings quality rice, grains, pantry staples, dry fruits, perfumes and household essentials to Indian homes and businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg h-14 px-8 rounded-full" data-testid="button-shop-hero">
                  Shop Groceries
                </Button>
                <Button size="lg" variant="outline" className="text-lg h-14 px-8 rounded-full border-2 border-primary text-primary hover:bg-primary/5" data-testid="button-bulk-hero">
                  Explore Bulk Orders
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-8 border-t border-border mt-4">
                {[
                  { value: "500+", label: "Products" },
                  { value: "10,000+", label: "Happy Customers" },
                  { value: "Same-Day", label: "Delivery" }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="font-bold text-xl text-primary">{stat.value}</span>
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative h-[400px] lg:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <img src="/hero-grocery.png" alt="Indian Grocery" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              
              {/* Floating Offer Card */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 bg-background/95 backdrop-blur-md p-4 lg:p-6 rounded-2xl shadow-xl flex items-center gap-4 max-w-xs"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-2xl shrink-0">
                  🌿
                </div>
                <div>
                  <p className="font-bold text-sm lg:text-base leading-tight">Save up to 20% on pantry essentials</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-[#FAF7F2] py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-2">Shop by Category</h2>
                <p className="text-muted-foreground text-lg">Everything your kitchen needs</p>
              </div>
              <Button variant="link" className="text-primary font-semibold hidden md:flex items-center gap-1 group">
                View all categories <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
              {[
                { title: "Rice & Flour", img: "/cat-rice-flour.png" },
                { title: "Grains & Pulses", img: "/cat-grains-pulses.png" },
                { title: "Perfumes", img: "/cat-perfumes.png" },
                { title: "Pantry Staples", img: "/cat-pantry.png" },
                { title: "Dry Fruits", img: "/cat-dry-fruits.png" },
                { title: "Essentials", img: "/cat-essentials.png" }
              ].map((cat, i) => (
                <motion.a 
                  href="#"
                  key={cat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group relative h-48 lg:h-72 rounded-3xl overflow-hidden shadow-md flex flex-col justify-end p-6 block"
                  data-testid={`link-category-${i}`}
                >
                  <img src={cat.img} alt={cat.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                  <div className="absolute inset-0 bg-secondary mix-blend-overlay opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                  
                  <div className="relative z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-1">{cat.title}</h3>
                    <p className="text-white/80 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      Shop now <ChevronRight className="w-4 h-4" />
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="bg-primary text-primary-foreground py-10 lg:py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                { icon: "🔍", title: "Carefully Sourced Products", desc: "Every item quality checked before listing" },
                { icon: "💰", title: "Competitive Trader Pricing", desc: "Best wholesale and retail rates" },
                { icon: "🔒", title: "Secure Payments", desc: "UPI, Cards, Net Banking accepted" },
                { icon: "🚚", title: "Fast Local Delivery", desc: "Same-day dispatch on orders before 2pm" }
              ].map((feature, i) => (
                <div key={i} className="flex flex-col gap-3 text-center lg:text-left items-center lg:items-start">
                  <span className="text-4xl bg-white/10 w-16 h-16 rounded-full flex items-center justify-center">{feature.icon}</span>
                  <h4 className="font-semibold text-lg">{feature.title}</h4>
                  <p className="text-primary-foreground/70 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 lg:py-24 container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-3">Popular Picks</h2>
            <p className="text-muted-foreground text-lg">Our best-selling groceries, pantry must-haves and more</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product, i) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group bg-card border border-border rounded-2xl p-4 flex flex-col relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                data-testid={`card-product-${product.id}`}
              >
                {product.discount > 0 && (
                  <span className="absolute top-4 left-4 bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded-md z-10">
                    {product.discount}% OFF
                  </span>
                )}
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors"
                  data-testid={`button-wishlist-${product.id}`}
                >
                  <Heart className={`w-5 h-5 ${wishlist.has(product.id) ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
                </button>
                
                <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-muted/20">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                <div className="flex flex-col flex-1">
                  <span className="text-xs text-muted-foreground font-medium mb-1">{product.category} • {product.weight}</span>
                  <h3 className="font-semibold text-foreground text-sm lg:text-base leading-tight mb-2 line-clamp-2 flex-1">{product.name}</h3>
                  
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-muted text-muted'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground ml-1">{product.rating}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                    <div>
                      <span className="font-bold text-lg text-primary">₹{product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-muted-foreground line-through ml-2">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <Button size="icon" className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all" onClick={addToCart} data-testid={`button-add-cart-${product.id}`}>
                      <ShoppingCart className="w-5 h-5 text-primary-foreground" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Button variant="outline" size="lg" className="rounded-full border-primary text-primary px-8">
              View All Products
            </Button>
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="container mx-auto px-4 lg:px-8 mb-16 lg:mb-24">
          <div className="rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-xl">
            <div className="bg-secondary p-8 lg:p-12 md:w-1/2 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <h2 className="text-4xl lg:text-5xl font-extrabold text-secondary-foreground mb-4 leading-tight relative z-10">
                Stock Your Pantry,<br/>
                Save More
              </h2>
              <p className="text-secondary-foreground/80 text-lg lg:text-xl font-medium relative z-10 max-w-sm">
                Special pricing on monthly grocery essentials.
              </p>
            </div>
            <div className="bg-primary p-8 lg:p-12 md:w-1/2 flex flex-col justify-center items-start md:items-end text-left md:text-right relative">
              {/* Optional slight curve mask could be implemented with an SVG here */}
              <Button size="lg" variant="outline" className="rounded-full bg-transparent border-white text-white hover:bg-white hover:text-primary mb-4 h-14 px-8 text-lg font-semibold" data-testid="button-view-offers">
                View Offers <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-white/60 text-sm font-medium">Min. order ₹499 | Free delivery above ₹999</p>
            </div>
          </div>
        </section>

        {/* Bulk Order Section */}
        <section className="bg-primary py-16 lg:py-24 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center flex flex-col items-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-semibold tracking-wide uppercase mb-6">
              For Businesses & Institutions
            </span>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">Buying in bulk?</h2>
            <p className="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto mb-10">
              Get better pricing for restaurants, stores, hostels, offices and events. Trusted by 200+ local businesses.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 lg:gap-12 mb-12">
              {[
                { icon: UtensilsCrossed, label: "Restaurants" },
                { icon: Hotel, label: "Hotels" },
                { icon: Building2, label: "Hostels" },
                { icon: Building, label: "Offices" },
                { icon: PartyPopper, label: "Events" }
              ].map((Item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-default">
                  <Item.icon className="w-8 h-8 lg:w-10 lg:h-10 text-secondary" />
                  <span className="text-sm font-medium">{Item.label}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-14 px-10 rounded-full text-lg font-bold shadow-lg" data-testid="button-request-bulk">
                Request Bulk Pricing
              </Button>
              <a href="tel:+919876543210" className="text-sm text-white/70 hover:text-white transition-colors underline-offset-4 hover:underline">
                Call us: +91 98765 43210
              </a>
            </div>
          </div>
        </section>

        {/* Why Asian Cart */}
        <section className="py-16 lg:py-24 bg-[#FAF7F2]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative h-[500px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl"
              >
                <img src="/why-asian-cart.png" alt="Indian market" className="w-full h-full object-cover" />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col justify-center"
              >
                <h2 className="text-3xl lg:text-5xl font-bold text-primary mb-10">Why choose Asian Cart?</h2>
                <div className="space-y-8">
                  {[
                    { title: "Quality Checked Products", desc: "Every product vetted for freshness and authenticity" },
                    { title: "Reliable Supplier Network", desc: "Sourced directly from trusted farmers and traders" },
                    { title: "Everyday Value", desc: "Competitive pricing for households and businesses alike" },
                    { title: "Convenient Ordering", desc: "Easy online ordering with flexible delivery slots" }
                  ].map((feature, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1 shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-foreground mb-2">{feature.title}</h4>
                        <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 lg:py-24 container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-3">What our customers say</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                text: "As a restaurant owner, Asian Cart has been a game changer. Quality products at great bulk prices, delivered on time.",
                author: "Ramesh Kumar",
                role: "Restaurant Owner, Chennai"
              },
              {
                text: "I order my monthly groceries from Asian Cart and the quality is always top-notch. The basmati rice is the best I've had.",
                author: "Priya Sharma",
                role: "Homemaker, Bangalore"
              },
              {
                text: "The dry fruits and cashews I ordered were fresh and came in premium packaging. Will definitely reorder!",
                author: "Mohammed Farouk",
                role: "Retail Store Owner, Hyderabad"
              }
            ].map((testimonial, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-8 rounded-3xl shadow-sm border-l-4 border-accent relative"
              >
                <div className="text-accent mb-4">
                  {'⭐'.repeat(5)}
                </div>
                <p className="text-foreground/80 italic mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <h5 className="font-bold text-primary">{testimonial.author}</h5>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-secondary py-16 lg:py-20 text-center px-4">
          <div className="container mx-auto max-w-3xl flex flex-col items-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-foreground mb-4">Stay fresh with Asian Cart</h2>
            <p className="text-secondary-foreground/80 text-lg mb-8">
              Get weekly deals, new arrivals and seasonal offers straight to your inbox.
            </p>
            <form className="w-full max-w-md flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="h-12 bg-white/90 border-white/50 focus-visible:ring-primary rounded-full px-6"
                required
              />
              <Button type="submit" size="lg" className="h-12 rounded-full bg-primary hover:bg-primary/90 text-white px-8 font-semibold shrink-0" data-testid="button-subscribe">
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary pt-16 pb-8 text-primary-foreground/80">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            <div className="lg:col-span-2">
              <img src="/asian-cart-logo.png" alt="Asian Cart" className="h-20 mb-6 brightness-0 invert" />
              <p className="max-w-sm mb-6 leading-relaxed">
                Premium quality Indian groceries and essentials for households and businesses. Trusted traders, reliable delivery.
              </p>
              <div className="flex gap-4">
                {/* Social icons could go here */}
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors cursor-pointer">
                  f
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors cursor-pointer">
                  in
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors cursor-pointer">
                  x
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Shop Categories</h4>
              <ul className="space-y-3">
                {['Rice & Flour', 'Grains & Pulses', 'Dry Fruits', 'Pantry Staples', 'Perfumes', 'Bulk Orders'].map(link => (
                  <li key={link}><a href="#" className="hover:text-secondary transition-colors inline-flex items-center gap-1">{link}</a></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Customer Support</h4>
              <ul className="space-y-3">
                {['My Account', 'Track Order', 'Returns & Refunds', 'FAQ', 'Contact Support'].map(link => (
                  <li key={link}><a href="#" className="hover:text-secondary transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">About & Contact</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-secondary transition-colors">Our Story</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Sustainability</a></li>
                <li className="pt-2 flex items-start gap-2 text-sm mt-4">
                  <span className="shrink-0">📍</span> Mumbai, Maharashtra
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="shrink-0">📞</span> +91 98765 43210
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="shrink-0">✉️</span> hello@asiancart.in
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© 2025 Asian Cart. All rights reserved.</p>
            <div className="flex gap-3 text-white/50">
              <span className="px-2 py-1 bg-white/10 rounded">UPI</span>
              <span className="px-2 py-1 bg-white/10 rounded">Visa</span>
              <span className="px-2 py-1 bg-white/10 rounded">Mastercard</span>
              <span className="px-2 py-1 bg-white/10 rounded">RuPay</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
