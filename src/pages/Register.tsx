import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  UserPlus, Globe, Phone, AlertCircle, ShoppingCart,
  MessageSquare, Package, User, Send, Plus, LayoutDashboard, X, 
  Lock, Globe2, Building2, CheckCircle2, Mail, ArrowRight, ClipboardCheck, Scale, Archive, Fingerprint,
  Search, ShieldCheck, MapPin, Edit3, Save, Trash2, Briefcase, Calendar, DollarSign, FileText, Hash, Eye, CheckCircle
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { countries, CountryInfo } from "@/lib/countryData"; 
import { validatePhone } from "@/lib/validationUtils";
import { useAdminStore } from "@/lib/adminStore";
import { useAuthStore } from "@/lib/authStore";
import { useQuoteStore } from "@/lib/quoteStore";
import { Link } from "react-router-dom";

// Import the QuoteItem type from quoteStore
import { QuoteItem } from "@/lib/quoteStore";

// Define props type for MessageCenter
interface MessageCenterProps {
  messagesList: Array<{
    id: number;
    text: string;
    sender: string;
    time: string;
  }>;
  setMessagesList: React.Dispatch<React.SetStateAction<Array<{
    id: number;
    text: string;
    sender: string;
    time: string;
  }>>>;
}

// Define props type for ProfileSettings
interface ProfileSettingsProps {
  name: string;
  company: string;
  email: string;
  phone: string;
  phoneCode: string;
  profileData: {
    name: string;
    company: string;
    email: string;
    phone: string;
  };
  setProfileData: React.Dispatch<React.SetStateAction<{
    name: string;
    company: string;
    email: string;
    phone: string;
  }>>;
  isEditingProfile: boolean;
  setIsEditingProfile: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveProfile: () => void;
  showEmailVerification: boolean;
  setShowEmailVerification: React.Dispatch<React.SetStateAction<boolean>>;
  emailVerificationCode: string;
  setEmailVerificationCode: React.Dispatch<React.SetStateAction<string>>;
  handleVerifyEmail: () => void;
  handleSendVerificationCode: () => void;
  isEmailChanged: boolean;
  isEmailVerified: boolean;
  verifiedEmail: string;
  phoneError: string;
  setPhoneError: React.Dispatch<React.SetStateAction<string>>;
  countryCode: string;
  phoneLengths: number[];
}

// Define interface for application details with proper typing
interface ApplicationDetails {
  id: string;
  submissionDate: string;
  items: QuoteItem[];
  appCountry: string;
  appPort: string;
  loadingDate: string;
  status: string;
}

// Success Popup Component
const SuccessPopup = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
      <div className="bg-green-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-2xl shadow-2xl border border-green-400/30 flex items-center gap-3">
        <CheckCircle className="w-5 h-5" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

// Move MessageCenter outside of Register component
const MessageCenter = ({ messagesList, setMessagesList }: MessageCenterProps) => {
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesList]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      text: newMessage,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessagesList((prev) => [...prev, msg]);
    setNewMessage("");
  };

  const handleClearChat = () => {
    setMessagesList([
      { id: 1, text: "Welcome to the Global Portal support. How can we help?", sender: "support", time: "09:00 AM" }
    ]);
  };

  return (
    <div className="glass-card flex flex-col h-[600px] overflow-hidden gradient-border">
      <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary" /> Logistics Support</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-1 rounded-full font-bold uppercase">Online</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-muted-foreground hover:text-destructive"
            onClick={handleClearChat}
            title="Clear chat history"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/20">
        {messagesList.map((msg) => (
          <div key={msg.id} className={`flex flex-col gap-1 ${msg.sender === "user" ? "items-end ml-auto" : "items-start"} max-w-[80%]`}>
            <div className={`p-3 rounded-2xl text-sm ${msg.sender === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted text-foreground rounded-tl-none"}`}>
              {msg.text}
            </div>
            <span className="text-[9px] text-muted-foreground px-1">{msg.sender === "user" ? "You" : "Support"} • {msg.time}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
        <Input 
          placeholder="Type your message..." 
          className="bg-black/40 border-white/10" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="submit" className="btn-gradient-gold px-4"><Send className="w-4 h-4" /></Button>
      </form>
    </div>
  );
};

// Application Details Modal Component
const ApplicationDetailsModal = ({ application, onClose }: { application: ApplicationDetails | null, onClose: () => void }) => {
  if (!application) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" /> Application Details
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-primary/5 rounded-xl">
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Application ID</p>
              <p className="font-mono text-sm font-bold">{application.id}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Submitted</p>
              <p className="text-sm font-bold">{application.submissionDate}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Status</p>
              <p className="text-sm font-bold text-yellow-500">{application.status}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Loading Date</p>
              <p className="text-sm font-bold">{application.loadingDate}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Destination Details</h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-black/40 rounded-xl">
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Country of Import</p>
                <p className="font-bold">{application.appCountry}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Import Port</p>
                <p className="font-bold">{application.appPort || "N/A"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Consignment Items</h3>
            <div className="space-y-4">
              {application.items.map((item, index) => (
                <div key={index} className="p-4 bg-black/40 rounded-xl border border-white/5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.category} • {item.grade}</p>
                    </div>
                    <span className="text-primary font-bold">{item.fclUnits} {item.unitType}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase">HS Code</p>
                      <p className="font-mono">{item.hsCode}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase">Net Weight</p>
                      <p>{item.netWeight}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase">Packaging</p>
                      <p>{item.packaging}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase">Origin</p>
                      <p>{item.origin}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 flex justify-end">
          <Button onClick={onClose} className="btn-gradient-gold">Close</Button>
        </div>
      </div>
    </div>
  );
};

// Move ProfileSettings outside of Register component
const ProfileSettings = ({ 
  name, 
  company, 
  email, 
  phone,
  phoneCode,
  profileData, 
  setProfileData, 
  isEditingProfile, 
  setIsEditingProfile,
  handleSaveProfile,
  showEmailVerification,
  setShowEmailVerification,
  emailVerificationCode,
  setEmailVerificationCode,
  handleVerifyEmail,
  handleSendVerificationCode,
  isEmailChanged,
  isEmailVerified,
  verifiedEmail,
  phoneError,
  setPhoneError,
  countryCode,
  phoneLengths
}: ProfileSettingsProps) => {
  
  const handlePhoneChange = (value: string) => {
    const numbersOnly = value.replace(/\D/g, '');
    setProfileData({...profileData, phone: numbersOnly});
    if (numbersOnly && countryCode && phoneLengths.length > 0) {
      const isValidLength = phoneLengths.includes(numbersOnly.length);
      setPhoneError(isValidLength ? "" : `Phone number must be ${phoneLengths.join(' or ')} digits`);
    } else {
      setPhoneError("");
    }
  };

  const isCurrentEmailVerified = verifiedEmail === profileData.email;

  return (
    <div className="space-y-6">
      <div className="glass-card p-8 gradient-border">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{name}</h3>
              <p className="text-muted-foreground flex items-center gap-2"><Building2 className="w-4 h-4" /> {company}</p>
            </div>
          </div>
          <Button 
            variant={isEditingProfile ? "default" : "outline"} 
            className={isEditingProfile ? "btn-gradient-teal" : "border-white/10"}
            onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
          >
            {isEditingProfile ? <><Save className="w-4 h-4 mr-2" /> Save</> : <><Edit3 className="w-4 h-4 mr-2" /> Edit</>}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Personal Information</h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Full Name</label>
                <Input 
                  disabled={!isEditingProfile} 
                  value={profileData.name} 
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
                  className="bg-white/5 border-white/10" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Email Address</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input 
                      disabled={!isEditingProfile} 
                      value={profileData.email} 
                      onChange={(e) => {
                        setProfileData({...profileData, email: e.target.value});
                      }} 
                      className={`bg-white/5 border-white/10 w-full ${isCurrentEmailVerified ? 'pr-10' : ''}`} 
                    />
                    {isCurrentEmailVerified && !isEditingProfile && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    )}
                  </div>
                  {isEditingProfile && profileData.email !== email && !isCurrentEmailVerified && !showEmailVerification && (
                    <Button 
                      type="button"
                      size="sm"
                      className="btn-gradient-teal whitespace-nowrap"
                      onClick={handleSendVerificationCode}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Verify Email
                    </Button>
                  )}
                  {isCurrentEmailVerified && isEditingProfile && (
                    <div className="flex items-center px-3 bg-green-500/10 text-green-500 rounded-lg text-sm font-medium">
                      <CheckCircle className="w-4 h-4 mr-1" /> Verified
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Phone Number</label>
                <div className="flex gap-2">
                  <div className="w-16 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-xs">
                    {phoneCode || "—"}
                  </div>
                  <Input 
                    disabled={!isEditingProfile} 
                    placeholder="Enter phone number"
                    type="tel"
                    value={profileData.phone} 
                    onChange={(e) => handlePhoneChange(e.target.value)} 
                    className="bg-white/5 border-white/10 flex-1" 
                  />
                </div>
                {phoneLengths.length > 0 && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Accepts {phoneLengths.join(' or ')} digits
                  </p>
                )}
                {phoneError && <p className="text-destructive text-[10px] mt-1">{phoneError}</p>}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Business Information</h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Company Name</label>
                <Input 
                  disabled={!isEditingProfile} 
                  value={profileData.company} 
                  onChange={(e) => setProfileData({...profileData, company: e.target.value})} 
                  className="bg-white/5 border-white/10" 
                />
              </div>
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary font-bold">Note:</span> Business country and city cannot be edited. Please contact support for changes.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {showEmailVerification && isEditingProfile && (
          <div className="mt-6 p-6 bg-primary/10 rounded-xl border border-primary/20 animate-in fade-in slide-in-from-top-2">
            <h4 className="text-sm font-bold flex items-center gap-2 mb-4">
              <Mail className="w-4 h-4 text-primary" /> Verify New Email Address
            </h4>
            <p className="text-xs text-muted-foreground mb-4">
              A verification code has been sent to {profileData.email}. Please enter it below.
            </p>
            <div className="flex gap-3">
              <Input 
                placeholder="Enter 6-digit code" 
                className="bg-black/40 border-white/10 text-center text-lg tracking-widest"
                maxLength={6}
                value={emailVerificationCode}
                onChange={(e) => setEmailVerificationCode(e.target.value.replace(/\D/g, ''))}
              />
              <Button 
                className="btn-gradient-teal"
                onClick={handleVerifyEmail}
                disabled={emailVerificationCode.length !== 6}
              >
                Verify
              </Button>
            </div>
          </div>
        )}

        {isEditingProfile && !showEmailVerification && (
          <div className="mt-6 flex gap-3 animate-in fade-in slide-in-from-top-2">
            <Button 
              className="btn-gradient-gold flex-1" 
              onClick={handleSaveProfile}
              disabled={(profileData.email !== email && !isCurrentEmailVerified) || !!phoneError}
            >
              Update Account
            </Button>
            <Button variant="ghost" onClick={() => {
              setIsEditingProfile(false); 
              setProfileData({name, company, email, phone});
              setShowEmailVerification(false);
              setEmailVerificationCode("");
            }}>Cancel</Button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/10">
          <Button variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive/10" onClick={() => window.location.reload()}>Logout</Button>
        </div>
      </div>

      <div className="glass-card p-6 border-l-4 border-gold">
        <div className="flex items-center gap-4">
          <ShieldCheck className="w-8 h-8 text-gold" />
          <div>
            <h4 className="font-bold">Account Verification</h4>
            <p className="text-xs text-muted-foreground">Your account is currently undergoing Tier 1 verification for global trade.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Register = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [step, setStep] = useState(1);
  const [view, setView] = useState("dashboard");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationDetails | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Stores
  const addBuyer = useAdminStore((s) => s.addBuyer);
  const register = useAuthStore((s) => s.register);
  const login = useAuthStore((s) => s.login);
  const { items: cartItems, clearItems } = useQuoteStore();

  // Registration State - Expanded with more fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [company, setCompany] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [importCountry, setImportCountry] = useState("");
  const [selectedPort, setSelectedPort] = useState("");
  const [currentVolume, setCurrentVolume] = useState("");
  
  // New registration fields
  const [businessType, setBusinessType] = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState("");
  const [taxId, setTaxId] = useState("");
  const [website, setWebsite] = useState("");
  const [reference, setReference] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  
  // Application State
  const [appCountry, setAppCountry] = useState("");
  const [appPort, setAppPort] = useState("");
  const [loadingDate, setLoadingDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Profile email verification
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");

  // --- NEW FUNCTIONAL STATES ---
  const [messagesList, setMessagesList] = useState([
    { id: 1, text: "Welcome to the Global Portal support. How can we help?", sender: "support", time: "09:00 AM" }
  ]);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ name: "", company: "", email: "", phone: "" });

  // Sync profile data when registration completes
  useEffect(() => {
    if (isRegistered) {
      setProfileData({ name, company, email, phone });
      setVerifiedEmail(email); // Set initial verified email
      setIsEmailVerified(true);
    }
  }, [isRegistered, name, company, email, phone]);

  const countryInfo = countries.find((c) => c.name === selectedCountry);
  const phoneCode = countryInfo?.phoneCode || "";
  const countryCode = countryInfo?.code || "";
  const phoneLengths = countryInfo?.phoneLength || [];
  const appAvailablePorts = countries.find((c) => c.name === appCountry)?.ports || [];
  const regAvailablePorts = countries.find((c) => c.name === importCountry)?.ports || [];

  const handlePhoneChange = (value: string) => {
    const numbersOnly = value.replace(/\D/g, '');
    setPhone(numbersOnly);
    if (numbersOnly && countryCode && phoneLengths.length > 0) {
      const isValidLength = phoneLengths.includes(numbersOnly.length);
      setPhoneError(isValidLength ? "" : `Phone number must be ${phoneLengths.join(' or ')} digits`);
    } else {
      setPhoneError("");
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const year = new Date(value).getFullYear();
    const currentYear = new Date().getFullYear();
    if (value) {
      if (year.toString().length > 4) { setDateError("Year cannot exceed 4 digits"); return; }
      if (year < currentYear) { setDateError(`Year cannot be earlier than ${currentYear}`); } 
      else { setDateError(""); }
    }
    setLoadingDate(value);
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!username) { setPasswordError("Username is required"); return; }
    if (username.length < 3) { setPasswordError("Username must be at least 3 characters"); return; }
    if (password.length < 8) { setPasswordError("Password must be at least 8 characters long"); return; }
    if (password !== confirmPassword) { setPasswordError("Passwords do not match"); return; }
    
    // Validate phone number length
    if (phoneLengths.length > 0 && !phoneLengths.includes(phone.length)) {
      setPhoneError(`Phone number must be ${phoneLengths.join(' or ')} digits`);
      return;
    }
    
    // Validate new fields
    if (!businessType) { setPasswordError("Please select business type"); return; }
    if (!yearsInBusiness || parseInt(yearsInBusiness) < 0) { setPasswordError("Please enter valid years in business"); return; }
    if (!taxId) { setPasswordError("Please enter tax ID / VAT number"); return; }
    
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (verificationCode.length === 6) setStep(3); 
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Starting registration...");
    
    // First register in auth store - include username
    const registered = register({
      name,
      username,
      email,
      company,
      country: selectedCountry,
      phone: `${phoneCode} ${phone}`,
      role: 'buyer'
    });

    console.log("Registration result:", registered);

    if (registered) {
      // Auto login after registration
      const loggedIn = login(email, password);
      console.log("Login result:", loggedIn);
      
      // Get the current user after login
      setTimeout(() => {
        const { user } = useAuthStore.getState();
        console.log("Current user after login:", user);
        
        if (user) {
          // Create buyer object with proper typing
          const buyerData = {
            name, 
            email, 
            company, 
            country: selectedCountry,
            phone: `${phoneCode} ${phone}`, 
            port: selectedPort,
            city, 
            annualVolume: currentVolume,
            productsOfInterest: cartItems.map(item => item.name).join(", "),
            businessType,
            yearsInBusiness,
            taxId,
            website,
            reference,
            newsletter,
            username
          };
          
          // Add buyer with userId
          addBuyer(user.id, buyerData);
          console.log("Buyer added successfully");
          
          setIsRegistered(true);
        } else {
          console.error("User not found after login");
          alert("Registration completed but there was an issue logging in. Please try logging in manually.");
          setIsRegistered(true);
        }
      }, 100);
    } else {
      alert("Registration failed. Email may already be in use or username is taken.");
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate country and port selection
    if (!appCountry) {
      setDateError("Please select a country of import");
      return;
    }
    if (appAvailablePorts.length > 0 && !appPort) {
      setDateError("Please select an import port");
      return;
    }
    if (dateError) return;
    
    setIsSubmitted(true);
  };

  const handleSaveProfile = () => {
    // Only save if email is verified when changed
    if (profileData.email !== email && !isEmailVerified) {
      alert("Please verify your new email address first");
      return;
    }
    
    // Validate phone number
    if (phoneLengths.length > 0 && !phoneLengths.includes(profileData.phone.length)) {
      alert(`Phone number must be ${phoneLengths.join(' or ')} digits`);
      return;
    }
    
    setName(profileData.name);
    setCompany(profileData.company);
    setEmail(profileData.email);
    setPhone(profileData.phone);
    setIsEditingProfile(false);
    setShowEmailVerification(false);
    setEmailVerificationCode("");
    setIsEmailChanged(false);
    
    // Show success popup
    setSuccessMessage("Profile updated successfully!");
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const handleSendVerificationCode = () => {
    // Simulate sending verification code
    setShowEmailVerification(true);
    setEmailVerificationCode("");
    // In a real app, you would send an email with a verification code here
    console.log("Verification code sent to:", profileData.email);
  };

  const handleVerifyEmail = () => {
    // Simulate email verification (in real app, this would validate against backend)
    if (emailVerificationCode.length === 6) {
      setShowEmailVerification(false);
      setEmailVerificationCode("");
      setIsEmailVerified(true);
      setVerifiedEmail(profileData.email); // Store the verified email
      setIsEmailChanged(false);
      
      // Show success popup
      setSuccessMessage("Email verified successfully!");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const handleViewApplicationDetails = () => {
    // Create application details object from current state and cart items
    const application: ApplicationDetails = {
      id: "EXP-9921",
      submissionDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      items: cartItems,
      appCountry: appCountry,
      appPort: appPort,
      loadingDate: loadingDate,
      status: "Under Review"
    };
    setSelectedApplication(application);
  };

  // --- SUB-COMPONENTS ---

  const Dashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 border-l-4 border-primary">
          <p className="text-xs uppercase font-bold text-muted-foreground">Status</p>
          <h4 className="text-xl font-bold text-secondary">Active Buyer</h4>
        </div>
        <div className="glass-card p-6 border-l-4 border-teal-500">
          <p className="text-xs uppercase font-bold text-muted-foreground">Applications</p>
          <h4 className="text-xl font-bold">{isSubmitted ? "1 Pending" : "0 Pending"}</h4>
        </div>
        <div className="glass-card p-6 border-l-4 border-gold cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setView("messages")}>
          <p className="text-xs uppercase font-bold text-muted-foreground">Messages</p>
          <h4 className="text-xl font-bold">{messagesList.length} Total</h4>
        </div>
      </div>
      <div className="glass-card p-8 gradient-border">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" /> Recent Applications
        </h3>
        {isSubmitted ? (
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">1</div>
                    <div>
                        <p className="text-sm font-bold">Export Manifest #EXP-9921</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Submitted Today • Under Review</p>
                    </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs font-bold text-primary flex items-center gap-1"
                  onClick={handleViewApplicationDetails}
                >
                  <Eye className="w-3 h-3" /> View Details
                </Button>
            </div>
        ) : (
            <div className="text-center py-10 border-2 border-dashed border-border/50 rounded-xl">
              <p className="text-muted-foreground mb-4">You haven't submitted any export applications yet.</p>
              <Button onClick={() => setView("application")} className="btn-gradient-teal">Create First Application</Button>
            </div>
        )}
      </div>
    </div>
  );

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20 container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-64 space-y-2">
              <div className="p-4 mb-6 glass-card text-center bg-primary/5">
                <div className="w-16 h-16 bg-gradient-to-tr from-primary to-secondary rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold">{name.charAt(0)}</div>
                <h3 className="font-bold text-foreground">{name}</h3>
                <p className="text-xs text-muted-foreground">{company}</p>
              </div>
              <Button variant={view === "dashboard" ? "default" : "ghost"} className="w-full justify-start gap-3" onClick={() => setView("dashboard")}><LayoutDashboard className="w-4 h-4" /> Dashboard</Button>
              <Button variant={view === "application" ? "default" : "ghost"} className="w-full justify-start gap-3" onClick={() => setView("application")}><Plus className="w-4 h-4" /> New Application</Button>
              <Button variant={view === "messages" ? "default" : "ghost"} className="w-full justify-start gap-3" onClick={() => setView("messages")}><MessageSquare className="w-4 h-4" /> Messages</Button>
              <Button variant={view === "profile" ? "default" : "ghost"} className="w-full justify-start gap-3" onClick={() => setView("profile")}><User className="w-4 h-4" /> Profile Info</Button>
            </aside>

            <main className="flex-1">
              {view === "dashboard" && <Dashboard />}
              {view === "messages" && <MessageCenter messagesList={messagesList} setMessagesList={setMessagesList} />}
              {view === "profile" && (
                <ProfileSettings 
                  name={name}
                  company={company}
                  email={email}
                  phone={phone}
                  phoneCode={phoneCode}
                  profileData={profileData}
                  setProfileData={setProfileData}
                  isEditingProfile={isEditingProfile}
                  setIsEditingProfile={setIsEditingProfile}
                  handleSaveProfile={handleSaveProfile}
                  showEmailVerification={showEmailVerification}
                  setShowEmailVerification={setShowEmailVerification}
                  emailVerificationCode={emailVerificationCode}
                  setEmailVerificationCode={setEmailVerificationCode}
                  handleVerifyEmail={handleVerifyEmail}
                  handleSendVerificationCode={handleSendVerificationCode}
                  isEmailChanged={profileData.email !== email}
                  isEmailVerified={isEmailVerified && verifiedEmail === profileData.email}
                  verifiedEmail={verifiedEmail}
                  phoneError={phoneError}
                  setPhoneError={setPhoneError}
                  countryCode={countryCode}
                  phoneLengths={phoneLengths}
                />
              )}
              {view === "application" && (
                <div className="glass-card p-8 gradient-border bg-white/5 border-white/10 relative overflow-hidden">
                  {isSubmitted ? (
                    <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
                      <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6"><ClipboardCheck className="w-10 h-10 text-primary" /></div>
                      <h2 className="text-3xl font-bold mb-2">Form Submitted Successfully!</h2>
                      <p className="text-muted-foreground mb-8">Your export manifest has been sent to our logistics team for verification.</p>
                      <Button onClick={() => { clearItems(); setIsSubmitted(false); setView("dashboard"); }} className="btn-gradient-gold px-8">Return to Dashboard</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleFinalSubmit} className="space-y-8">
                      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                        <div>
                          <h2 className="text-3xl font-bold text-foreground tracking-tight">Formal <span className="text-primary">Application</span></h2>
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mt-1">Export Manifest ID: #EXP-NEW</p>
                        </div>
                      </div>
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <label className="text-[11px] font-black text-primary uppercase tracking-tighter flex items-center gap-2"><Package className="w-4 h-4" /> 1. Consignment Commodities (Live From Cart)</label>
                          {cartItems.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                              {cartItems.map((item) => (
                                <div key={item.id} className="p-6 rounded-2xl bg-black/40 border border-white/5 group hover:border-primary/30 transition-all">
                                  <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="w-full lg:w-40 h-40 rounded-xl overflow-hidden border border-white/10 shrink-0">
                                      <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h4 className="font-bold text-2xl text-foreground tracking-tight">{item.name}</h4>
                                          <p className="text-[10px] text-primary font-black uppercase tracking-widest">{item.category} • {item.grade}</p>
                                        </div>
                                        <div className="text-right">
                                          <span className="text-2xl font-black text-primary">{item.fclUnits} <span className="text-sm text-muted-foreground">Units</span></span>
                                          <p className="text-[10px] text-muted-foreground font-bold uppercase">{item.unitType}</p>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-white/5">
                                        <div className="space-y-1">
                                          <p className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground uppercase"><Fingerprint className="w-3 h-3"/> HS Code</p>
                                          <p className="text-xs font-bold text-foreground">{item.hsCode}</p>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground uppercase"><Scale className="w-3 h-3"/> Net Weight</p>
                                          <p className="text-xs font-bold text-foreground">{item.netWeight}</p>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground uppercase"><Archive className="w-3 h-3"/> Packaging</p>
                                          <p className="text-xs font-bold text-foreground">{item.packaging}</p>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground uppercase"><Globe className="w-3 h-3"/> Origin</p>
                                          <p className="text-xs font-bold text-foreground">{item.origin}</p>
                                        </div>
                                      </div>

                                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs text-slate-300 italic">
                                        <span className="text-primary font-black uppercase text-[9px] mr-2">Custom Requirements:</span>
                                        {item.notes || "Standard Quality Grade A protocols apply."}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-[2rem] bg-white/[0.02]">
                              <ShoppingCart className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                              <p className="text-muted-foreground font-medium mb-6">Your manifest is empty.</p>
                              <Button variant="outline" className="rounded-xl border-primary/20 text-primary" onClick={() => window.location.href = '/products'}>Browse Catalog</Button>
                            </div>
                          )}
                        </div>
                        <hr className="border-white/5" />
                        <div className="space-y-4">
                          <label className="text-[11px] font-black text-primary uppercase tracking-tighter flex items-center gap-2"><Globe2 className="w-4 h-4" /> 2. Logistics & Destination</label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Target Loading Date</label>
                              <input type="date" required value={loadingDate} onChange={handleDateChange} className={`w-full bg-black/40 border border-white/10 h-12 rounded-xl text-foreground px-4 text-sm focus:outline-none focus:border-primary/50 ${dateError ? 'border-destructive' : ''}`} />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Country of Import</label>
                              <Select value={appCountry} onValueChange={(val) => { setAppCountry(val); setAppPort(""); setDateError(""); }} required>
                                <SelectTrigger className="bg-black/40 border-white/10 h-12 rounded-xl"><SelectValue placeholder="Select Country" /></SelectTrigger>
                                <SelectContent className="max-h-60">{countries.map((c) => (<SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>))}</SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Import Port</label>
                              <Select value={appPort} onValueChange={(val) => { setAppPort(val); setDateError(""); }} disabled={!appCountry || appAvailablePorts.length === 0} required>
                                <SelectTrigger className="bg-black/40 border-white/10 h-12 rounded-xl"><SelectValue placeholder={!appCountry ? "Select country first" : "Select Port"} /></SelectTrigger>
                                <SelectContent className="max-h-60">{appAvailablePorts.map((port) => (<SelectItem key={port} value={port}>{port}</SelectItem>))}</SelectContent>
                              </Select>
                            </div>
                          </div>
                          {dateError && (
                            <p className="text-destructive text-xs flex items-center gap-1 mt-2">
                              <AlertCircle className="w-3 h-3" /> {dateError}
                            </p>
                          )}
                        </div>
                        <div className="pt-6">
                          <Button 
                            type="submit" 
                            className="btn-gradient-gold w-full h-16 rounded-2xl font-black text-lg shadow-xl group transition-all" 
                            disabled={cartItems.length === 0 || !appCountry || (appAvailablePorts.length > 0 && !appPort) || !!dateError}
                          >
                            Complete Application Manifest <Send className="ml-3 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
        <Footer />
        
        {/* Application Details Modal */}
        <ApplicationDetailsModal 
          application={selectedApplication} 
          onClose={() => setSelectedApplication(null)} 
        />
        
        {/* Success Popup */}
        {showSuccessPopup && (
          <SuccessPopup 
            message={successMessage} 
            onClose={() => setShowSuccessPopup(false)} 
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className={`container mx-auto px-4 ${step === 1 ? 'max-w-4xl' : step === 2 ? 'max-w-lg' : 'max-w-2xl'}`}>
          <div className="text-center mb-10">
            <span className="text-secondary text-sm font-semibold uppercase tracking-widest">Global Portal</span>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-3">Customer <span className="text-primary">Registration</span></h1>
          </div>
          <div className="flex items-center gap-2 mb-8 justify-center">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${s <= step ? 'btn-gradient-gold text-white' : 'bg-muted text-muted-foreground'}`}>{s}</div>
                {s < 3 && <div className={`w-12 md:w-16 h-0.5 ${s < step ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>
          <ScrollReveal delay={100}>
            <div className="glass-card p-8 gradient-border">
              {step === 1 ? (
                <form onSubmit={handleStep1} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-primary flex items-center gap-2"><User className="w-4 h-4" /> Personal Information</h3>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Full Name *</label>
                        <Input placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="bg-muted/50 h-11" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Username *</label>
                        <Input 
                          placeholder="johndoe88" 
                          value={username} 
                          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))} 
                          className="bg-muted/50 h-11" 
                          required 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Email *</label>
                        <Input placeholder="email@company.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-muted/50 h-11" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Password *</label>
                        <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-muted/50 h-11" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Confirm Password *</label>
                        <Input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-muted/50 h-11" required />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-primary flex items-center gap-2"><Briefcase className="w-4 h-4" /> Business Information</h3>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Company Name *</label>
                        <Input placeholder="Global Traders Inc." value={company} onChange={(e) => setCompany(e.target.value)} className="bg-muted/50 h-11" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Business Type *</label>
                        <Select value={businessType} onValueChange={setBusinessType} required>
                          <SelectTrigger className="bg-muted/50 h-11"><SelectValue placeholder="Select Business Type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="importer">Importer</SelectItem>
                            <SelectItem value="exporter">Exporter</SelectItem>
                            <SelectItem value="distributor">Distributor</SelectItem>
                            <SelectItem value="manufacturer">Manufacturer</SelectItem>
                            <SelectItem value="trader">Trader</SelectItem>
                            <SelectItem value="broker">Broker</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Years in Business *</label>
                        <Input type="number" min="0" placeholder="5" value={yearsInBusiness} onChange={(e) => setYearsInBusiness(e.target.value)} className="bg-muted/50 h-11" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Tax ID / VAT Number *</label>
                        <Input placeholder="TX-12345-6789" value={taxId} onChange={(e) => setTaxId(e.target.value)} className="bg-muted/50 h-11" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Website (Optional)</label>
                        <Input placeholder="https://www.company.com" value={website} onChange={(e) => setWebsite(e.target.value)} className="bg-muted/50 h-11" />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h3 className="text-sm font-bold text-primary flex items-center gap-2"><Globe className="w-4 h-4" /> Location & Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Business Country *</label>
                        <Select value={selectedCountry} onValueChange={(val) => { setSelectedCountry(val); setPhone(""); setPhoneError(""); }}>
                          <SelectTrigger className="bg-muted/50 h-11"><SelectValue placeholder="Select Country" /></SelectTrigger>
                          <SelectContent className="max-h-60">{countries.map((c) => <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">City *</label>
                        <Input placeholder="City Name" value={city} onChange={(e) => setCity(e.target.value)} className="bg-muted/50 h-11" required />
                      </div>
                    </div>
                    
                    <div className="space-y-1 mt-4">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Phone Number *</label>
                      <div className="flex gap-2">
                        <div className="w-16 flex items-center justify-center bg-muted/50 border rounded-lg text-xs">{phoneCode || "—"}</div>
                        <Input 
                          placeholder="Enter phone number" 
                          type="tel" 
                          value={phone} 
                          onChange={(e) => handlePhoneChange(e.target.value)} 
                          className="bg-muted/50 h-11 flex-1" 
                          required 
                        />
                      </div>
                      {phoneLengths.length > 0 && (
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Accepts {phoneLengths.join(' or ')} digits
                        </p>
                      )}
                      {phoneError && <p className="text-destructive text-[10px] mt-1">{phoneError}</p>}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h3 className="text-sm font-bold text-primary flex items-center gap-2"><FileText className="w-4 h-4" /> Additional Information</h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">How did you hear about us? (Optional)</label>
                        <Select value={reference} onValueChange={setReference}>
                          <SelectTrigger className="bg-muted/50 h-11"><SelectValue placeholder="Select an option" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="search">Search Engine</SelectItem>
                            <SelectItem value="social">Social Media</SelectItem>
                            <SelectItem value="referral">Referral</SelectItem>
                            <SelectItem value="conference">Trade Conference</SelectItem>
                            <SelectItem value="email">Email Campaign</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="newsletter" 
                          checked={newsletter}
                          onChange={(e) => setNewsletter(e.target.checked)}
                          className="rounded border-white/10 bg-muted/50"
                        />
                        <label htmlFor="newsletter" className="text-xs text-muted-foreground">
                          Subscribe to our newsletter for market updates and trade opportunities
                        </label>
                      </div>
                    </div>
                  </div>

                  {passwordError && <p className="text-destructive text-xs font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {passwordError}</p>}
                  
                  <Button type="submit" className="w-full btn-gradient-gold py-6 font-bold" disabled={!selectedCountry || !!phoneError}>
                    Continue to Verification →
                  </Button>
                  
                  {/* Login link added here */}
                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{' '}
                      <Link to="/login" className="text-primary hover:text-primary/80 font-semibold underline underline-offset-4 transition-colors">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </form>
              ) : step === 2 ? (
                <form onSubmit={handleStep2} className="space-y-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4"><Mail className="w-8 h-8" /></div>
                  <div className="space-y-2"><h3 className="text-xl font-bold">Verify Your Email</h3><p className="text-sm text-muted-foreground">Code sent to <span className="text-foreground font-semibold">{email}</span></p></div>
                  <div className="space-y-4">
                    <Input placeholder="0 0 0 0 0 0" className="text-center text-2xl tracking-[1em] font-bold h-16 bg-muted/30" maxLength={6} value={verificationCode} onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))} required />
                    <div className="flex gap-3"><Button type="button" variant="ghost" onClick={() => setStep(1)} className="flex-1">Back</Button><Button type="submit" className="flex-[2] btn-gradient-gold font-bold h-12" disabled={verificationCode.length !== 6}>Verify Code</Button></div>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSubmitRegistration} className="space-y-5">
                  <h3 className="text-sm font-bold text-primary mb-4">Final Step: Trading Preferences</h3>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Initial Destination *</label>
                    <Select value={importCountry} onValueChange={(val) => { setImportCountry(val); setSelectedPort(""); }} required>
                      <SelectTrigger className="bg-muted/50 h-11"><SelectValue placeholder="Select Destination" /></SelectTrigger>
                      <SelectContent className="max-h-60">{countries.map((c) => <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Import Port *</label>
                    <Select value={selectedPort} onValueChange={setSelectedPort} required disabled={!importCountry}>
                      <SelectTrigger className="bg-muted/50 h-11"><SelectValue placeholder={!importCountry ? "Select Destination" : "Select Port"} /></SelectTrigger>
                      <SelectContent className="max-h-60">{regAvailablePorts.map((port) => (<SelectItem key={port} value={port}>{port}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Current Annual Import Volume (USD) *</label>
                    <Input placeholder="500000" type="number" value={currentVolume} onChange={(e) => setCurrentVolume(e.target.value)} className="bg-muted/50 h-11" required />
                  </div>
                  
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <p className="text-xs text-muted-foreground">
                      <span className="text-primary font-bold">Note:</span> By completing registration, you agree to our terms of service and confirm that the information provided is accurate.
                    </p>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                    <Button type="submit" className="flex-[2] btn-gradient-teal font-bold h-12">
                      Complete Registration
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;