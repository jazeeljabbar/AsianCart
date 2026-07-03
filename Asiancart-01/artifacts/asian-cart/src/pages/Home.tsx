import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronRight,
  Star,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Package,
  Truck,
  CreditCard,
  Award,
  ShoppingBag,
  Eye,
  Tag,
  Building2,
  UtensilsCrossed,
  Hotel,
  PartyPopper,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  category: string;
  weight: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  stock: number;
  imageUrl: string;
  description: string;
  isFeatured: boolean;
  badge: string | null;
}

interface CartItem extends Product {
  quantity: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const API_BASE = "http://localhost:5000/api";

const STATIC_PRODUCTS: Product[] = [
  { id: "1", name: "Premium Basmati Rice", category: "Rice & Flour", weight: "5 kg", price: 620, originalPrice: 750, discount: 17, rating: 4.8, reviews: 234, stock: 150, imageUrl: "/prod-basmati.png", description: "Long-grain aged basmati rice, perfect for biryanis and pulaos.", isFeatured: true, badge: "Best Seller" },
  { id: "2", name: "Kerala Matta Rice", category: "Rice & Flour", weight: "5 kg", price: 449, originalPrice: 520, discount: 14, rating: 4.6, reviews: 187, stock: 95, imageUrl: "/prod-matta.png", description: "Traditional red rice from Kerala, rich in fibre and nutrients.", isFeatured: true, badge: "Authentic" },
  { id: "3", name: "Whole Wheat Flour", category: "Rice & Flour", weight: "5 kg", price: 310, originalPrice: 380, discount: 18, rating: 4.7, reviews: 312, stock: 200, imageUrl: "/prod-wheat.png", description: "Stone-ground whole wheat flour for soft rotis and parathas.", isFeatured: true, badge: "Organic" },
  { id: "4", name: "Toor Dal", category: "Grains & Pulses", weight: "1 kg", price: 175, originalPrice: 210, discount: 17, rating: 4.5, reviews: 445, stock: 300, imageUrl: "/prod-toor.png", description: "Split pigeon peas, the base of every Indian home's dal.", isFeatured: true, badge: "Top Pick" },
  { id: "5", name: "Black Pepper", category: "Pantry Staples", weight: "200 g", price: 145, originalPrice: 180, discount: 19, rating: 4.9, reviews: 521, stock: 180, imageUrl: "/prod-pepper.png", description: "Bold, pungent Malabar black pepper.", isFeatured: true, badge: "Premium" },
  { id: "6", name: "Cashew Nuts W240", category: "Dry Fruits & Nuts", weight: "500 g", price: 540, originalPrice: 680, discount: 21, rating: 4.8, reviews: 378, stock: 120, imageUrl: "/prod-cashew.png", description: "Whole W240 grade cashews, creamy and rich.", isFeatured: true, badge: "Export Grade" },
  { id: "7", name: "Premium Almonds", category: "Dry Fruits & Nuts", weight: "500 g", price: 499, originalPrice: 620, discount: 20, rating: 4.7, reviews: 289, stock: 110, imageUrl: "/prod-almond.png", description: "California almonds, crunchy and fresh.", isFeatured: false, badge: null },
  { id: "8", name: "Royal Oud Attar", category: "Perfumes", weight: "12 ml", price: 699, originalPrice: 850, discount: 18, rating: 4.9, reviews: 156, stock: 60, imageUrl: "/prod-attar.png", description: "Traditional Oud-based attar, long-lasting and alcohol-free.", isFeatured: true, badge: "Exclusive" },
];

const CATEGORIES = [
  { name: "Rice & Flour", slug: "rice-flour", image: "/cat-rice-flour.png", count: 3 },
  { name: "Grains & Pulses", slug: "grains-pulses", image: "/cat-grains-pulses.png", count: 8 },
  { name: "Pantry Staples", slug: "pantry-staples", image: "/cat-pantry.png", count: 12 },
  { name: "Dry Fruits & Nuts", slug: "dry-fruits-nuts", image: "/cat-dry-fruits.png", count: 6 },
  { name: "Perfumes", slug: "perfumes", image: "/cat-perfumes.png", count: 4 },
  { name: "Daily Essentials", slug: "daily-essentials", image: "/cat-essentials.png", count: 15 },
];

const TESTIMONIALS = [
  { name: "Priya Menon", role: "Home Cook, Mumbai", review: "Asian Cart has been a game changer! The quality of their basmati rice and cashews is exceptional. Tastes just like home.", rating: 5, avatar: "PM" },
  { name: "Ahmed Al-Rashid", role: "Restaurant Owner, New Delhi", review: "We source all our spices and pulses from Asian Cart for our restaurant. Consistent quality, great bulk pricing, and always on time.", rating: 5, avatar: "AA" },
  { name: "Fatima Siddiqui", role: "Catering Business, Bangalore", review: "The attars from Asian Cart are absolutely divine — long-lasting and authentic. My clients always ask where I get them!", rating: 5, avatar: "FS" },
];

const LIVE_ORDERS = [
  { city: "Mumbai", item: "Premium Basmati Rice", time: "2 min ago" },
  { city: "New Delhi", item: "Cashew Nuts W240", time: "5 min ago" },
  { city: "Bangalore", item: "Royal Oud Attar", time: "8 min ago" },
  { city: "Hyderabad", item: "Black Pepper", time: "11 min ago" },
  { city: "Chennai", item: "Toor Dal", time: "15 min ago" },
];

// ─── Utility ─────────────────────────────────────────────────────────────────

async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const token = localStorage.getItem("ac_token");
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

function ProductCard({ product, onAddToCart, onWishlist, isWishlisted }: {
  product: Product;
  onAddToCart: (p: Product) => void;
  onWishlist: (id: string) => void;
  isWishlisted: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white rounded-2xl border border-[#E2EAE5] shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badge */}
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-wider bg-[#003C32] text-white px-2.5 py-1 rounded-full">
          {product.badge}
        </span>
      )}

      {/* Wishlist */}
      <button
        onClick={(e) => { e.stopPropagation(); onWishlist(product.id); }}
        className="absolute top-3 right-3 z-10 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
        data-testid={`btn-wishlist-${product.id}`}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
      </button>

      {/* Discount */}
      {product.discount > 0 && (
        <span className="absolute top-3.5 right-12 z-10 text-[10px] font-bold bg-[#9AD62A] text-[#1D2B25] px-2 py-1 rounded-full">
          -{product.discount}%
        </span>
      )}

      {/* Image */}
      <div className="relative aspect-[4/3] bg-[#FAF7F2] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400";
          }}
        />
        {/* Quick Add overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-0 inset-x-0 p-3"
            >
              <button
                onClick={() => onAddToCart(product)}
                className="w-full bg-[#003C32] hover:bg-[#002f27] text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                data-testid={`btn-quick-add-${product.id}`}
              >
                <ShoppingBag className="w-4 h-4" />
                Quick Add
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[11px] font-semibold text-[#57BF3C] uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="font-bold text-[#1D2B25] text-sm leading-snug mb-1 truncate">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 mb-2">{product.weight}</p>

        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-extrabold text-[#003C32]">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through ml-1.5">₹{product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="p-2 bg-[#003C32] hover:bg-[#002f27] text-white rounded-lg transition-colors"
            data-testid={`btn-add-cart-${product.id}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [products, setProducts] = useState<Product[]>(STATIC_PRODUCTS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [liveOrderIdx, setLiveOrderIdx] = useState(0);
  const [showLiveOrder, setShowLiveOrder] = useState(true);

  // Auth form state
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number; discountAmount: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  // Computed
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartSubtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const discountAmount = appliedCoupon?.discountAmount ?? 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  const filteredProducts = products
    .filter((p) => {
      // 1. Filter by category button/card
      if (selectedCategory !== "All" && p.category !== selectedCategory) {
        return false;
      }
      // 2. Filter by search query (strictly matches product name)
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "featured") {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      }
      return 0;
    });

  const visibleProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 8);

  // Effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scroll Spy: Update URL hash dynamically on scroll without breaking back-navigation history stack
      const sections = ["home", "categories", "shop", "offers", "bulk-orders", "about-us"];
      const scrollPosition = window.scrollY + 250;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            const newHash = `#${sectionId}`;
            if (window.location.hash !== newHash) {
              window.history.replaceState(null, "", newHash === "#home" ? "/" : newHash);
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setShowAllProducts(false);
    if (searchQuery.trim() !== "" || selectedCategory !== "All") {
      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    // Restore session
    const token = localStorage.getItem("ac_token");
    if (token) {
      apiCall<{ user: User }>("/auth/me").then((res) => {
        if (res?.user) setCurrentUser(res.user);
      });
    }
    // Load products from API (fallback to static)
    apiCall<{ products: Product[] }>("/products").then((res) => {
      if (res?.products?.length) setProducts(res.products);
    });
  }, []);

  // Live order ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setShowLiveOrder(false);
      setTimeout(() => {
        setLiveOrderIdx((i) => (i + 1) % LIVE_ORDERS.length);
        setShowLiveOrder(true);
      }, 400);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Handlers
  const addToCart = (product: Product) => {
    if (!currentUser) {
      setAuthOpen(true);
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your basket.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast({ title: `${product.name} added to cart`, duration: 2000 });
  };

  const updateQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => i.id === id ? { ...i, quantity: i.quantity + delta } : i)
        .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleWishlist = (id: string) => {
    if (!currentUser) {
      setAuthOpen(true);
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your wishlist.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    setWishlist((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    if (!couponCode) return;
    const res = await apiCall<{ coupon: { code: string; discountPercent: number; discountAmount: number } }>(
      "/coupons/validate",
      { method: "POST", body: JSON.stringify({ code: couponCode, orderValue: cartSubtotal }) }
    );
    if (res?.coupon) {
      setAppliedCoupon(res.coupon);
      toast({ title: `Coupon applied! You save ₹${res.coupon.discountAmount}`, duration: 2500 });
    } else {
      // Offline fallback
      if (couponCode.toUpperCase() === "WELCOME10" && cartSubtotal >= 500) {
        const discountAmount = Math.min(Math.round(cartSubtotal * 0.1), 200);
        setAppliedCoupon({ code: "WELCOME10", discountPercent: 10, discountAmount });
        toast({ title: `Coupon applied! You save ₹${discountAmount}`, duration: 2500 });
      } else {
        setCouponError("Invalid coupon or minimum order value not met.");
      }
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    const endpoint = authTab === "signin" ? "/auth/login" : "/auth/register";
    const body = authTab === "signin"
      ? { email: authEmail, password: authPassword }
      : { email: authEmail, password: authPassword, name: authName };

    const res = await apiCall<{ user: User; token: string }>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });

    setAuthLoading(false);
    if (res?.user && res.token) {
      localStorage.setItem("ac_token", res.token);
      setCurrentUser(res.user);
      setAuthOpen(false);
      toast({ title: `Welcome, ${res.user.name}!`, duration: 2500 });
      if (res.user.role === "admin") setLocation("/admin");
    } else {
      setAuthError("Invalid email or password.");
    }
  };

  const handleLogout = async () => {
    await apiCall("/auth/logout", { method: "POST" });
    localStorage.removeItem("ac_token");
    setCurrentUser(null);
    setCartItems([]);
    setWishlist(new Set());
    toast({ title: "Signed out successfully", duration: 2000 });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    const checkoutData = { items: cartItems, coupon: appliedCoupon, subtotal: cartSubtotal, total: cartTotal };
    sessionStorage.setItem("checkout_data", JSON.stringify(checkoutData));
    setCartOpen(false);
    setLocation("/checkout");
  };

  return (
    <div id="home" className="min-h-screen bg-[#FAF7F2] text-[#1D2B25] font-sans">

      {/* ── Announcement Bar ─────────────────────────────────────────────── */}
      <div className="bg-[#003C32] text-white py-3 text-center text-xs lg:text-sm font-bold px-4 flex items-center justify-center gap-2 select-none">
        <span>🚚 Free delivery on orders above ₹999</span>
        <span className="opacity-40">|</span>
        <span>Fresh stock. Trusted quality.</span>
        <span className="opacity-40">|</span>
        <a href="#bulk-orders" className="hover:underline flex items-center gap-1">
          Now serving bulk orders for businesses &rarr;
        </a>
      </div>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 bg-[#FAF7F2] transition-all duration-300 ${
          scrolled ? "shadow-md bg-[#FAF7F2]/90 backdrop-blur-md" : "border-b border-[#E2EAE5]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Row 1: Logo + Search + Icons */}
          <div className="flex items-center gap-4 h-20">
            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 -ml-2 text-[#003C32]"
              onClick={() => setMobileMenuOpen(true)}
              data-testid="btn-mobile-menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <a href="/" className="flex-shrink-0">
              <img
                src="/asian-cart-logo.png"
                alt="Asian Cart"
                className="h-10 lg:h-12 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  const span = document.createElement("span");
                  span.textContent = "Asian Cart";
                  span.className = "text-xl font-extrabold text-[#003C32]";
                  (e.target as HTMLImageElement).parentNode?.appendChild(span);
                }}
              />
            </a>

            {/* Search bar */}
            <div className="hidden lg:flex flex-1 max-w-3xl mx-auto relative px-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search rice, pulses, dry fruits and more..."
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-[#E2EAE5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#003C32] transition shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search"
                />
                {searchQuery && (
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-4 ml-auto">
              {/* Mobile search */}
              <button className="lg:hidden p-2 text-[#1D2B25]" data-testid="btn-mobile-search">
                <Search className="w-5 h-5" />
              </button>

              {/* User */}
              {currentUser ? (
                <div className="relative group hidden md:block">
                  <button
                    className="flex items-center gap-2 p-2 hover:bg-[#F0F5F2] rounded-full transition-colors"
                    data-testid="btn-user-menu"
                  >
                    <User className="w-5 h-5 text-[#1D2B25]" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#E2EAE5] rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-1">
                    {currentUser.role === "admin" && (
                      <button onClick={() => setLocation("/admin")} className="w-full text-left px-4 py-2 text-sm hover:bg-[#F0F5F2] rounded-lg">
                        Admin Dashboard
                      </button>
                    )}
                    <button onClick={() => setLocation("/account")} className="w-full text-left px-4 py-2 text-sm hover:bg-[#F0F5F2] rounded-lg">
                      My Orders
                    </button>
                    <hr className="my-1 border-[#E2EAE5]" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="hidden md:flex p-2 hover:bg-[#F0F5F2] rounded-full transition-colors"
                  onClick={() => setAuthOpen(true)}
                  data-testid="btn-signin"
                >
                  <User className="w-5 h-5 text-[#1D2B25]" />
                </button>
              )}

              {/* Wishlist */}
              <button
                className="flex p-2 hover:bg-[#F0F5F2] rounded-full transition-colors relative"
                onClick={() => setWishlistOpen(true)}
                data-testid="btn-wishlist"
              >
                <Heart className="w-5 h-5 text-[#1D2B25]" />
                {wishlist.size > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#003C32] rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                    {wishlist.size}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                className="flex items-center p-2 hover:bg-[#F0F5F2] rounded-full transition-colors relative"
                onClick={() => setCartOpen(true)}
                data-testid="btn-cart"
              >
                <ShoppingCart className="w-5 h-5 text-[#1D2B25]" />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-[#003C32] text-white text-[10px] font-bold rounded-full"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>
            </div>
          </div>

          {/* Row 2: Desktop Nav */}
          <nav className="hidden lg:flex items-center justify-center gap-8 pb-4">
            {["Home", "Shop", "Categories", "Offers", "Bulk Orders", "About Us", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-sm text-gray-600 hover:text-[#003C32] transition-colors"
                data-testid={`nav-${item.toLowerCase().replace(" ", "-")}`}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Mobile Menu Drawer ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#E2EAE5]">
                <img src="/asian-cart-logo.png" alt="Asian Cart" className="h-10 object-contain" />
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 hover:bg-[#F0F5F2] rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-1">
                {["Home", "Shop", "Categories", "Offers", "Bulk Orders", "About Us", "Contact"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[#F0F5F2] text-sm font-semibold text-[#1D2B25]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </a>
                ))}
              </div>
              <div className="p-5 border-t border-[#E2EAE5]">
                {currentUser ? (
                  <button onClick={handleLogout} className="w-full py-3 border border-red-200 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors">
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => { setMobileMenuOpen(false); setAuthOpen(true); }}
                    className="w-full py-3 bg-[#003C32] text-white rounded-xl font-semibold text-sm hover:bg-[#002f27] transition-colors"
                  >
                    Sign In / Register
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main>
        {/* ── Hero Section ───────────────────────────────────────────────── */}
        <section className="relative bg-[#FAF7F2] overflow-hidden min-h-[500px] lg:min-h-[600px] flex items-center">
          <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left content */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex items-center gap-2 bg-[#EEF5EF] text-[#57BF3C] rounded-full px-4 py-2 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#57BF3C]" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    PREMIUM QUALITY GUARANTEED
                  </span>
                </div>

                <h1 className="text-5xl lg:text-[4rem] font-extrabold leading-[1.1] tracking-tight mb-6 text-[#003C32]">
                  Everyday essentials.<br />
                  Better quality.
                </h1>

                <p className="text-gray-500 text-lg leading-relaxed mb-4">
                  From trusted traders to your kitchen.
                </p>
                
                <p className="text-gray-500 leading-relaxed mb-10 max-w-lg">
                  Asian Cart brings quality rice, grains, pantry staples, dry fruits, perfumes and household essentials to Indian homes and businesses.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}
                    className="px-8 py-3.5 bg-[#003C32] hover:bg-[#002f27] text-white font-semibold rounded-full transition-colors text-sm"
                  >
                    Shop Groceries
                  </button>
                  <a
                    href="#bulk"
                    className="px-8 py-3.5 border border-[#003C32] hover:bg-[#003C32] text-[#003C32] hover:text-white font-semibold rounded-full transition-all text-sm"
                  >
                    Explore Bulk Orders
                  </a>
                </div>

                {/* Quick stats */}
                <div className="flex flex-wrap gap-10 mt-12 pt-8 border-t border-[#E2EAE5]">
                  {[
                    { value: "500+", label: "Products" },
                    { value: "10,000+", label: "Happy Customers" },
                    { value: "Same-Day", label: "Delivery" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="text-2xl font-extrabold text-[#003C32]">{stat.value}</div>
                      <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right: Hero image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative hidden lg:block"
              >
                <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-2xl">
                  <img
                    src="/hero-grocery.png"
                    alt="Premium Indian Groceries"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800";
                    }}
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute bottom-8 right-8 bg-[#FAF7F2] text-[#1D2B25] rounded-2xl p-4 pr-6 shadow-xl max-w-[240px]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#EEF5EF] rounded-full flex items-center justify-center flex-shrink-0">
                      <Tag className="w-5 h-5 text-[#57BF3C]" />
                    </div>
                    <div className="text-sm font-bold text-[#003C32] leading-tight">
                      Save up to 20% on pantry essentials
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Trust Badges (Horizontal Green Bar) ───────────────────────── */}
        <section className="bg-[#003C32] text-white py-12 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Search className="w-5 h-5 text-[#9AD62A]" />,
                  title: "Carefully Sourced Products",
                  desc: "Every item quality checked before listing"
                },
                {
                  icon: <Tag className="w-5 h-5 text-[#9AD62A]" />,
                  title: "Competitive Trader Pricing",
                  desc: "Best wholesale and retail rates"
                },
                {
                  icon: <Lock className="w-5 h-5 text-[#9AD62A]" />,
                  title: "Secure Payments",
                  desc: "UPI, Cards, Net Banking accepted"
                },
                {
                  icon: <Truck className="w-5 h-5 text-[#9AD62A]" />,
                  title: "Fast Local Delivery",
                  desc: "Same-day dispatch on orders before 2pm"
                }
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center text-center px-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110">
                    {badge.icon}
                  </div>
                  <h4 className="text-sm font-extrabold text-white mb-1.5">{badge.title}</h4>
                  <p className="text-xs text-white/70 leading-relaxed font-medium">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Shop by Category ────────────────────────────────────────────── */}
        <section id="categories" className="py-16 lg:py-24 bg-[#FAF7F2] scroll-mt-28">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-[#003C32] mb-2">Shop by Category</h2>
                <p className="text-gray-500 text-sm">Everything your kitchen needs</p>
              </div>
              <a
                href="#shop"
                onClick={() => setSelectedCategory("All")}
                className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#003C32] hover:text-[#57BF3C] transition-colors"
              >
                View all categories <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Rice & Flour", image: "/cat-rice-flour.png", slug: "rice-flour", filterVal: "Rice & Flour" },
                { name: "Grains & Pulses", image: "/cat-grains-pulses.png", slug: "grains-pulses", filterVal: "Grains & Pulses" },
                { name: "Perfumes", image: "/cat-perfumes.png", slug: "perfumes", filterVal: "Perfumes" },
                { name: "Pantry Staples", image: "/cat-pantry.png", slug: "pantry-staples", filterVal: "Pantry Staples" },
                { name: "Dry Fruits", image: "/cat-dry-fruits.png", slug: "dry-fruits-nuts", filterVal: "Dry Fruits & Nuts" },
                { name: "Essentials", image: "/cat-essentials.png", slug: "daily-essentials", filterVal: "Daily Essentials", extra: "Shop now >" },
              ].map((cat, i) => (
                <motion.a
                  key={cat.slug}
                  href={`#shop`}
                  onClick={() => setSelectedCategory(cat.filterVal)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative rounded-[2rem] overflow-hidden aspect-[1.6] shadow-sm hover:shadow-xl transition-shadow"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&q=80&w=600";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#003C32]/90 via-[#003C32]/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-6 left-6">
                    <span className="text-2xl font-extrabold text-white leading-snug tracking-tight">
                      {cat.name}
                    </span>
                    {cat.extra && (
                      <div className="text-white/90 text-sm mt-1.5 flex items-center hover:text-white transition-colors">
                        {cat.extra}
                      </div>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Popular Picks / Product Grid ────────────────────────────────── */}
        <section id="shop" className="py-16 lg:py-20 bg-[#FAF7F2] scroll-mt-28">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-[#57BF3C] font-bold text-xs uppercase tracking-[0.2em] mb-2">Hand-Picked for You</p>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-[#003C32]">Popular Picks</h2>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                {/* Clear filters button */}
                {(selectedCategory !== "All" || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSearchQuery("");
                    }}
                    className="text-xs font-bold px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-full transition-all flex items-center gap-1.5"
                    data-testid="btn-clear-filters"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear Filters
                  </button>
                )}

                {/* Sort dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs font-bold px-4 py-2 pr-8 rounded-full border border-[#E2EAE5] text-[#3d4a42] bg-white hover:border-[#003C32] focus:outline-none focus:ring-1 focus:ring-[#003C32] appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233d4a42' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 10px center',
                      backgroundSize: '12px',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    <option value="featured">Sort: Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Eye className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No products found for "{searchQuery}"</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                  {visibleProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      onWishlist={toggleWishlist}
                      isWishlisted={wishlist.has(product.id)}
                    />
                  ))}
                </div>

                {filteredProducts.length > 8 && (
                  <div className="flex justify-center mt-12">
                    <button
                      onClick={() => {
                        setShowAllProducts(!showAllProducts);
                        if (showAllProducts) {
                          // Optionally scroll back to product grid top
                          document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="px-8 py-3 border border-[#003C32] hover:bg-[#003C32] hover:text-white text-[#003C32] font-bold rounded-full text-sm transition-all shadow-sm"
                      data-testid="btn-view-all-products"
                    >
                      {showAllProducts ? "View Less" : "View All Products"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ── Pantry Promo Banner (Photo 3) ─────────────────────────────── */}
        <section id="offers" className="py-12 bg-[#FAF7F2] scroll-mt-28">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="relative rounded-[2rem] overflow-hidden shadow-sm flex flex-col md:flex-row min-h-[160px] bg-[#003C32]">
              {/* Left side: Lime green */}
              <div className="flex-1 bg-[#9AD62A] p-8 lg:p-10 flex flex-col justify-center">
                <h3 className="text-3xl lg:text-4xl font-black text-[#003C32] tracking-tight leading-none mb-3">
                  Stock Your Pantry,<br />Save More
                </h3>
                <p className="text-[#003C32]/80 text-sm font-semibold max-w-sm">
                  Special pricing on monthly grocery essentials.
                </p>
              </div>

              {/* Right side: Dark green */}
              <div className="md:w-[320px] lg:w-[380px] p-8 lg:p-10 flex flex-col justify-center items-start md:items-end text-white relative">
                <button
                  onClick={() => { document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="inline-flex items-center gap-2 border border-white hover:bg-white hover:text-[#003C32] text-white font-extrabold px-6 py-2.5 rounded-full text-sm transition-all mb-4 self-start md:self-auto"
                >
                  View Offers <ChevronRight className="w-4 h-4" />
                </button>
                <p className="text-white/60 text-xs font-semibold tracking-wide md:text-right">
                  Min. order ₹499 | Free delivery above ₹999
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Bulk Orders Section (Photo 4) ──────────────────────────────── */}
        <section id="bulk-orders" className="py-16 lg:py-24 bg-[#002822] text-white relative overflow-hidden scroll-mt-28">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#9AD62A_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative max-w-4xl mx-auto px-4 text-center flex flex-col items-center">
            <span className="inline-flex items-center text-[10px] font-extrabold uppercase tracking-[0.2em] border border-white/20 rounded-full px-4 py-1.5 mb-6 text-white/80">
              FOR BUSINESSES & INSTITUTIONS
            </span>

            <h2 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight">
              Buying in bulk?
            </h2>
            <p className="text-white/70 text-sm max-w-xl leading-relaxed mb-10">
              Get better pricing for restaurants, stores, hostels, offices and events. Trusted by 200+ local businesses.
            </p>

            {/* Icons grid */}
            <div className="grid grid-cols-5 gap-2 md:gap-8 w-full max-w-2xl mb-12">
              {[
                { icon: <UtensilsCrossed className="w-6 h-6 text-[#9AD62A]" />, label: "Restaurants" },
                { icon: <Hotel className="w-6 h-6 text-[#9AD62A]" />, label: "Hotels" },
                { icon: <Building2 className="w-6 h-6 text-[#9AD62A]" />, label: "Hostels" },
                { icon: <Building2 className="w-6 h-6 text-[#9AD62A]" />, label: "Offices" },
                { icon: <PartyPopper className="w-6 h-6 text-[#9AD62A]" />, label: "Events" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-white/80">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Button */}
            <button className="bg-[#9AD62A] hover:bg-[#8bc925] text-[#1D2B25] font-extrabold px-8 py-3.5 rounded-full text-sm transition-colors shadow-lg hover:shadow-xl mb-4">
              Request Bulk Pricing
            </button>

            <p className="text-xs text-white/50 font-semibold">
              Call us: +91 98765 43210
            </p>
          </div>
        </section>

        {/* ── Why Asian Cart ─────────────────────────────────────────────── */}
        <section id="about-us" className="py-16 lg:py-20 bg-[#FAF7F2] scroll-mt-28">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[#57BF3C] font-bold text-xs uppercase tracking-[0.2em] mb-3">Our Commitment</p>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-[#003C32] mb-6">
                  Why Asian Cart?
                </h2>
                <div className="space-y-4">
                  {[
                    { title: "Directly Sourced", desc: "Our products bypass middlemen — we work directly with trusted farms and manufacturers across India." },
                    { title: "Quality Assured", desc: "Every batch is tested and quality-checked before dispatch. If it's not good enough for us, it won't reach you." },
                    { title: "Freshness Guaranteed", desc: "We maintain fast inventory turnover so you always receive fresh stock — not old warehouse stock." },
                    { title: "Transparent Pricing", desc: "No hidden fees. Our prices reflect actual cost + a fair margin — you always know what you're paying for." },
                    { title: "Excellent Support", desc: "Real people available via WhatsApp and email. We resolve any issue within 24 hours, guaranteed." },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#9AD62A] flex items-center justify-center mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-[#1D2B25]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#1D2B25]">{item.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl overflow-hidden aspect-square lg:aspect-auto lg:h-[500px] shadow-lg">
                <img
                  src="/why-asian-cart.png"
                  alt="Why Asian Cart"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&q=80&w=700";
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ──────────────────────────────────────────────── */}
        <section className="py-16 lg:py-20 bg-[#FAF7F2]">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-[#57BF3C] font-bold text-xs uppercase tracking-[0.2em] mb-3">Happy Customers</p>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-[#003C32]">What Our Customers Say</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2EAE5]"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5 italic">"{t.review}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#003C32] text-white flex items-center justify-center text-sm font-extrabold">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#1D2B25]">{t.name}</div>
                      <div className="text-xs text-gray-400">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Newsletter ─────────────────────────────────────────────────── */}
        <section className="py-16 bg-[#003C32] text-white">
          <div className="max-w-2xl mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold mb-3">Stay in the Loop</h2>
            <p className="text-white/70 text-sm mb-8">
              Get exclusive offers, new arrivals, and seasonal deals delivered straight to your inbox.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); toast({ title: "Thanks! You're subscribed 🎉", duration: 2500 }); }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#9AD62A] text-sm"
                data-testid="input-newsletter"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#9AD62A] hover:bg-[#8bc925] text-[#1D2B25] font-bold rounded-full text-sm transition-colors whitespace-nowrap"
                data-testid="btn-subscribe"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer id="contact" className="bg-[#1D2B25] text-white py-14 scroll-mt-28">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {/* Brand */}
              <div className="col-span-2 lg:col-span-1">
                <img
                  src="/asian-cart-logo.png"
                  alt="Asian Cart"
                  className="h-12 object-contain mb-4 brightness-0 invert"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <p className="text-sm text-white/60 leading-relaxed mb-5">
                  Premium Indian grocery and trader marketplace. Sourced directly, delivered fresh.
                </p>
                <div className="flex gap-3">
                  {["WhatsApp", "Instagram", "Facebook"].map((s) => (
                    <a key={s} href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#9AD62A] hover:text-[#1D2B25] flex items-center justify-center text-xs font-bold transition-all">
                      {s[0]}
                    </a>
                  ))}
                </div>
              </div>

              {/* Links */}
              {[
                { title: "Quick Links", links: ["Home", "Shop", "Categories", "Offers", "About Us", "Contact"] },
                { title: "Categories", links: ["Rice & Flour", "Grains & Pulses", "Pantry Staples", "Dry Fruits & Nuts", "Perfumes", "Daily Essentials"] },
                { title: "Support", links: ["Track My Order", "Returns & Refunds", "Bulk Orders", "FAQs", "Privacy Policy", "Terms of Service"] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white/80">{col.title}</h4>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-white/40">© 2025 Asian Cart. All rights reserved.</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40 mr-2">We accept:</span>
                {["VISA", "MC", "UPI", "PayPal"].map((p) => (
                  <span key={p} className="text-[10px] font-bold px-2.5 py-1 bg-white/10 rounded text-white/60">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* ── Cart Drawer ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Cart header */}
              <div className="flex items-center justify-between p-5 border-b border-[#E2EAE5]">
                <h3 className="font-extrabold text-lg text-[#003C32] flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Shopping Basket
                  {cartCount > 0 && (
                    <span className="text-sm bg-[#003C32] text-white w-6 h-6 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-1.5 hover:bg-[#F0F5F2] rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Cart items */}
              <div className="flex-1 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <span className="text-5xl mb-4">🛒</span>
                    <p className="font-bold text-[#1D2B25] mb-2">Your basket is empty</p>
                    <p className="text-sm text-gray-400 mb-6">Add some products to get started</p>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="px-6 py-3 bg-[#003C32] text-white rounded-full text-sm font-semibold hover:bg-[#002f27] transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-[#F0F5F2]">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 p-5">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover border border-[#E2EAE5] flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=120";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-[#1D2B25] truncate">{item.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.weight} · ₹{item.price}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              className="w-7 h-7 rounded-lg border border-[#E2EAE5] flex items-center justify-center text-gray-500 hover:border-[#003C32] transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="w-7 h-7 rounded-lg border border-[#E2EAE5] flex items-center justify-center text-gray-500 hover:border-[#003C32] transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-extrabold text-sm text-[#003C32]">₹{item.price * item.quantity}</div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="mt-2 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-[#E2EAE5] p-5 space-y-4">
                  {/* Coupon */}
                  {!appliedCoupon ? (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code (e.g. WELCOME10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 px-3.5 py-2.5 border border-[#E2EAE5] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#003C32]"
                        data-testid="input-coupon"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-[#003C32] text-white text-xs font-bold rounded-xl hover:bg-[#002f27] transition-colors"
                        data-testid="btn-apply-coupon"
                      >
                        Apply
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between bg-[#F0F9F0] border border-[#9AD62A]/40 rounded-xl p-3">
                      <div className="text-xs">
                        <span className="font-bold text-[#003C32]">✓ {appliedCoupon.code}</span>
                        <span className="text-gray-500 ml-2">–₹{appliedCoupon.discountAmount} saved!</span>
                      </div>
                      <button
                        onClick={() => { setAppliedCoupon(null); setCouponCode(""); }}
                        className="text-red-500 text-xs font-semibold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-xs text-red-500">{couponError}</p>}

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#1D2B25]">₹{cartSubtotal}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-[#57BF3C] font-semibold">
                        <span>Discount</span>
                        <span>–₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-500">
                      <span>Delivery</span>
                      <span className="text-[#57BF3C] font-semibold">
                        {cartSubtotal >= 999 ? "FREE" : "₹99"}
                      </span>
                    </div>
                    <div className="flex justify-between font-extrabold text-[#003C32] text-base pt-2 border-t border-[#E2EAE5]">
                      <span>Total</span>
                      <span>₹{cartTotal + (cartSubtotal < 999 ? 99 : 0)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 bg-[#003C32] hover:bg-[#002f27] text-white font-bold rounded-2xl transition-colors text-sm"
                    data-testid="btn-proceed-checkout"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Wishlist Drawer ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {wishlistOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setWishlistOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Wishlist header */}
              <div className="flex items-center justify-between p-5 border-b border-[#E2EAE5]">
                <h3 className="font-extrabold text-lg text-[#003C32] flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  My Wishlist
                  {wishlist.size > 0 && (
                    <span className="text-sm bg-[#003C32] text-white w-6 h-6 rounded-full flex items-center justify-center font-bold">
                      {wishlist.size}
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => setWishlistOpen(false)}
                  className="p-1.5 hover:bg-[#F0F5F2] rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Wishlist items */}
              <div className="flex-1 overflow-y-auto">
                {wishlist.size === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <span className="text-5xl mb-4">❤️</span>
                    <p className="font-bold text-[#1D2B25] mb-2">Your wishlist is empty</p>
                    <p className="text-sm text-gray-400 mb-6">Tap the heart on products you love to save them here.</p>
                    <button
                      onClick={() => setWishlistOpen(false)}
                      className="px-6 py-3 bg-[#003C32] text-white rounded-full text-sm font-semibold hover:bg-[#002f27] transition-colors"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-[#F0F5F2]">
                    {products
                      .filter((p) => wishlist.has(p.id))
                      .map((item) => (
                        <div key={item.id} className="flex gap-4 p-5">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover border border-[#E2EAE5] flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=120";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-[#1D2B25] truncate">{item.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{item.weight} · ₹{item.price}</p>
                            <div className="flex items-center gap-2 mt-3">
                              <button
                                onClick={() => {
                                  addToCart(item);
                                }}
                                className="bg-[#003C32] hover:bg-[#002f27] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" /> Add to Basket
                              </button>
                              <button
                                onClick={() => toggleWishlist(item.id)}
                                className="text-xs text-red-600 hover:text-red-700 font-bold px-3 py-1.5"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Auth Modal ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {authOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setAuthOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Tabs */}
                <div className="flex gap-1 bg-[#F0F5F2] p-1 rounded-2xl mb-6">
                  {(["signin", "signup"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => { setAuthTab(tab); setAuthError(""); }}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        authTab === tab
                          ? "bg-[#003C32] text-white shadow-sm"
                          : "text-gray-500 hover:text-[#003C32]"
                      }`}
                    >
                      {tab === "signin" ? "Sign In" : "Create Account"}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  {authTab === "signup" && (
                    <div>
                      <label className="text-xs font-bold text-[#1D2B25] block mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 border border-[#E2EAE5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003C32]"
                        data-testid="input-auth-name"
                      />
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-bold text-[#1D2B25] block mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border border-[#E2EAE5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003C32]"
                      data-testid="input-auth-email"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#1D2B25] block mb-1.5">Password</label>
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-[#E2EAE5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003C32]"
                      data-testid="input-auth-password"
                    />
                  </div>

                  {authError && (
                    <div className="text-xs text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
                      {authError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3.5 bg-[#003C32] hover:bg-[#002f27] disabled:opacity-60 text-white font-bold rounded-2xl transition-colors text-sm"
                    data-testid="btn-auth-submit"
                  >
                    {authLoading ? "Please wait..." : authTab === "signin" ? "Sign In" : "Create Account"}
                  </button>

                </form>

                <button
                  onClick={() => setAuthOpen(false)}
                  className="absolute top-5 right-5 p-1.5 hover:bg-[#F0F5F2] rounded-full text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Live Order Toast ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showLiveOrder && (
          <motion.div
            initial={{ opacity: 0, x: -30, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="fixed bottom-6 left-6 z-40 bg-white border border-[#E2EAE5] rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 max-w-xs"
          >
            <div className="w-8 h-8 bg-[#9AD62A] rounded-full flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4 text-[#1D2B25]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#1D2B25] truncate">
                {LIVE_ORDERS[liveOrderIdx].item}
              </p>
              <p className="text-[10px] text-gray-400">
                Ordered from {LIVE_ORDERS[liveOrderIdx].city} · {LIVE_ORDERS[liveOrderIdx].time}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
