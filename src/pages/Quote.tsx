import React, { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useQuoteStore } from "@/lib/quoteStore";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  ShoppingBag, 
  Minus, 
  Plus, 
  ArrowRight, 
  Globe, 
  Scale, 
  Box,
  Anchor,
  FileText,
  MessageSquareQuote,
  CheckCircle2,
  Package
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Packaging options
const packagingOptions = [
  { value: "PP_BAGS", label: "PP Bags" },
  { value: "JUTE_BAGS", label: "Jute Bags" },
  { value: "BULK", label: "Bulk" },
  { value: "CARTONS", label: "Cartons" },
  { value: "DRUMS", label: "Drums" },
  { value: "FLEXI_BAGS", label: "Flexi Bags" },
];

const CartPage = () => {  
  const { items, removeItem, clearItems, updateQuantity, updateNotes, updateFCLUnits, updatePackaging } = useQuoteStore();

  const logisticsSummary = useMemo(() => {
    const containers = items.reduce((sum, i) => sum + i.quantity, 0);
    const weight = containers * 28.5; 
    return { containers, weight };
  }, [items]);

  // Handler to sync both quantity and FCL units if they are distinct in your store
  const handleQuantityUpdate = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity);
    if (updateFCLUnits) {
      updateFCLUnits(id, newQuantity);
    }
  };

  // Handler for packaging change
  const handlePackagingChange = (id: string, value: string) => {
    if (updatePackaging) {
      updatePackaging(id, value);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12 gap-4 sm:gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-px w-8 bg-primary"></span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Manifest Configuration</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                Trade <span className="text-primary">Cart</span>
              </h1>
              <p className="text-muted-foreground mt-3 text-sm sm:text-base md:text-lg">
                Review commodities and provide specific trade instructions.
              </p>
            </div>
            {items.length > 0 && (
              <Button 
                variant="outline" 
                onClick={clearItems} 
                className="text-destructive border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-all w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Discard Manifest
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <ScrollReveal>
              <div className="glass-card p-6 sm:p-10 md:p-20 text-center gradient-border bg-muted/5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-muted-foreground/50" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-foreground tracking-tight">Your manifest is empty</h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-sm mx-auto px-4">Select commodities from our catalog to begin your quotation request.</p>
                <Link to="/products" className="block sm:inline-block">
                  <Button className="btn-gradient-gold px-6 sm:px-8 md:px-12 h-10 sm:h-12 md:h-14 rounded-xl font-bold text-sm sm:text-base md:text-lg w-full sm:w-auto">
                    Browse Commodities
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
              
              {/* Left Side: Commodity Catalog Entries */}
              <div className="lg:col-span-8 space-y-4 sm:space-y-6 lg:space-y-8">
                {items.map((item) => (
                  <div key={item.id} className="glass-card p-0 overflow-hidden hover:border-primary/30 transition-all duration-500 bg-white/5 border-white/10">
                    <div className="flex flex-col">
                      
                      {/* Top Section: Visuals and Main Info */}
                      <div className="flex flex-col md:flex-row border-b border-white/5">
                        <div className="w-full md:w-48 lg:w-64 relative">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-48 sm:h-56 md:h-full min-h-[180px] md:min-h-[200px] object-cover" 
                          />
                          <div className="absolute top-4 left-4">
                            <span className="px-2 sm:px-3 py-1 bg-primary text-primary-foreground text-[8px] sm:text-[10px] font-black rounded-full uppercase">
                              {item.origin}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 p-4 sm:p-6 space-y-3 sm:space-y-4">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1">
                              <h3 className="font-bold text-xl sm:text-2xl text-foreground mb-1 tracking-tight break-words">{item.name}</h3>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-primary/80">
                                <span className="flex items-center gap-1 sm:gap-1.5"><Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5"/> {item.category}</span>
                                <span className="flex items-center gap-1 sm:gap-1.5"><CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5"/> Quality Grade A</span>
                              </div>
                            </div>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => removeItem(item.id)} 
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                          </div>

                          {/* Technical Specifications Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                            <div className="p-1.5 sm:p-2 rounded-lg bg-white/5 border border-white/5">
                              <p className="text-[7px] sm:text-[8px] text-muted-foreground font-bold uppercase">HS CODE</p>
                              <p className="text-[9px] sm:text-[11px] font-bold text-foreground tracking-tighter truncate">PRE-ASSIGNED</p>
                            </div>
                            <div className="p-1.5 sm:p-2 rounded-lg bg-white/5 border border-white/5">
                              <p className="text-[7px] sm:text-[8px] text-muted-foreground font-bold uppercase">NET WEIGHT</p>
                              <p className="text-[9px] sm:text-[11px] font-bold text-foreground">{(item.quantity * 28.5).toFixed(1)} MT</p>
                            </div>
                            <div className="p-1.5 sm:p-2 rounded-lg bg-white/5 border border-white/5">
                              <p className="text-[7px] sm:text-[8px] text-muted-foreground font-bold uppercase">UNIT TYPE</p>
                              <p className="text-[9px] sm:text-[11px] font-bold text-foreground italic text-primary">20ft FCL</p>
                            </div>
                            <div className="p-1.5 sm:p-2 rounded-lg bg-white/5 border border-white/5">
                              <p className="text-[7px] sm:text-[8px] text-muted-foreground font-bold uppercase">PACKAGING</p>
                              {/* Packaging Dropdown */}
                              <Select
                                value={item.packaging || "PP_BAGS"}
                                onValueChange={(value) => handlePackagingChange(item.id, value)}
                              >
                                <SelectTrigger className="h-6 sm:h-7 text-[9px] sm:text-[11px] font-bold border-0 bg-transparent p-0 focus:ring-0 focus:ring-offset-0">
                                  <SelectValue placeholder="Select packaging" />
                                </SelectTrigger>
                                <SelectContent>
                                  {packagingOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="text-xs">
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Section: Interactive User Input */}
                      <div className="p-4 sm:p-6 bg-white/[0.02]">
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex items-center gap-2 text-primary">
                            <MessageSquareQuote className="w-3 h-3 sm:w-4 sm:h-4" />
                            <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-tighter">Custom Requirements & Logistics Notes</h4>
                          </div>
                          
                          <textarea 
                            value={item.notes || ""}
                            onChange={(e) => updateNotes(item.id, e.target.value)}
                            placeholder="Type specific instructions..."
                            className="w-full min-h-[80px] sm:min-h-[100px] bg-black/20 border border-white/10 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/50 transition-all resize-none"
                          />
                          
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-2">
                            <p className="text-[8px] sm:text-[10px] text-muted-foreground/60 italic font-medium">
                              * These notes will be attached to your formal LC Quotations.
                            </p>
                            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                              <div className="flex items-center gap-1 bg-muted/20 border border-white/10 rounded-xl p-1 shadow-inner">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-background/20" 
                                  onClick={() => handleQuantityUpdate(item.id, Math.max(1, item.quantity - 1))}
                                >
                                  <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                </Button>
                                <span className="w-8 sm:w-10 text-center font-bold text-foreground text-base sm:text-lg">{item.quantity}</span>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-background/20" 
                                  onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                                >
                                  <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                </Button>
                              </div>
                              <span className="text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-widest shrink-0">FCL Units</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* Right Side: High-Contrast Trade Summary */}
              <div className="lg:col-span-4 mt-6 lg:mt-0">
                <div className="sticky top-28 overflow-hidden rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] border border-white/10 shadow-2xl bg-[#0a0f1c] text-white">
                  <div className="bg-gradient-to-br from-primary/30 to-transparent p-6 sm:p-8 lg:p-10 pb-4 sm:pb-5 lg:pb-6">
                    <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                      <div className="p-2 sm:p-3 bg-primary/20 rounded-xl sm:rounded-2xl">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary" />
                      </div>
                      <h3 className="font-extrabold text-xl sm:text-2xl tracking-tight">Trade Summary</h3>
                    </div>
                    <p className="text-slate-400 text-[10px] sm:text-xs font-medium uppercase tracking-widest">Global Manifest Summary</p>
                  </div>
                  
                  <div className="p-6 sm:p-8 lg:p-10 pt-4 sm:pt-5 lg:pt-6 space-y-6 sm:space-y-8">
                    <div className="space-y-4 sm:space-y-5 border-b border-white/5 pb-6 sm:pb-8">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm font-semibold text-slate-400 flex items-center gap-2 sm:gap-3">
                          <Box className="w-3 h-3 sm:w-4 sm:h-4 text-primary" /> Commodities
                        </span>
                        <span className="font-black text-lg sm:text-xl text-white">{items.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm font-semibold text-slate-400 flex items-center gap-2 sm:gap-3">
                          <Anchor className="w-3 h-3 sm:w-4 sm:h-4 text-primary" /> Logistics Volume
                        </span>
                        <span className="font-black text-lg sm:text-xl text-primary">{logisticsSummary.containers} FCL</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm font-semibold text-slate-400 flex items-center gap-2 sm:gap-3">
                          <Scale className="w-3 h-3 sm:w-4 sm:h-4 text-primary" /> Total Mass
                        </span>
                        <span className="font-black text-lg sm:text-xl text-white">{logisticsSummary.weight.toLocaleString()} MT</span>
                      </div>
                    </div>

                    <Link to="/register" className="block">
                      <Button className="w-full btn-gradient-teal h-12 sm:h-14 lg:h-20 rounded-xl sm:rounded-[1.5rem] font-black text-base sm:text-lg lg:text-xl shadow-2xl group hover:scale-[1.02] transition-all duration-300">
                        Proceed to Portal
                        <ArrowRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:translate-x-2 transition-transform" />
                      </Button>
                    </Link>

                    <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-primary/5 rounded-xl sm:rounded-2xl border border-primary/10">
                      <p className="text-[8px] sm:text-[10px] leading-relaxed text-slate-400 font-semibold italic text-center w-full">
                        Final export documents and port-specific pricing will be generated upon trade document verification.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;