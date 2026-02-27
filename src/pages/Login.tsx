import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, Lock, LogIn, AlertCircle, User, Building2, ArrowRight, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { type } = useParams<{ type: string }>();
  const [userType, setUserType] = useState<'buyer' | 'supplier'>(type === 'supplier' ? 'supplier' : 'buyer');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Brand colors from your project
  const BRAND = {
    yellow: "#F5B301",
    black: "#0F0F0F",
    navy: "#1C2E4A",
    white: "#FFFFFF",
    gray: "#9CA3AF",
  };

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
        setError("Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      // Mock successful login based on user type
      const userName = loginMethod === 'email' 
        ? email.split('@')[0] 
        : `user_${phone.slice(-4)}`;
      
      // Use the auth context login without verified property
      if (userType === 'buyer') {
        login('buyer', {
          id: 'buyer_' + Date.now(),
          userName: userName,
          email: email,
          phone: phone,
          companyName: userName + "'s Company"
        });
        navigate('/buyer/dashboard');
      } else {
        login('supplier', {
          id: 'supplier_' + Date.now(),
          userName: userName,
          email: email,
          phone: phone,
          companyName: userName + " Supplies Inc."
        });
        navigate('/supplier/dashboard');
      }
      
      setLoading(false);
    }, 1500);
  };

  const switchUserType = (type: 'buyer' | 'supplier') => {
    setUserType(type);
    setError("");
    // Update URL without refreshing
    navigate(`/login/${type}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-md">
          {/* User Type Toggle */}
          <div className="mb-6">
            <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => switchUserType('buyer')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  userType === 'buyer' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Buyer Login
              </button>
              <button
                type="button"
                onClick={() => switchUserType('supplier')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  userType === 'supplier' 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Building2 className="w-4 h-4 inline mr-2" />
                Supplier Login
              </button>
            </div>
          </div>

          <div className="glass-card p-8 gradient-border relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -ml-20 -mb-20" />
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 ${
                  userType === 'buyer' 
                    ? 'bg-blue-500/10 border-blue-500/30' 
                    : 'bg-amber-500/10 border-amber-500/30'
                }`}>
                  {userType === 'buyer' ? (
                    <User className={`w-10 h-10 ${userType === 'buyer' ? 'text-blue-500' : 'text-amber-500'}`} />
                  ) : (
                    <Building2 className="w-10 h-10 text-amber-500" />
                  )}
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome Back!
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  Sign in to your {userType} account
                </p>
              </div>

              {/* Login Method Toggle - Email/Phone */}
              <div className="flex gap-2 mb-6 p-1 bg-muted/30 rounded-lg">
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
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="bg-muted/20 border-border/50 pl-9 h-12 focus:border-primary transition-colors"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required={loginMethod === 'email'}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="+1 234 567 8900"
                        className="bg-muted/20 border-border/50 pl-9 h-12 focus:border-primary transition-colors"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required={loginMethod === 'phone'}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-muted/20 border-border/50 pl-9 h-12 focus:border-primary transition-colors"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-border bg-muted/20 text-primary focus:ring-primary"
                    />
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors">
                    Forgot Password?
                  </Link>
                </div>

                {error && (
                  <div className="p-3 bg-destructive/10 rounded-lg flex items-center gap-2 text-destructive text-sm border border-destructive/20">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className={`w-full h-12 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all ${
                    userType === 'buyer' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' 
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Sign In as {userType === 'buyer' ? 'Buyer' : 'Supplier'} 
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-background text-muted-foreground">
                      New to Canadian Trade?
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/register"
                    className={`inline-flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-all ${
                      userType === 'buyer'
                        ? 'border-blue-500/30 text-blue-600 hover:bg-blue-500/5 hover:border-blue-500'
                        : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/20'
                    }`}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Create Buyer Account
                  </Link>
                  <Link
                    to="/supplier"
                    className={`inline-flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-all ${
                      userType === 'supplier'
                        ? 'border-amber-500/30 text-amber-600 hover:bg-amber-500/5 hover:border-amber-500'
                        : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/20'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Create Supplier Account
                  </Link>
                </div>

                {/* Verified Badge for Suppliers */}
                {userType === 'supplier' && (
                  <div className="flex items-center justify-center gap-2 text-xs text-amber-600 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                    <Shield className="w-4 h-4" />
                    <span>Suppliers are verified for authenticity and quality</span>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  By signing in, you agree to our{' '}
                  <Link to="/terms" className="text-primary hover:text-primary/80 hover:underline">Terms</Link> and{' '}
                  <Link to="/privacy" className="text-primary hover:text-primary/80 hover:underline">Privacy Policy</Link>
                </p>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Having trouble signing in?{' '}
              <Link to="/contact" className="text-primary hover:text-primary/80 hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;