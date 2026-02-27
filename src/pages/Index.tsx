import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesGrid from "@/components/CategoriesGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Globe, Shield, Truck, BarChart3, Leaf, Award, ArrowRight, CheckCircle, Users, Ship, Handshake, Star, CreditCardIcon, CogIcon, PackageIcon } from "lucide-react";
import { Link } from "react-router-dom";

// Updated tradeProcess with 8 steps
const tradeProcess = [
  { step: "01", title: "Browse & Select", desc: "Explore our catalog of 100+ verified export commodities across 11 categories.", icon: Globe },
  { step: "02", title: "Request Quotation", desc: "Add products to your trade cart and submit a detailed quotation request.", icon: Ship },
  { step: "03", title: "Receive Quote", desc: "Our trade team reviews your request and sends a competitive quotation within 24 hours.", icon: BarChart3 },
  { step: "04", title: "Order Confirm", desc: "Approve the quotation and complete the payment.", icon: Truck },
  { step: "05", title: "Payment", desc: "Securely pay via bank transfer or online payment.", icon: CreditCardIcon },
  { step: "06", title: "Processing", desc: "We handle and prepare your order for shipment.", icon: CogIcon },
  { step: "07", title: "Shipping", desc: "Fast and safe delivery to your location.", icon: PackageIcon },
  { step: "08", title: "Review", desc: "Share your feedback and rate your experience.", icon: Star },
];

const testimonials = [
  { name: "Ahmed Al-Rashid", company: "Gulf Foods Trading LLC", country: "UAE", text: "Canadian EST Trading Company has been our primary source for premium basmati rice. Their quality consistency and reliable shipping have made them indispensable to our business.", rating: 5 },
  { name: "Kim Sung-Ho", company: "Korea Grain Imports Co.", country: "South Korea", text: "Excellent service and competitive pricing. The quotation process is seamless, and their team is always responsive to our specific requirements.", rating: 5 },
  { name: "Maria Fernandez", company: "Buenos Aires Commodities", country: "Argentina", text: "We've been sourcing industrial chemicals through Canadian EST Trading Company for 3 years. Their ISO certifications and quality assurance give us complete confidence.", rating: 5 },
];

const partners = [
  "Mundra Port Authority", "JNPT Mumbai", "Dubai Chamber of Commerce", "International Trade Council", "Bureau Veritas", "SGS Certified"
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      
      <ScrollReveal>
        <CategoriesGrid />
      </ScrollReveal>

      {/* Why Choose Us */}
      <section className="py-20 section-gradient">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-secondary text-sm font-semibold uppercase tracking-widest">Why Choose Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                Your Reliable <span className="text-primary">Trade Partner</span>
              </h2>
              <p className="text-muted-foreground mt-3 font-body max-w-xl mx-auto">
                With 15+ years of experience in international commodity trading, we deliver quality, reliability, and trust.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[ 
              { icon: Globe, title: "Global Network", desc: "Access to verified suppliers and buyers across 80+ countries worldwide.", color: "text-primary" },
              { icon: Shield, title: "Quality Assured", desc: "Every product meets international standards with certified quality checks.", color: "text-secondary" },
              { icon: Truck, title: "Reliable Logistics", desc: "End-to-end shipping solutions with real-time tracking and documentation.", color: "text-accent" },
              { icon: BarChart3, title: "Market Intelligence", desc: "Real-time commodity pricing and market trend analysis for informed decisions.", color: "text-primary" },
              { icon: Leaf, title: "Sustainable Trade", desc: "Eco-certified supply chains with carbon footprint tracking.", color: "text-secondary" },
              { icon: Award, title: "ISO Certified", desc: "Full compliance with international trade standards and regulations.", color: "text-accent" },
            ].map((item, idx) => (
              <ScrollReveal key={item.title} delay={idx * 100}>
                <div className="glass-card p-8 text-center group hover-lift gradient-border h-full">
                  <div className="w-14 h-14 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 font-body">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <ScrollReveal>
        <FeaturedProducts />
      </ScrollReveal>

      {/* How It Works */}
      <section className="py-20 section-gradient">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="text-secondary text-sm font-semibold uppercase tracking-widest">How It Works</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                Simple <span className="text-primary">Trade</span> Process
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tradeProcess.map((item, idx) => (
              <ScrollReveal key={item.step} delay={idx * 100}>
                <div className="glass-card p-6 text-center hover-lift gradient-border relative h-full">
                  <div className="text-4xl font-bold text-primary/20 mb-3">{item.step}</div>
                  <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 font-body">{item.desc}</p>
                  {idx < tradeProcess.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/40" />
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-secondary text-sm font-semibold uppercase tracking-widest">Testimonials</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                What Our <span className="text-primary">Clients</span> Say
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <ScrollReveal key={t.name} delay={idx * 100}>
                <div className="glass-card p-6 hover-lift gradient-border h-full">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground font-body italic">"{t.text}"</p>
                  <div className="mt-4 pt-4 border-t border-border/30">
                    <p className="font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground font-body">{t.company} • {t.country}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 section-gradient">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-10">
              <span className="text-secondary text-sm font-semibold uppercase tracking-widest">Trusted Partners</span>
              <h2 className="text-2xl font-bold text-foreground mt-3">Our <span className="text-primary">Network</span></h2>
            </div>
          </ScrollReveal>
          <div className="flex flex-wrap justify-center gap-4">
            {partners.map((p, idx) => (
              <ScrollReveal key={p} delay={idx * 50}>
                <div className="glass-card px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground font-body flex items-center gap-2">
                  <Handshake className="w-4 h-4 text-primary" />
                  {p}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-80" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "$2B+", label: "Trade Volume", icon: BarChart3 },
              { value: "500+", label: "Global Buyers", icon: Users },
              { value: "80+", label: "Countries", icon: Globe },
              { value: "50K+", label: "Containers Shipped", icon: Ship },
            ].map((stat, idx) => (
              <ScrollReveal key={stat.label} delay={idx * 100}>
                <div className="text-center glass-card p-6 gradient-border">
                  <stat.icon className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-gold-light">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1 font-body">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-80" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
        </div>
        <ScrollReveal>
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Start Trading <span className="text-primary">Globally</span>?
            </h2>
            <p className="text-muted-foreground font-body max-w-xl mx-auto mb-8">
              Join 500+ international buyers and suppliers on the most trusted commodity trading platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <button className="btn-gradient-gold px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-transform">
                  Register as Buyer
                </button>
              </Link>
              <Link to="/supplier">
                <button className="btn-gradient-teal px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-transform">
                  Register as Supplier
                </button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
