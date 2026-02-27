import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ShoppingCart, 
  Menu, 
  X, 
  LogIn, 
  User, 
  ChevronDown, 
  UserPlus, 
  Building2,
  LayoutDashboard,
  Settings,
  LogOut,
  Home,
  Info,
  Package,
  Phone
} from "lucide-react";
import { useQuoteStore } from "@/lib/quoteStore";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "About Us", path: "/about", icon: Info },
  { label: "Products", path: "/products", icon: Package },
  { label: "Contact Us", path: "/contact", icon: Phone },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, userType, userName, logout } = useAuth();
  const items = useQuoteStore((s) => s.items);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  const getDashboardLink = () => {
    if (userType === 'buyer') return '/buyer/dashboard';
    if (userType === 'supplier') return '/supplier/dashboard';
    return '/';
  };

  const getProfileLink = () => {
    if (userType === 'buyer') return '/buyer/profile';
    if (userType === 'supplier') return '/supplier/profile';
    return '/';
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-md ${
                    location.pathname === item.path
                      ? "text-primary bg-primary/10"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quote Cart */}
            <Link 
              to="/quote" 
              className="relative p-2 hover:bg-primary/10 rounded-full transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-foreground/80 hover:text-primary transition-colors" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs flex items-center justify-center font-semibold shadow-lg">
                  {items.length}
                </span>
              )}
            </Link>

            {/* Authentication Section - Desktop */}
            <div className="hidden md:block">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-2 px-3 py-2 h-10 hover:bg-primary/10 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shadow-md">
                        {userName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium max-w-[100px] truncate">
                        {userName || 'User'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{userName || 'User'}</p>
                        <p className="text-xs text-muted-foreground capitalize">{userType}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardLink()} className="cursor-pointer w-full">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={getProfileLink()} className="cursor-pointer w-full">
                        <Settings className="w-4 h-4 mr-2" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="text-destructive cursor-pointer focus:text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  {/* Register Dropdown - Simplified */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="hidden lg:flex items-center gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 px-5 py-2 h-10"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Register</span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-semibold">Register As</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/register" className="cursor-pointer w-full">
                          <User className="w-4 h-4 mr-2" />
                          Buyer
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/supplier" className="cursor-pointer w-full">
                          <Building2 className="w-4 h-4 mr-2" />
                          Supplier
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Login Button - Connected to unified login page */}
                  <Link to="/login/buyer">
                    <Button 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-300 px-5 py-2 h-10"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      <span>Login</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-foreground hover:bg-primary/10 rounded-full transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Navy Blue Background */}
      <div
        className={`lg:hidden fixed inset-0 top-16 transition-transform duration-300 ease-in-out transform ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ 
          height: 'calc(100vh - 64px)',
          backgroundColor: '#1C2E4A' // Navy blue
        }}
      >
        <div className="container mx-auto px-4 py-6 h-full overflow-y-auto">
          <div className="flex flex-col gap-6">
            {/* Navigation Links */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-white/60 uppercase tracking-wider px-3 mb-3">
                Navigation
              </p>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-3 text-base font-medium rounded-lg transition-all ${
                    location.pathname === item.path
                      ? "text-[#F5B301] bg-white/10"
                      : "text-white hover:text-[#F5B301] hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile Authentication */}
            <div className="border-t border-white/10 pt-6">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-4 px-3 mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#F5B301] to-[#FFD700] flex items-center justify-center text-[#1C2E4A] font-bold text-xl shadow-lg">
                      {userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{userName || 'User'}</p>
                      <p className="text-sm text-white/70 capitalize flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${userType === 'buyer' ? 'bg-green-400' : 'bg-blue-400'}`} />
                        {userType}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Link
                      to={getDashboardLink()}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg text-white hover:bg-white/10 transition-colors"
                    >
                      <LayoutDashboard className="w-5 h-5 text-[#F5B301]" />
                      Dashboard
                    </Link>
                    <Link
                      to={getProfileLink()}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg text-white hover:bg-white/10 transition-colors"
                    >
                      <Settings className="w-5 h-5 text-[#F5B301]" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg text-red-300 hover:bg-white/10 w-full text-left transition-colors"
                    >
                      <LogOut className="w-5 h-5 text-red-300" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Register Section - Simplified */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-white mb-4 px-3">
                      Register
                    </p>
                    
                    {/* Register as Buyer */}
                    <Link
                      to="/register"
                      className="block mb-3"
                    >
                      <div className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                            <span className="font-semibold text-white">Register as Buyer</span>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Register as Supplier */}
                    <Link
                      to="/supplier"
                      className="block"
                    >
                      <div className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-amber-400" />
                          </div>
                          <div>
                            <span className="font-semibold text-white">Register as Supplier</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  
                  {/* Login Section - Connected to unified login page */}
                  <div className="border-t border-white/10 pt-6">
                    <p className="text-sm font-semibold text-white mb-4 px-3">
                      Existing User
                    </p>
                    <Link
                      to="/login/buyer"
                      className="block w-full px-3"
                    >
                      <div className="bg-gradient-to-r from-[#F5B301] to-[#FFD700] rounded-xl p-4 hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <LogIn className="w-5 h-5 text-[#1C2E4A]" />
                            <span className="font-semibold text-[#1C2E4A]">Login</span>
                          </div>
                          <ChevronDown className="w-5 h-5 text-[#1C2E4A] rotate-180" />
                        </div>
                      </div>
                    </Link>
                    
                    {/* Quick login type selection for mobile */}
                    <div className="mt-3 grid grid-cols-2 gap-2 px-3">
                      <Link
                        to="/login/buyer"
                        className="text-center py-2 text-xs bg-white/5 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
                      >
                        Login as Buyer
                      </Link>
                      <Link
                        to="/login/supplier"
                        className="text-center py-2 text-xs bg-white/5 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
                      >
                        Login as Supplier
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;