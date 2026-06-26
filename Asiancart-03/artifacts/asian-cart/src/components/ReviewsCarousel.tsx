import useEmblaCarousel from "embla-carousel-react";
import { Star } from "lucide-react";
import { useEffect } from "react";

export function ReviewsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  useEffect(() => {
    if (!emblaApi) return;
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);
    return () => clearInterval(autoplay);
  }, [emblaApi]);

  const reviews = [
    {
      name: "Priya Sharma",
      label: "Home Shopper, Mumbai",
      text: "Asian Cart has been my go-to for daily groceries. The quality of their basmati rice and dals is simply unmatched. Pricing is much better than local supermarkets."
    },
    {
      name: "Rahul Verma",
      label: "Owner, Verma Caterers",
      text: "We buy in bulk for our catering business. Their wholesale pricing is excellent, and the supply is extremely reliable. Never missed a delivery deadline."
    },
    {
      name: "Anita Desai",
      label: "Home Shopper, Delhi",
      text: "Love their premium dry fruits and imported perfumes collection. The packaging is always pristine and the products feel very fresh."
    },
    {
      name: "Chef Kumar",
      label: "Head Chef, The Spice Route",
      text: "The consistency in their spice quality is why we stick with Asian Cart. When you're running a commercial kitchen, you need suppliers you can trust."
    },
    {
      name: "Sanjay Gupta",
      label: "Retail Store Owner",
      text: "Sourcing for my kirana store has become 10x easier. I order everything through their B2B portal and the margins are fantastic."
    },
    {
      name: "Meera Reddy",
      label: "Home Shopper, Bangalore",
      text: "I was skeptical about buying premium groceries online, but Asian Cart proved me wrong. Everything from atta to cooking oil is top tier."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">What Our Customers Say</h2>
      </div>

      <div className="relative w-full max-w-[1400px] mx-auto">
        <div className="overflow-hidden px-4 md:px-12" ref={emblaRef}>
          <div className="flex -ml-4">
            {reviews.map((review, i) => (
              <div key={i} className="pl-4 min-w-[300px] md:min-w-[400px] flex-[0_0_80%] md:flex-[0_0_33.33%]">
                <div className="bg-muted/30 border border-border rounded-2xl p-6 md:p-8 h-full flex flex-col">
                  <div className="flex gap-1 mb-6 text-accent">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-foreground/80 text-lg mb-8 flex-1 italic leading-relaxed">"{review.text}"</p>
                  <div>
                    <p className="font-bold text-foreground">{review.name}</p>
                    <p className="text-sm text-muted-foreground font-medium">{review.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}