import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center pt-24 pb-20">
        <div className="glass-card p-12 text-center max-w-md gradient-border">
          <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-gold-light mb-4">404</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Page Not Found</h2>
          <p className="text-muted-foreground font-body mb-6">The page you're looking for doesn't exist or has been moved.</p>
          <Link to="/">
            <button className="btn-gradient-gold px-6 py-2.5 rounded-lg font-semibold inline-flex items-center gap-2 hover:scale-105 transition-transform">
              <Home className="w-4 h-4" /> Back to Home
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
