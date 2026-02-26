import { Link } from "react-router-dom";
import { Globe, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 relative overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-50" />
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Logo size="md" linkTo="/" />
            </div>
            <p className="text-sm text-muted-foreground font-body">
              Your trusted partner for agricultural and industrial exports across 80+ countries.
            </p>
            <div className="flex gap-3 mt-4">
              <Link to="/register" className="btn-gradient-gold text-xs px-4 py-2 rounded-lg font-medium inline-flex items-center gap-1 hover:scale-105 transition-transform">
                Get Started <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Home", path: "/" },
                { label: "Products", path: "/products" },
                { label: "About Us", path: "/about" },
                { label: "Contact", path: "/contact" },
                { label: "Trade Cart", path: "/quote" },
                { label: "Buyer Registration", path: "/register" },
                { label: "Supplier Registration", path: "/supplier" },
              ].map((link) => (
                <Link key={link.path} to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors font-body">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Categories</h4>
            <div className="flex flex-col gap-2">
              {["Rice", "Pulses", "Grains", "Edible Oils", "Chemicals", "Paper Products", "Scrap Materials"].map((cat) => (
                <span key={cat} className="text-sm text-muted-foreground font-body hover:text-secondary transition-colors cursor-pointer">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                <Mail className="w-4 h-4 text-primary" /> info@Canadian EST Trading Company.com
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                <Phone className="w-4 h-4 text-secondary" /> +1-431-990-6055
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                <MapPin className="w-4 h-4 text-accent" /> Dubai, UAE
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                <Globe className="w-4 h-4 text-primary" /> www.Canadian EST Trading Company.com
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/20 text-center">
          <p className="text-sm text-muted-foreground font-body">
            © 2026 Canadian EST Trading Company. All rights reserved. | Enterprise Commodity Trading Platform
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
