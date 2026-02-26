import { featuredProducts } from "@/lib/productData";
import { useQuoteStore } from "@/lib/quoteStore";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Check, Ship } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FeaturedProducts = () => {
  const addItem = useQuoteStore((s) => s.addItem);
  const items = useQuoteStore((s) => s.items);
  const { toast } = useToast();

  const handleAdd = (product: typeof featuredProducts[0]) => {
    const added = addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      origin: product.origin,
      image: product.image,
    });
    if (added) {
      toast({ title: "Added to Quote", description: `${product.name} added to your quotation list.` });
    } else {
      toast({ title: "Already Added", description: "This product is already in your quotation list.", variant: "destructive" });
    }
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-secondary text-sm font-semibold uppercase tracking-widest">
            Featured Products
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
            Top <span className="text-primary">Export</span> Products
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => {
            const isAdded = items.some((i) => i.id === product.id);
            return (
              <div key={product.id} className="glass-card overflow-hidden group hover-lift gradient-border">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-background/80 backdrop-blur-sm text-xs font-medium text-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-primary" />
                    {product.origin}
                  </div>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-secondary/20 backdrop-blur-sm text-xs font-medium text-secondary flex items-center gap-1">
                    <Ship className="w-3 h-3" />
                    {product.port}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-foreground text-lg">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 font-body line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-4">
                    <Button
                      size="sm"
                      className={`w-full gap-2 rounded-lg ${isAdded ? '' : 'btn-gradient-teal'}`}
                      variant={isAdded ? "secondary" : "default"}
                      onClick={() => handleAdd(product)}
                      disabled={isAdded}
                    >
                      {isAdded ? (
                        <><Check className="w-4 h-4" /> Added to Quote</>
                      ) : (
                        <><Plus className="w-4 h-4" /> Add to Quote</>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
