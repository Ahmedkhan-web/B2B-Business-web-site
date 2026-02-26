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
  LogOut
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
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Products", path: "/products" },
  { label: "Contact Us", path: "/contact" },
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
    // Optionally redirect to home
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
                  {/* Register Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="hidden lg:flex items-center gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 px-4 py-2 h-10"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Register</span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Create Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/register" className="cursor-pointer w-full">
                          <User className="w-4 h-4 mr-2" />
                          Register as Buyer
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/supplier" className="cursor-pointer w-full">
                          <Building2 className="w-4 h-4 mr-2" />
                          Register as Supplier
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Login Button */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-300 px-4 py-2 h-10"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        <span>Login</span>
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Select Login Type</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/login/buyer" className="cursor-pointer w-full">
                          <User className="w-4 h-4 mr-2" />
                          Buyer Login
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/login/supplier" className="cursor-pointer w-full">
                          <Building2 className="w-4 h-4 mr-2" />
                          Supplier Login
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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

      {/* Mobile Menu - Slide Over */}
      <div
        className={`lg:hidden fixed inset-0 top-16 bg-background/98 backdrop-blur-xl transition-transform duration-300 ease-in-out transform ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ height: 'calc(100vh - 64px)' }}
      >
        <div className="container mx-auto px-4 py-6 h-full overflow-y-auto">
          <div className="flex flex-col gap-2">
            {/* Navigation Links */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                Navigation
              </p>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-3 text-base font-medium rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "text-primary bg-primary/10"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Authentication Links */}
            <div className="border-t border-border/50 mt-4 pt-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold">{userName || 'User'}</p>
                      <p className="text-sm text-muted-foreground capitalize">{userType}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Link
                      to={getDashboardLink()}
                      className="flex items-center gap-3 px-3 py-3 text-base font-medium rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <Link
                      to={getProfileLink()}
                      className="flex items-center gap-3 px-3 py-3 text-base font-medium rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-3 text-base font-medium rounded-lg text-destructive hover:bg-destructive/5 w-full text-left transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Register Section */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                      Register
                    </p>
                    <div className="space-y-1">
                      <Link
                        to="/register"
                        className="flex items-center gap-3 px-3 py-3 text-base font-medium rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        <User className="w-5 h-5" />
                        As Buyer
                      </Link>
                      <Link
                        to="/supplier"
                        className="flex items-center gap-3 px-3 py-3 text-base font-medium rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        <Building2 className="w-5 h-5" />
                        As Supplier
                      </Link>
                    </div>
                  </div>
                  
                  {/* Login Section */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                      Login
                    </p>
                    <div className="space-y-1">
                      <Link
                        to="/login/buyer"
                        className="flex items-center gap-3 px-3 py-3 text-base font-medium rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        <User className="w-5 h-5" />
                        Buyer Login
                      </Link>
                      <Link
                        to="/login/supplier"
                        className="flex items-center gap-3 px-3 py-3 text-base font-medium rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        <Building2 className="w-5 h-5" />
                        Supplier Login
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