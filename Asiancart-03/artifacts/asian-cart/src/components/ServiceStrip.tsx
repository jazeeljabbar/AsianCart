import { ShieldCheck, Star, PackageOpen, Undo2, HeadphonesIcon } from "lucide-react";

export function ServiceStrip() {
  const services = [
    { icon: ShieldCheck, label: "Secure Checkout" },
    { icon: Star, label: "Quality Assured" },
    { icon: PackageOpen, label: "Bulk Pricing Available" },
    { icon: Undo2, label: "Easy Returns" },
    { icon: HeadphonesIcon, label: "Quick Support" },
  ];

  return (
    <section className="w-full bg-white border-b border-border py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-4">
          {services.map((service, i) => (
            <div key={i} className="flex items-center gap-3 group" data-testid={`service-badge-${i}`}>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <service.icon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-foreground/80">{service.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}