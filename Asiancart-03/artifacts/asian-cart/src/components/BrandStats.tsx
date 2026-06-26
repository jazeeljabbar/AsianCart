import { Box, Users, Truck, Clock } from "lucide-react";

export function BrandStats() {
  const stats = [
    { value: "10,000+", label: "Products Available", icon: Box },
    { value: "2,500+", label: "Trusted Supplier Network", icon: Users },
    { value: "Any Size", label: "Flexible Bulk Orders", icon: Truck },
    { value: "24/7", label: "Reliable Customer Support", icon: Clock }
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/20 border-b border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 text-primary">
                <stat.icon className="w-8 h-8" />
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-accent mb-2">{stat.value}</h3>
              <p className="text-foreground/70 font-semibold text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}