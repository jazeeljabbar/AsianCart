import { Link } from "wouter";
import { Instagram, Facebook, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary pt-16 md:pt-24 pb-8 text-primary-foreground/80">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6 bg-white p-2 rounded">
              <img src="/asiancart-logo.png" alt="Asian Cart" className="h-10 object-contain" />
            </Link>
            <p className="text-sm font-medium mb-6 leading-relaxed">
              Premium Indian groceries, dry fruits, and bulk essentials delivered across India. Trusted by homes and businesses alike.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Shop Categories</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/" className="hover:text-accent transition-colors">Rice & Flour</Link></li>
              <li><Link href="/" className="hover:text-accent transition-colors">Grains & Pulses</Link></li>
              <li><Link href="/" className="hover:text-accent transition-colors">Cooking Oils & Spices</Link></li>
              <li><Link href="/" className="hover:text-accent transition-colors">Dry Fruits & Nuts</Link></li>
              <li><Link href="/" className="hover:text-accent transition-colors">Premium Perfumes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Customer Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/" className="hover:text-accent transition-colors">Track Order</Link></li>
              <li><Link href="/" className="hover:text-accent transition-colors">Shipping Policy</Link></li>
              <li><Link href="/" className="hover:text-accent transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/" className="hover:text-accent transition-colors">FAQ</Link></li>
              <li><Link href="/" className="hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/" className="hover:text-accent transition-colors">Careers</Link></li>
              <li><Link href="/" className="hover:text-accent transition-colors">Blog</Link></li>
              <li><Link href="/" className="hover:text-accent transition-colors">Press</Link></li>
              <li><Link href="/" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Contact & B2B</h4>
            <ul className="space-y-4 text-sm font-medium mb-8">
              <li className="flex gap-3"><MapPin className="w-5 h-5 text-accent flex-shrink-0" /> 123 Trader Market, New Delhi, India</li>
              <li className="flex gap-3"><Phone className="w-5 h-5 text-accent flex-shrink-0" /> +91 1800 123 4567</li>
              <li className="flex gap-3"><Mail className="w-5 h-5 text-accent flex-shrink-0" /> bulk@asiancart.in</li>
            </ul>
            <div className="bg-white/10 p-4 rounded-lg text-center border border-white/20">
              <p className="text-white font-bold mb-2">Download Our App</p>
              <p className="text-xs mb-3">Get exclusive app-only deals</p>
              <div className="flex gap-2 justify-center">
                <div className="h-10 px-3 bg-black rounded flex items-center justify-center text-xs font-bold text-white border border-white/20 w-full cursor-pointer hover:bg-black/80">App Store</div>
                <div className="h-10 px-3 bg-black rounded flex items-center justify-center text-xs font-bold text-white border border-white/20 w-full cursor-pointer hover:bg-black/80">Google Play</div>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-medium">© 2024 Asian Cart. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['Visa', 'Mastercard', 'UPI', 'Paytm', 'PhonePe'].map((method) => (
              <span key={method} className="px-3 py-1 bg-white/10 rounded text-xs font-bold text-white border border-white/10">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}