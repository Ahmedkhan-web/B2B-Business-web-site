import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Globe, Users, Award, TrendingUp, Shield, Truck, Target, Eye, Heart, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const timeline = [
  { year: "2010", title: "Founded in Dubai", desc: "Started as a small agricultural trading firm with a focus on rice exports." },
  { year: "2013", title: "Expanded to 20 Countries", desc: "Grew our network to serve buyers across the Middle East and Asia." },
  { year: "2016", title: "ISO 9001 Certified", desc: "Achieved ISO certification for quality management systems." },
  { year: "2019", title: "Industrial Products", desc: "Expanded into chemicals, paper products, and scrap materials." },
  { year: "2022", title: "Digital Platform Launch", desc: "Launched Canadian EST Trading Company digital platform for seamless global trading." },
  { year: "2025", title: "80+ Countries", desc: "Now serving buyers and suppliers across 80+ countries with 500+ partners." },
];

const values = [
  { icon: Target, title: "Integrity", desc: "We operate with the highest ethical standards in every transaction and relationship." },
  { icon: Eye, title: "Transparency", desc: "Full visibility into sourcing, pricing, quality, and logistics at every step." },
  { icon: Heart, title: "Partnership", desc: "We build long-term relationships, not just transactions. Your success is ours." },
  { icon: Shield, title: "Quality", desc: "Rigorous quality checks and certifications ensure only the best products reach you." },
];

const About = () => {
  // Video ID for the new YouTube video
  const videoId = "T7ysfqLxD90"; // Updated to the new video

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* About Hero Section */}
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="text-secondary text-sm font-semibold uppercase tracking-widest">About Us</span>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-3">
                Bridging <span className="text-primary">Global</span> Trade
              </h1>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto font-body text-lg">
                Canadian EST Trading Company connects verified suppliers with international buyers, specializing in agricultural commodities and industrial products across 80+ countries.
              </p>
            </div>
          </ScrollReveal>

          {/* Video Section - YouTube Embed */}
          <ScrollReveal delay={100}>
            <div className="mb-16 max-w-4xl mx-auto">
              <div className="relative rounded-xl overflow-hidden shadow-lg" style={{ paddingTop: "56.25%" }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                  title="Canadian EST Trading Company Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Stats Section */}
          <ScrollReveal delay={200}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              {[
                { value: "15+", label: "Years Experience" },
                { value: "80+", label: "Countries Served" },
                { value: "500+", label: "Active Partners" },
                { value: "$2B+", label: "Trade Volume" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-6 text-center gradient-border">
                  <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-gold-light">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1 font-body">{stat.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-5xl mx-auto">
            {[ 
              { icon: Target, title: "Our Mission", text: "To democratize international commodity trade by providing a trusted, transparent, and efficient platform that connects suppliers with buyers worldwide, ensuring quality products reach every corner of the globe.", color: "text-primary", bg: "bg-primary/10" },
              { icon: Eye, title: "Our Vision", text: "To become the world's most trusted B2B commodity trading platform, setting the standard for quality, reliability, and innovation in international trade — one container at a time.", color: "text-secondary", bg: "bg-secondary/10" },
            ].map((item, idx) => (
              <ScrollReveal key={item.title} delay={idx * 100}>
                <div className="glass-card p-8 gradient-border hover-lift h-full">
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground font-body mt-3">{item.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Core Values */}
          <div className="mb-16">
            <ScrollReveal>
              <div className="text-center mb-10">
                <span className="text-secondary text-sm font-semibold uppercase tracking-widest">Our Values</span>
                <h2 className="text-3xl font-bold text-foreground mt-3">What We <span className="text-primary">Stand For</span></h2>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {values.map((v, idx) => (
                <ScrollReveal key={v.title} delay={idx * 100}>
                  <div className="glass-card p-6 text-center hover-lift gradient-border h-full">
                    <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                      <v.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{v.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 font-body">{v.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-16">
            <ScrollReveal>
              <div className="text-center mb-10">
                <span className="text-secondary text-sm font-semibold uppercase tracking-widest">Our Journey</span>
                <h2 className="text-3xl font-bold text-foreground mt-3">Growing <span className="text-primary">Together</span></h2>
              </div>
            </ScrollReveal>
            <div className="max-w-3xl mx-auto space-y-4">
              {timeline.map((t, idx) => (
                <ScrollReveal key={t.year} delay={idx * 80}>
                  <div className="glass-card p-5 flex items-start gap-4 hover-lift gradient-border">
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl btn-gradient-gold flex items-center justify-center">
                      <span className="font-bold text-sm">{t.year}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{t.title}</h3>
                      <p className="text-sm text-muted-foreground font-body mt-1">{t.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;