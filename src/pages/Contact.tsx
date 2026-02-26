import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, Phone as PhoneIcon, MapPin, Globe, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { countries } from "@/lib/countryData";
import { validateEmail, validatePhone, getPhoneRule } from "@/lib/validationUtils";
import { useAdminStore } from "@/lib/adminStore";

const Contact = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const countryInfo = countries.find((c) => c.name === selectedCountry);
  const phoneCode = countryInfo?.phoneCode || "";
  const countryCode = countryInfo?.code || "";
  const addContactMessage = useAdminStore((s) => s.addContactMessage);

  const handlePhoneChange = (value: string) => {
    const numbersOnly = value.replace(/\D/g, '');
    setPhone(numbersOnly);
    if (numbersOnly && countryCode) {
      const result = validatePhone(numbersOnly, countryCode);
      setPhoneError(result.valid ? "" : result.message);
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailResult = validateEmail(email);
    if (!emailResult.valid) { setEmailError(emailResult.message); return; }
    if (phone) {
      const phoneResult = validatePhone(phone, countryCode);
      if (!phoneResult.valid) { setPhoneError(phoneResult.message); return; }
    }

    addContactMessage({
      name, email, company: company || undefined,
      phone: phone ? `${phoneCode} ${phone}` : '',
      country: selectedCountry, subject, message,
    });

    setShowSuccess(true);
    setName(""); setEmail(""); setCompany(""); setPhone("");
    setSubject(""); setMessage(""); setSelectedCountry("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-secondary text-sm font-semibold uppercase tracking-widest">Contact Us</span>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                Get in <span className="text-primary">Touch</span>
              </h1>
              <p className="text-muted-foreground font-body mt-2">Reach out for trade inquiries, partnerships, or support.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal>
              <div className="glass-card p-8 gradient-border">
                <h3 className="font-semibold text-foreground text-lg mb-6">Send us a message</h3>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <Input placeholder="Full Name *" value={name} onChange={(e) => setName(e.target.value)} className="bg-muted/50 border-border/50 rounded-lg" required />
                  <div>
                    <Input placeholder="Email *" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(""); }} onBlur={() => { if (email) { const r = validateEmail(email); setEmailError(r.valid ? "" : r.message); } }} className={`bg-muted/50 border-border/50 rounded-lg ${emailError ? 'border-destructive' : ''}`} required />
                    {emailError && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{emailError}</p>}
                  </div>
                  <Input placeholder="Company Name (Optional)" value={company} onChange={(e) => setCompany(e.target.value)} className="bg-muted/50 border-border/50 rounded-lg" />

                  <Select value={selectedCountry} onValueChange={(val) => { setSelectedCountry(val); setPhone(""); setPhoneError(""); }}>
                    <SelectTrigger className="bg-muted/50 border-border/50 rounded-lg">
                      <SelectValue placeholder="Country *" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {countries.map((c) => (
                        <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div>
                    <div className="flex gap-2">
                      <div className="w-24 flex items-center justify-center bg-muted/50 border border-border/50 rounded-lg px-3 text-sm text-foreground font-medium">
                        <PhoneIcon className="w-3 h-3 mr-1 text-muted-foreground" />
                        {phoneCode || "—"}
                      </div>
                      <Input placeholder="Phone Number" type="tel" value={phone} onChange={(e) => handlePhoneChange(e.target.value)} className={`bg-muted/50 border-border/50 rounded-lg flex-1 ${phoneError ? 'border-destructive' : ''}`} />
                    </div>
                    {phoneError && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{phoneError}</p>}
                    {countryCode && !phoneError && phone && <p className="text-xs text-secondary mt-1">Format: {getPhoneRule(countryCode).label}</p>}
                  </div>

                  <Input placeholder="Subject *" value={subject} onChange={(e) => setSubject(e.target.value)} className="bg-muted/50 border-border/50 rounded-lg" required />
                  <Textarea placeholder="Your Message *" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="bg-muted/50 border-border/50 rounded-lg" required />
                  <Button type="submit" className="w-full btn-gradient-gold rounded-lg font-semibold hover:scale-[1.02] transition-transform" disabled={!name || !email || !subject || !message || !selectedCountry}>
                    Send Message
                  </Button>
                </form>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: "info@Canadian EST Trading Company.com", color: "text-primary" },
                  { icon: PhoneIcon, label: "Phone", value: "+1-431-990-6055", color: "text-secondary" },
                  { icon: MapPin, label: "Head Office", value: "Canada, Winnipeg, MB CA", color: "text-accent" },
                  { icon: Globe, label: "Website", value: "www.Canadian EST Trading Company.com", color: "text-primary" },
                ].map((item) => (
                  <div key={item.label} className="glass-card p-6 flex items-center gap-4 hover-lift gradient-border">
                    <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-body">{item.label}</p>
                      <p className="font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
                <div className="glass-card p-6 gradient-border">
                  <div className="aspect-video rounded-lg bg-muted/30 flex items-center justify-center">
                    <div className="text-center">
                      <Globe className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground font-body">Interactive Map</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="glass-card gradient-border max-w-sm text-center">
          <DialogHeader>
            <DialogTitle className="sr-only">Message Sent</DialogTitle>
          </DialogHeader>
          <CheckCircle2 className="w-16 h-16 text-secondary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground">Message Sent Successfully!</h3>
          <p className="text-muted-foreground font-body mt-2">
            Our team will contact you within 24 hours.
          </p>
          <Button onClick={() => setShowSuccess(false)} className="mt-4 btn-gradient-gold rounded-lg font-semibold">
            Close
          </Button>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Contact;
