import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { categories, allProducts } from "@/lib/productData";
import { useQuoteStore } from "@/lib/quoteStore";
import { useAdminStore } from "@/lib/adminStore";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Check, Ship, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRef, useEffect } from "react";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const addItem = useQuoteStore((s) => s.addItem);
  const items = useQuoteStore((s) => s.items);
  const hiddenProducts = useAdminStore((s) => s.hiddenProducts);
  const { toast } = useToast();
  
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeCategory !== "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeCategory]);

  const visibleProducts = allProducts.filter((p) => !hiddenProducts.includes(p.id));

  const handleAdd = (product: typeof allProducts[0]) => {
    const added = addItem({
      id: product.id, name: product.name, category: product.category,
      origin: product.origin, image: product.image,
    });
    if (added) {
      toast({ title: "Added to Trade Cart", description: `${product.name} added.` });
    } else {
      toast({ title: "Already Added", description: "Product already in your trade cart.", variant: "destructive" });
    }
  };

  const handleCategorySelect = (id: string) => {
    setSearchParams({ category: id });
  };

  const resetFilter = () => {
    setSearchParams({});
  };

  const selectedCatData = categories.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-secondary text-sm font-semibold uppercase tracking-widest border-b border-secondary/30 pb-1">Global Trade Catalog</span>
              <h1 className="text-3xl md:text-5xl font-bold mt-3">
                Our <span className="text-primary">Products</span>
              </h1>
              <p className="text-muted-foreground mt-4 font-body max-w-xl mx-auto">
                {activeCategory === "all" 
                  ? "Select a category to explore our premium export varieties." 
                  : `Exploring our premium selection of ${selectedCatData?.name}.`}
              </p>
            </div>
          </ScrollReveal>

          {activeCategory === "all" ? (
            /* --- CATEGORY GRID --- */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((cat, idx) => (
                <ScrollReveal key={cat.id} delay={idx * 100}>
                  <div 
                    onClick={() => handleCategorySelect(cat.id)}
                    className="glass-card overflow-hidden group cursor-pointer hover-lift flex flex-col h-full border border-border/40 shadow-sm transition-all duration-300"
                  >
                    {/* Deep Scale Image Container */}
                    <div className="relative h-72 w-full overflow-hidden bg-muted/50">
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                        className="absolute inset-[-1px] w-[calc(100%+2px)] h-[calc(100%+2px)] object-cover transition-transform duration-1000 ease-out group-hover:scale-125" 
                      />
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow bg-card">
                      <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{cat.name}</h2>
                      <p className="text-muted-foreground text-sm font-body mb-6 line-clamp-3 leading-relaxed">
                        {cat.description}
                      </p>
                      <div className="mt-auto">
                        <Button className="w-full rounded-lg btn-gradient-gold font-bold shadow-md">
                          View Varieties
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            /* --- VARIETIES VIEW --- */
            <div ref={activeRef} className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
              
              {/* Professional Back Button Navigation */}
              <div className="flex items-center justify-start border-b border-border/50 pb-6">
                <button 
                  onClick={resetFilter} 
                  className="group flex items-center gap-3 py-2 px-4 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-primary transition-all duration-300 shadow-sm border border-border/30"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1.5" />
                  <span className="font-bold uppercase tracking-widest text-[11px]">Back to Products</span>
                </button>
              </div>

              {/* Selected Category Feature Card */}
              <div className="glass-card overflow-hidden gradient-border flex flex-col md:flex-row gap-0 items-stretch bg-muted/5">
                <div className="w-full md:w-1/3 h-64 md:h-auto overflow-hidden bg-muted">
                  <img 
                    src={selectedCatData?.image} 
                    className="w-full h-full object-cover" 
                    alt={selectedCatData?.name}
                  />
                </div>
                <div className="flex-1 p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase tracking-widest">
                    Selected Category
                  </div>
                  <h2 className="text-4xl font-bold text-foreground mb-4">{selectedCatData?.name}</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed font-body">
                    {selectedCatData?.description}
                  </p>
                </div>
              </div>

              {/* Varieties Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
                {visibleProducts
                  .filter((p) => p.category === activeCategory)
                  .map((product) => {
                    const isAdded = items.some((i) => i.id === product.id);
                    return (
                      <div key={product.id} className="glass-card overflow-hidden group hover-lift border border-border/40 bg-card/50 shadow-sm transition-all">
                        {/* Deep Scale Variety Image */}
                        <div className="relative h-52 w-full overflow-hidden bg-muted/50">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            loading="lazy" 
                            style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                            className="absolute inset-[-1px] w-[calc(100%+2px)] h-[calc(100%+2px)] object-cover transition-transform duration-1000 ease-out group-hover:scale-125" 
                          />
                          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-background/95 backdrop-blur-sm text-[10px] font-bold uppercase flex items-center gap-1.5 shadow-lg border border-border/30 z-20">
                            <MapPin className="w-3 h-3 text-primary" /> {product.origin}
                          </div>
                        </div>

                        <div className="p-5 flex flex-col h-52">
                          <h3 className="font-bold text-foreground text-base mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                          <p className="text-xs text-muted-foreground font-body line-clamp-3 mb-4 flex-grow leading-normal">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground/80 mb-5 bg-muted/30 p-1.5 rounded-md">
                            <Ship className="w-3.5 h-3.5 text-secondary" /> 
                            <span>Main Port: {product.port}</span>
                          </div>
                          <Button 
                            size="sm" 
                            className={`w-full gap-2 rounded-lg transition-all font-bold ${isAdded ? 'bg-muted text-muted-foreground' : 'btn-gradient-teal shadow-md'}`} 
                            variant={isAdded ? "secondary" : "default"} 
                            onClick={() => handleAdd(product)} 
                            disabled={isAdded}
                          >
                            {isAdded ? <><Check className="w-4 h-4" /> Added to Cart</> : <><Plus className="w-4 h-4" /> Add to Cart</>}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;