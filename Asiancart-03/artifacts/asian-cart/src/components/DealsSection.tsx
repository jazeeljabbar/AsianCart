import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "./ui/button";

interface DealsSectionProps {
  onAdd: () => void;
}

export function DealsSection({ onAdd }: DealsSectionProps) {
  const deals = [
    { id: 1, name: "India Gate Basmati Rice", size: "5kg", price: 420, mrp: 499, off: 16, img: "/deal-1.png" },
    { id: 2, name: "Sona Masoori Rice", size: "5kg", price: 310, mrp: 375, off: 17, img: "/deal-2.png" },
    { id: 3, name: "Multigrain Atta", size: "5kg", price: 285, mrp: 340, off: 16, img: "/deal-3.png" },
    { id: 4, name: "Toor Dal", size: "1kg", price: 135, mrp: 160, off: 16, img: "/deal-4.png" },
    { id: 5, name: "Chana Dal", size: "1kg", price: 115, mrp: 140, off: 18, img: "/deal-5.png" },
    { id: 6, name: "Premium Cashews", size: "500g", price: 390, mrp: 480, off: 19, img: "/deal-6.png" },
    { id: 7, name: "Almonds", size: "500g", price: 320, mrp: 399, off: 20, img: "/deal-7.png" },
    { id: 8, name: "Arabian Oud Perfume", size: "100ml", price: 1299, mrp: 1899, off: 32, img: "/deal-8.png" }
  ];

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-10 md:mb-14">
        <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">Today's Best Deals</h2>
      </div>

      <div className="w-full overflow-x-auto pb-8 hide-scrollbar px-4 md:px-6 -mx-4 md:mx-0">
        <div className="flex gap-6 min-w-max">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} onAdd={onAdd} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DealCard({ deal, onAdd }: { deal: any, onAdd: () => void }) {
  const [qty, setQty] = useState(1);

  return (
    <div className="w-[260px] md:w-[280px] bg-card border border-card-border rounded-xl p-4 flex flex-col relative group hover:shadow-lg transition-shadow" data-testid={`card-deal-${deal.id}`}>
      <div className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded z-10 shadow-sm">
        {deal.off}% OFF
      </div>
      
      <div className="relative w-full aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
        <img src={deal.img} alt={deal.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 p-4" />
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-foreground text-lg leading-tight mb-1">{deal.name}</h3>
        <p className="text-muted-foreground text-sm mb-3">{deal.size}</p>
        
        <div className="flex items-center gap-2 mb-4 mt-auto">
          <span className="font-black text-xl text-primary">₹{deal.price}</span>
          <span className="text-sm text-muted-foreground line-through">₹{deal.mrp}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-between border border-border rounded-md h-10 w-[100px] flex-shrink-0">
            <button 
              className="w-8 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              onClick={() => setQty(Math.max(1, qty - 1))}
              disabled={qty <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-semibold text-sm">{qty}</span>
            <button 
              className="w-8 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors"
              onClick={() => setQty(qty + 1)}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <Button 
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-10 font-bold"
            onClick={onAdd}
            data-testid={`button-add-${deal.id}`}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}