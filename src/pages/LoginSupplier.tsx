import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, Lock, LogIn, AlertCircle, Building2, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LoginSupplier = () => {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate input
    if (loginMethod === 'email' && !email) {
      setError("Please enter your email");
      setLoading(false);
      return;
    }
    if (loginMethod === 'phone' && !phone) {
      setError("Please enter your phone number");
      setLoading(false);
      return;
    }
    if (!password) {
      setError("Please enter your password");
      setLoading(false);
      return;
    }

    // Simulate API call - replace with actual authentication
    setTimeout(() => {
      // Mock validation - in real app, this would be an API call
      if (password.length < 6) {
        setError("Invalid email/phone or password");
        setLoading(false);
        return;
      }

      // Mock successful login
      const userName = loginMethod === 'email' 
        ? email.split('@')[0] 
        : `supplier_${phone.slice(-4)}`;
      
      // Use the auth context login with properly typed data
      login('supplier', {
        id: 'supplier_' + Date.now(),
        userName: userName,
        email: email,
        phone: phone,
        companyName: userName + " Enterprises",
        verificationStatus: 'pending'
      });
      
      navigate('/supplier/dashboard');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-md">
          <div className="glass-card p-8 gradient-border">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/30">
                <Building2 className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Supplier Portal</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Sign in to manage your products and orders
              </p>
            </div>

            {/* Login Method Toggle */}
            <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-lg">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  loginMethod === 'email' 
                    ? 'bg-primary text-white' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  loginMethod === 'phone' 
                    ? 'bg-primary text-white' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Phone
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {loginMethod === 'email' ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="company@email.com"
                      className="bg-white/5 border-white/10 pl-9 h-12"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required={loginMethod === 'email'}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="+1234567890"
                      className="bg-white/5 border-white/10 pl-9 h-12"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required={loginMethod === 'phone'}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-white/5 border-white/10 pl-9 h-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/10 bg-white/5"
                  />
                  <span className="text-xs text-muted-foreground">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 rounded-lg flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full btn-gradient-gold h-12 text-base font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Access Portal <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Verification Badge */}
            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-primary" />
              <div className="text-xs">
                <p className="font-semibold text-primary">Verified Supplier?</p>
                <p className="text-muted-foreground">Get verified to access more features</p>
              </div>
            </div>

            <div className="mt-6 text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-background text-muted-foreground">New to Canadian Trade?</span>
                </div>
              </div>

              <Link
                to="/supplier"
                className="inline-flex items-center justify-center w-full px-4 py-3 border border-primary/30 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
              >
                Register as a Supplier
              </Link>

              <p className="text-xs text-muted-foreground">
                By signing in, you agree to our{' '}
                <Link to="/terms" className="text-primary hover:underline">Terms</Link> and{' '}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Link 
              to="/supplier/help" 
              className="text-center p-3 glass-card rounded-lg hover:bg-white/5 transition-colors"
            >
              <p className="text-xs font-medium">Supplier Help Center</p>
            </Link>
            <Link 
              to="/contact" 
              className="text-center p-3 glass-card rounded-lg hover:bg-white/5 transition-colors"
            >
              <p className="text-xs font-medium">Contact Support</p>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginSupplier;