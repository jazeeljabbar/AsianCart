import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store, UtensilsCrossed, Building2, PartyPopper } from "lucide-react";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  businessType: z.string().min(1, "Please select a business type"),
  requirement: z.string().min(10, "Please describe your requirement")
});

export function B2BSection() {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      businessType: "",
      requirement: ""
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Quote Request Sent!",
      description: "Our team will contact you within 24 hours.",
    });
    form.reset();
  }

  const icons = [
    { icon: Store, label: "Retail Stores" },
    { icon: UtensilsCrossed, label: "Restaurants" },
    { icon: Building2, label: "Offices & Hostels" },
    { icon: PartyPopper, label: "Events & Caterers" }
  ];

  return (
    <section className="w-full bg-primary py-16 md:py-24 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <div className="text-primary-foreground">
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Need stock for your business?</h2>
            <p className="text-lg text-primary-foreground/80 font-medium mb-10 max-w-lg">
              Get bulk pricing for retail stores, caterers, restaurants, hostels, offices and events. Reliable supply, always on time.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              {icons.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-accent">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-lg">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-10 shadow-2xl">
            <h3 className="text-2xl font-black text-foreground mb-6">Request Bulk Pricing</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" className="bg-muted/50 border-transparent focus-visible:ring-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80">Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+91 98765 43210" className="bg-muted/50 border-transparent focus-visible:ring-primary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80">Business Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-muted/50 border-transparent focus:ring-primary">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="retail">Retail Store</SelectItem>
                            <SelectItem value="restaurant">Restaurant / Cafe</SelectItem>
                            <SelectItem value="caterer">Caterer / Event</SelectItem>
                            <SelectItem value="hostel">Hostel / PG</SelectItem>
                            <SelectItem value="office">Office / Corporate</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="requirement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Requirement Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us what items you need and approximate quantities..." 
                          className="resize-none bg-muted/50 border-transparent focus-visible:ring-primary h-24" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-lg font-bold mt-2" data-testid="button-submit-b2b">
                  Request Pricing
                </Button>
              </form>
            </Form>
          </div>

        </div>
      </div>
    </section>
  );
}