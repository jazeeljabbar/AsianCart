import { useState } from "react";
import { Link } from "wouter";
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

export function Header({ cartCount }: { cartCount: number }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const categories = [
    "Rice & Flour", "Grains & Pulses", "Pantry Staples", "Dry Fruits & Nuts",
    "Perfumes", "Cooking Oils & Spices", "Offers", "Bulk Orders"
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border shadow-sm">
      <div className="w-full bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
        Trusted quality. Better value. Delivered across India.
      </div>

      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 -ml-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(true)}
          data-testid="button-mobile-menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center">
          <img src="/asiancart-logo.png" alt="Asian Cart" className="h-10 md:h-12 object-contain" data-testid="img-logo" />
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
          <div className="relative w-full flex">
            <button 
              className="bg-accent text-accent-foreground px-4 rounded-l-md font-medium text-sm flex items-center gap-1 hover:bg-accent/90"
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              data-testid="button-mega-menu"
            >
              Shop Categories <ChevronDown className="w-4 h-4" />
            </button>
            <input 
              type="search" 
              placeholder="Search for rice, dal, spices..." 
              className="flex-1 border-y border-r border-border rounded-r-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
              data-testid="input-search"
            />
            <button className="absolute right-0 top-0 h-full px-4 text-muted-foreground hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Mega Menu Dropdown */}
            {isMegaMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-[600px] bg-white border border-border shadow-xl rounded-md p-6 grid grid-cols-3 gap-4 z-50">
                {categories.map(cat => (
                  <Link key={cat} href="/" className="text-foreground hover:text-primary font-medium transition-colors" onClick={() => setIsMegaMenuOpen(false)}>
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <Link href="/" className="hidden md:block text-sm font-semibold text-muted-foreground hover:text-primary transition-colors" data-testid="link-track-order">
            Track Order
          </Link>
          <Button variant="ghost" size="icon" className="hidden sm:flex text-foreground hover:text-primary" data-testid="button-user-account">
            <User className="w-5 h-5" />
          </Button>
          <Link href="/" className="relative p-2 text-foreground hover:text-primary transition-colors" data-testid="link-cart">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
          <input 
            type="search" 
            placeholder="Search for rice, dal, spices..." 
            className="w-full border border-border rounded-md px-4 py-2 bg-muted/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Search className="absolute right-3 top-2.5 w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="absolute top-0 left-0 w-4/5 max-w-sm h-full bg-white shadow-xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <img src="/asiancart-logo.png" alt="Asian Cart" className="h-8 object-contain" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-4 pb-2 mb-2 border-b border-border/50">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Shop Categories</p>
                {categories.map(cat => (
                  <Link key={cat} href="/" className="block py-3 text-foreground font-medium border-b border-border/30 last:border-0" onClick={() => setIsMobileMenuOpen(false)}>
                    {cat}
                  </Link>
                ))}
              </div>
              <div className="px-4 mt-4 space-y-4">
                <Link href="/" className="flex items-center gap-3 font-medium text-foreground py-2">
                  <User className="w-5 h-5 text-muted-foreground" /> My Account
                </Link>
                <Link href="/" className="flex items-center gap-3 font-medium text-foreground py-2">
                  <ShoppingCart className="w-5 h-5 text-muted-foreground" /> Track Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}