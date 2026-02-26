import heroVideo from "@/assets/hero-video.mp4";
import heroBg from "@/assets/hero-bg.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, end, duration]);

  return <div ref={ref}>{count.toLocaleString()}{suffix}</div>;
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={heroBg}
          className="w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 gradient-overlay" />
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-secondary/5 blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-accent/5 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="animate-fade-in-up">
            <span className="inline-block px-5 py-2 rounded-full border border-primary/40 text-primary text-sm font-medium mb-6 animate-shimmer backdrop-blur-sm">
              ✦ Trusted by International Buyers Worldwide
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground leading-tight animate-fade-in-up">
            Global Agricultural &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-gold-light to-primary">
              Industrial Export
            </span>{" "}
            Solutions
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-body animate-fade-in-up-delay">
            Rice, Pulses, Grains, Chemicals, Paper & More — Connecting suppliers
            to buyers across multiple countries with{" "}
            <span className="text-secondary">enterprise-grade</span> reliability.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up-delay-2">
            <Link to="/products">
              <Button size="lg" className="gap-2 text-base px-8 btn-gradient-gold rounded-xl font-semibold hover:scale-105 transition-transform">
                View Products <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/quote">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-base px-8 border-secondary/50 text-secondary hover:bg-secondary/10 rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                <FileText className="w-4 h-4" /> Request Quotation
              </Button>
            </Link>
          </div>

          {/* Animated Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { end: 500, suffix: "+", label: "Global Buyers" },
              { end: 80, suffix: "+", label: "Countries" },
              { end: 200, suffix: "+", label: "Products" },
              { end: 50000, suffix: "+", label: "Containers Shipped" },
            ].map((stat) => (
              <div key={stat.label} className="text-center glass-card p-4 rounded-xl gradient-border">
                <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-gold-light">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-muted-foreground mt-1 font-body">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
