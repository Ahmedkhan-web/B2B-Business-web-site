import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { categories, allProducts } from "@/lib/productData";
import { useQuoteStore } from "@/lib/quoteStore";
import { useAdminStore } from "@/lib/adminStore";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Plus, 
  Check, 
  Ship, 
  ArrowLeft, 
  Eye,
  X,
  Package,
  Calendar,
  Award,
  Truck,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRef, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const addItem = useQuoteStore((s) => s.addItem);
  const items = useQuoteStore((s) => s.items);
  const hiddenProducts = useAdminStore((s) => s.hiddenProducts);
  const { toast } = useToast();
  
  const [selectedProduct, setSelectedProduct] = useState<typeof allProducts[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeCategory !== "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeCategory]);

  const visibleProducts = allProducts.filter((p) => !hiddenProducts.includes(p.id));

  const handleAdd = (product: typeof allProducts[0]) => {
    const added = addItem({
      id: product.id, 
      name: product.name, 
      category: product.category,
      origin: product.origin, 
      image: product.image,
    });
    if (added) {
      toast({ 
        title: "Added to Trade Cart", 
        description: `${product.name} has been added to your cart.`,
        duration: 3000,
      });
    } else {
      toast({ 
        title: "Already in Cart", 
        description: "This product is already in your trade cart.", 
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleViewDetails = (product: typeof allProducts[0]) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleCategorySelect = (id: string) => {
    setSearchParams({ category: id });
  };

  const resetFilter = () => {
    setSearchParams({});
  };

  const handleImageError = (productId: string) => {
    setImageError(prev => ({ ...prev, [productId]: true }));
  };

  const selectedCatData = categories.find(c => c.id === activeCategory);

  const getCategoryCount = (categoryId: string) => {
    return visibleProducts.filter(p => p.category === categoryId).length;
  };

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          {/* Header Section */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full mb-4">
                <span className="text-primary text-sm font-medium uppercase tracking-wider">
                  Global Trade Catalog
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mt-3">
                Our <span className="text-primary">Products</span>
              </h1>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-sm sm:text-base">
                {activeCategory === "all" 
                  ? "Browse our comprehensive selection of premium export products."
                  : `Discover our premium selection of ${selectedCatData?.name}.`}
              </p>
            </div>
          </ScrollReveal>

          {activeCategory === "all" ? (
            /* --- CATEGORY GRID --- */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {categories.map((cat, idx) => (
                <ScrollReveal key={cat.id} delay={idx * 100}>
                  <div 
                    onClick={() => handleCategorySelect(cat.id)}
                    className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/20 transition-all duration-300 cursor-pointer"
                  >
                    {/* Image Container */}
                    <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-muted">
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-category.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                      
                      {/* Count Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm border-0 px-3 py-1.5">
                          <Package className="w-3.5 h-3.5 mr-1.5" />
                          {getCategoryCount(cat.id)} items
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {cat.name}
                      </h2>
                      <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                        {cat.description}
                      </p>
                      
                      <Button 
                        variant="outline"
                        className="w-full border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        Browse Collection
                      </Button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            /* --- VARIETIES VIEW --- */
            <div ref={activeRef} className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              
              {/* Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b">
                <button 
                  onClick={resetFilter} 
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Categories</span>
                </button>
                
                <div className="text-sm text-muted-foreground">
                  Showing {visibleProducts.filter(p => p.category === activeCategory).length} products
                </div>
              </div>

              {/* Category Header */}
              <div className="flex items-start gap-6 p-6 bg-card/50 rounded-xl border">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img 
                    src={selectedCatData?.image} 
                    className="w-full h-full object-cover" 
                    alt={selectedCatData?.name}
                  />
                </div>
                <div>
                  <Badge variant="outline" className="mb-2 border-primary/30 text-xs">
                    Selected Category
                  </Badge>
                  <h2 className="text-2xl font-semibold mb-1">{selectedCatData?.name}</h2>
                  <p className="text-muted-foreground text-sm">
                    {selectedCatData?.description}
                  </p>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {visibleProducts
                  .filter((p) => p.category === activeCategory)
                  .map((product) => {
                    const isAdded = items.some((i) => i.id === product.id);
                    
                    return (
                      <div 
                        key={product.id} 
                        className="group bg-card rounded-lg border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden"
                      >
                        {/* Image Container */}
                        <div className="relative aspect-square overflow-hidden bg-muted">
                          {!imageError[product.id] ? (
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              onError={() => handleImageError(product.id)}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-12 h-12 text-muted-foreground/30" />
                            </div>
                          )}
                          
                          {/* Origin Badge */}
                          <div className="absolute top-3 left-3">
                            <Badge variant="secondary" className="bg-background/90 border-0 text-xs py-1">
                              <MapPin className="w-3 h-3 mr-1" /> 
                              {product.origin}
                            </Badge>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-medium text-foreground mb-1 line-clamp-1">
                            {product.name}
                          </h3>
                          
                          <p className="text-muted-foreground text-xs line-clamp-2 mb-3">
                            {product.description}
                          </p>

                          {/* Port Info */}
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                            <Ship className="w-3.5 h-3.5" /> 
                            <span className="truncate">{product.port}</span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button 
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs border-border hover:bg-muted/50"
                              onClick={() => handleViewDetails(product)}
                            >
                              <FileText className="w-3.5 h-3.5 mr-1.5" />
                              Details
                            </Button>
                            
                            <Button 
                              size="sm"
                              className={`flex-1 text-xs ${
                                isAdded 
                                  ? 'bg-muted text-muted-foreground hover:bg-muted/80' 
                                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
                              }`}
                              onClick={() => handleAdd(product)} 
                              disabled={isAdded}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5 mr-1.5" />
                                  Added
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                                  Add to Cart
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Empty State */}
              {visibleProducts.filter((p) => p.category === activeCategory).length === 0 && (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Products Available</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    This category currently has no products.
                  </p>
                  <Button onClick={resetFilter} variant="outline">
                    Browse Other Categories
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Details Dialog - Fixed: removed hideCloseButton prop */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden">
          {selectedProduct && (
            <>
              {/* Header with Image - Removed duplicate close button */}
              <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-muted">
                {!imageError[selectedProduct.id] ? (
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(selectedProduct.id)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                <div className="absolute bottom-4 left-6">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-background/90 border-0">
                      {selectedProduct.category}
                    </Badge>
                    <Badge variant="secondary" className="bg-background/90 border-0">
                      <MapPin className="w-3 h-3 mr-1" />
                      {selectedProduct.origin}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold">
                    {selectedProduct.name}
                  </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="details" className="mt-6">
                  <TabsList className="grid w-full grid-cols-3 h-10">
                    <TabsTrigger value="details" className="text-xs sm:text-sm">Details</TabsTrigger>
                    <TabsTrigger value="specs" className="text-xs sm:text-sm">Specifications</TabsTrigger>
                    <TabsTrigger value="shipping" className="text-xs sm:text-sm">Shipping</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="mt-4 space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {selectedProduct.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-primary mb-1">
                          <Award className="w-4 h-4" />
                          <span className="text-xs font-medium">Grade</span>
                        </div>
                        <p className="text-sm">Premium Export</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-primary mb-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs font-medium">Availability</span>
                        </div>
                        <p className="text-sm">Year-round</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="specs" className="mt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b text-sm">
                        <span className="text-muted-foreground">Origin</span>
                        <span className="font-medium">{selectedProduct.origin}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b text-sm">
                        <span className="text-muted-foreground">Packaging</span>
                        <span className="font-medium">Export Standard</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b text-sm">
                        <span className="text-muted-foreground">Shelf Life</span>
                        <span className="font-medium">6-8 months</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b text-sm">
                        <span className="text-muted-foreground">MOQ</span>
                        <span className="font-medium">1×20ft Container</span>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="shipping" className="mt-4">
                    <div className="space-y-4">
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Ship className="w-5 h-5 text-primary" />
                          <span className="font-medium">Port Information</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium">Main Port:</span> {selectedProduct.port}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Shipping Terms:</span> FOB, CIF
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="w-4 h-4 text-primary" />
                        <span>Lead time: 2-3 weeks after confirmation</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <Separator className="my-6" />

                {/* Action Buttons in Dialog */}
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    className={`flex-1 ${
                      items.some(i => i.id === selectedProduct.id) 
                        ? 'bg-muted text-muted-foreground hover:bg-muted/80' 
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                    onClick={() => {
                      handleAdd(selectedProduct);
                      setIsDialogOpen(false);
                    }}
                    disabled={items.some(i => i.id === selectedProduct.id)}
                  >
                    {items.some(i => i.id === selectedProduct.id) ? (
                      'Already in Cart'
                    ) : (
                      'Add to Trade Cart'
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Products;