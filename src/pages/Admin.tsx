import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Package, FileText, MessageSquare, 
  Settings, LogOut, Building2, Eye, EyeOff, Ban, 
  UserCheck, Trash2, Mail, ChevronRight, Phone, MapPin,
  Calendar, Briefcase, DollarSign, Globe, Package2, Scale,
  Clock, CheckCircle2, XCircle, Download, Printer, FileText as FileTextIcon,
  User, Award, Hash, Link as LinkIcon, Mail as MailIcon, Phone as PhoneIcon,
  MapPin as MapPinIcon, Building as BuildingIcon, Globe as GlobeIcon,
  CreditCard, FileCheck, FolderOpen, Tag, Users as UsersIcon,
  TrendingUp, TrendingDown, Activity, Search,
  Filter, Star, StarOff, MoreVertical,
  ChevronLeft, ChevronRight as ChevronRightIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuthStore } from "@/lib/authStore";
import { useAdminStore } from "@/lib/adminStore";
import { useToast } from "@/hooks/use-toast";
import { categories, allProducts } from "@/lib/productData";

// Import types from your store
import type { BuyerEntry, SupplierEntry, ContactMessage, QuotationEntry } from "@/lib/adminStore";

interface SidebarItem {
  icon: React.FC<{ className?: string }>;
  label: string;
  id: string;
}

// Extended interfaces for additional fields
interface ExtendedBuyerEntry extends BuyerEntry {
  businessType?: string;
  yearsInBusiness?: string;
  taxId?: string;
  website?: string;
  reference?: string;
  newsletter?: boolean;
  totalSpent?: number;
  quotationsCount?: number;
  averageOrderValue?: number;
  lastInteraction?: string;
}

interface ExtendedSupplierEntry extends SupplierEntry {
  businessType?: string;
  yearEstablished?: string;
  employeeCount?: string;
  currentRevenue?: string;
  website?: string;
  exportMarkets?: string[];
  productDetails?: string;
  minOrderQuantity?: string;
  leadTime?: string;
  certificates?: string[];
  preferredPaymentTerms?: string[];
  bankName?: string;
  bankAccount?: string;
  swiftCode?: string;
  totalOrders?: number;
  totalRevenue?: number;
  qualityRating?: number;
  completionRate?: number;
  verifiedDate?: string;
}

const sidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Users, label: "Buyers", id: "buyers" },
  { icon: Building2, label: "Suppliers", id: "suppliers" },
  { icon: Package, label: "Products", id: "products" },
  { icon: FileText, label: "Quotations", id: "quotations" },
  { icon: MessageSquare, label: "Messages", id: "messages" },
  { icon: Settings, label: "Settings", id: "settings" },
];

const Admin: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuthStore();
  const store = useAdminStore();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState<boolean>(false);
  const [logoutEmail, setLogoutEmail] = useState<string>("");
  const [logoutPassword, setLogoutPassword] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBuyer, setSelectedBuyer] = useState<ExtendedBuyerEntry | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<ExtendedSupplierEntry | null>(null);
  const [showBuyerDetails, setShowBuyerDetails] = useState<boolean>(false);
  const [showSupplierDetails, setShowSupplierDetails] = useState<boolean>(false);
  const [buyerQuotations, setBuyerQuotations] = useState<QuotationEntry[]>([]);

  // Check if user is admin - redirect to admin login if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/-admin-login" replace />;
  }

  // If logged in but not admin, redirect to home
  if (isLoggedIn && user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleLogout = (): void => {
    if (logoutEmail === "admindf@gmail.com" && logoutPassword === "admin123") {
      logout();
      toast({ title: "Logged Out Successfully" });
      setShowLogoutDialog(false);
    } else {
      toast({ title: "Invalid credentials", variant: "destructive" });
    }
  };

  const unreadMessages: number = store.contactMessages?.filter((m: ContactMessage) => !m.read).length || 0;

  // Safely get stats with null checks
  const buyers = store.buyers || [];
  const suppliers = store.suppliers || [];
  const quotations = store.quotations || [];
  const contactMessages = store.contactMessages || [];
  const hiddenProducts = store.hiddenProducts || [];

  // Stats for dashboard
  const stats = {
    totalBuyers: buyers.length,
    totalSuppliers: suppliers.length,
    totalProducts: allProducts?.length || 0,
    totalQuotations: quotations.length,
    totalMessages: contactMessages.length,
    blockedBuyers: buyers.filter((b: BuyerEntry) => b.blocked).length,
    blockedSuppliers: suppliers.filter((s: SupplierEntry) => s.blocked).length,
    unreadMessages,
    totalRevenue: quotations
      .filter(q => q.status === 'approved')
      .reduce((sum, q) => sum + (q.totalAmount || 0), 0)
  };

  // Safely filter buyers with enhanced data
  const filteredBuyers = buyers
    .filter((b: BuyerEntry) => {
      if (!b) return false;
      if (statusFilter === 'active') return !b.blocked;
      if (statusFilter === 'blocked') return b.blocked;
      return true;
    })
    .filter((b: BuyerEntry) => {
      if (!b) return false;
      const searchLower = searchTerm.toLowerCase();
      return (
        (b.name?.toLowerCase() || '').includes(searchLower) ||
        (b.email?.toLowerCase() || '').includes(searchLower) ||
        (b.company?.toLowerCase() || '').includes(searchLower) ||
        (b.country?.toLowerCase() || '').includes(searchLower)
      );
    })
    .map(b => ({
      ...b,
      totalSpent: quotations
        .filter(q => q.userId === b.userId && q.status === 'approved')
        .reduce((sum, q) => sum + (q.totalAmount || 0), 0),
      quotationsCount: quotations.filter(q => q.userId === b.userId).length,
      lastInteraction: b.lastActive || b.date
    }));

  // Safely filter suppliers with enhanced data
  const filteredSuppliers = suppliers
    .filter((s: SupplierEntry) => {
      if (!s) return false;
      if (statusFilter === 'active') return !s.blocked;
      if (statusFilter === 'blocked') return s.blocked;
      return true;
    })
    .filter((s: SupplierEntry) => {
      if (!s) return false;
      const searchLower = searchTerm.toLowerCase();
      return (
        (s.name?.toLowerCase() || '').includes(searchLower) ||
        (s.email?.toLowerCase() || '').includes(searchLower) ||
        (s.company?.toLowerCase() || '').includes(searchLower) ||
        (s.country?.toLowerCase() || '').includes(searchLower)
      );
    })
    .map(s => ({
      ...s,
      totalOrders: quotations.filter(q => q.userId === s.userId).length,
      totalRevenue: quotations
        .filter(q => q.userId === s.userId && q.status === 'approved')
        .reduce((sum, q) => sum + (q.totalAmount || 0), 0)
    }));

  const handleViewBuyer = (buyer: BuyerEntry): void => {
    const extendedBuyer = {
      ...buyer,
      totalSpent: quotations
        .filter(q => q.userId === buyer.userId && q.status === 'approved')
        .reduce((sum, q) => sum + (q.totalAmount || 0), 0),
      quotationsCount: quotations.filter(q => q.userId === buyer.userId).length,
      averageOrderValue: quotations
        .filter(q => q.userId === buyer.userId && q.status === 'approved')
        .reduce((sum, q) => sum + (q.totalAmount || 0), 0) / 
        (quotations.filter(q => q.userId === buyer.userId && q.status === 'approved').length || 1),
      lastInteraction: buyer.lastActive || buyer.date
    };
    setSelectedBuyer(extendedBuyer as ExtendedBuyerEntry);
    
    // Get all quotations for this buyer
    const buyerQuots = quotations.filter(q => q.userId === buyer.userId);
    setBuyerQuotations(buyerQuots);
    setShowBuyerDetails(true);
  };

  const handleViewSupplier = (supplier: SupplierEntry): void => {
    const extendedSupplier = {
      ...supplier,
      totalOrders: quotations.filter(q => q.userId === supplier.userId).length,
      totalRevenue: quotations
        .filter(q => q.userId === supplier.userId && q.status === 'approved')
        .reduce((sum, q) => sum + (q.totalAmount || 0), 0)
    };
    setSelectedSupplier(extendedSupplier as ExtendedSupplierEntry);
    setShowSupplierDetails(true);
  };

  const handleDeleteBuyer = (buyer: BuyerEntry): void => {
    if (window.confirm('Delete this buyer? This will permanently remove their account and they will be able to register again.')) {
      store.deleteBuyer(buyer.id, buyer.userId);
      toast({ title: "Buyer deleted permanently" });
    }
  };

  const handleDeleteSupplier = (supplier: SupplierEntry): void => {
    if (window.confirm('Delete this supplier? This will permanently remove their account and they will be able to register again.')) {
      store.deleteSupplier(supplier.id, supplier.userId);
      toast({ title: "Supplier deleted permanently" });
    }
  };

  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'blocked': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col fixed h-full z-30 shadow-sm`}>
        <div className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <div className={`flex items-center ${sidebarOpen ? 'space-x-2' : 'justify-center w-full'}`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            {sidebarOpen && <span className="font-semibold text-slate-900 dark:text-white">Admin Panel</span>}
          </div>
        </div>
        
        <nav className="flex-1 p-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${
                  activeTab === item.id 
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${
                  activeTab === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-500'
                }`} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.id === 'messages' && unreadMessages > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-medium min-w-[18px] text-center">
                        {unreadMessages}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
        
        <div className="p-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && "Sign Out"}
          </button>
        </div>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
        >
          <ChevronRightIcon className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform ${!sidebarOpen && 'rotate-180'}`} />
        </button>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white capitalize">
            {activeTab}
          </h1>
          
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-64 pl-9 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500"
              />
            </div>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
              <Avatar className="h-9 w-9 ring-2 ring-indigo-100 dark:ring-indigo-950">
                <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white font-medium">
                  A
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Admin</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-6">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Buyers</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalBuyers}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center">
                        <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    {stats.blockedBuyers > 0 && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 mt-2">
                        <span className="font-medium">{stats.blockedBuyers}</span> blocked
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Suppliers</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalSuppliers}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                    {stats.blockedSuppliers > 0 && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 mt-2">
                        <span className="font-medium">{stats.blockedSuppliers}</span> blocked
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Products</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalProducts}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
                        <Package className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{hiddenProducts.length}</span> hidden
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Messages</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalMessages}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                      </div>
                    </div>
                    {stats.unreadMessages > 0 && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 mt-2">
                        <span className="font-medium">{stats.unreadMessages}</span> unread
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-900 dark:text-white flex items-center justify-between">
                      Recent Buyers
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-950/50"
                        onClick={() => setActiveTab('buyers')}
                      >
                        View all <ChevronRightIcon className="w-4 h-4 ml-1" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {buyers.slice(0, 5).map((buyer: BuyerEntry) => (
                        <div key={buyer?.id || Math.random()} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 text-xs">
                                {buyer?.name?.charAt(0).toUpperCase() || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{buyer?.name || 'Unknown'}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{buyer?.country || 'N/A'} • {buyer?.company || 'No company'}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className={getStatusColor(buyer?.blocked ? 'blocked' : 'active')}>
                            {buyer?.blocked ? 'Blocked' : 'Active'}
                          </Badge>
                        </div>
                      ))}
                      {buyers.length === 0 && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No buyers yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-900 dark:text-white flex items-center justify-between">
                      Recent Suppliers
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-950/50"
                        onClick={() => setActiveTab('suppliers')}
                      >
                        View all <ChevronRightIcon className="w-4 h-4 ml-1" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {suppliers.slice(0, 5).map((supplier: SupplierEntry) => (
                        <div key={supplier?.id || Math.random()} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-xs">
                                {supplier?.name?.charAt(0).toUpperCase() || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{supplier?.company || 'Unknown'}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{supplier?.country || 'N/A'} • {supplier?.name}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className={getStatusColor(supplier?.blocked ? 'blocked' : 'active')}>
                            {supplier?.blocked ? 'Blocked' : 'Active'}
                          </Badge>
                        </div>
                      ))}
                      {suppliers.length === 0 && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No suppliers yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Card */}
              <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-1">Total Revenue</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">${stats.totalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">From approved quotations</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                      <DollarSign className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Buyers */}
          {activeTab === "buyers" && (
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl text-slate-900 dark:text-white">Buyer Management</CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">
                      Manage and monitor all buyer accounts
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                        <Filter className="w-4 h-4 mr-2 text-slate-500" />
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Buyers</SelectItem>
                        <SelectItem value="active">Active Only</SelectItem>
                        <SelectItem value="blocked">Blocked Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredBuyers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">No buyers found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-900">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Buyer</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Contact</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Company</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Country</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Activity</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {filteredBuyers.map((buyer) => (
                          <tr key={buyer?.id || Math.random()} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 text-xs">
                                    {buyer.name?.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-slate-900 dark:text-white">{buyer.name}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">ID: {buyer.id?.slice(-8)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="space-y-1">
                                <p className="text-sm text-slate-900 dark:text-white">{buyer.email}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{buyer.phone}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{buyer.company || 'N/A'}</p>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <Badge variant="outline" className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700">
                                {buyer.country}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                                  <FileText className="w-3 h-3" />
                                  <span>{(buyer as any).quotationsCount || 0} quotes</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                                  <DollarSign className="w-3 h-3" />
                                  <span>${(buyer as any).totalSpent?.toLocaleString() || 0}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className={getStatusColor(buyer.blocked ? 'blocked' : 'active')}>
                                {buyer.blocked ? 'Blocked' : 'Active'}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/50"
                                  onClick={() => handleViewBuyer(buyer)}
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className={`h-8 w-8 p-0 ${
                                    buyer?.blocked 
                                      ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-950/50' 
                                      : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-950/50'
                                  }`}
                                  onClick={() => {
                                    store.toggleBlockBuyer(buyer.id, buyer.userId);
                                    toast({ 
                                      title: buyer.blocked ? "Buyer unblocked" : "Buyer blocked" 
                                    });
                                  }}
                                  title={buyer?.blocked ? "Unblock" : "Block"}
                                >
                                  {buyer?.blocked ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                </Button>
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-950/50"
                                  onClick={() => handleDeleteBuyer(buyer)}
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Suppliers */}
          {activeTab === "suppliers" && (
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl text-slate-900 dark:text-white">Supplier Management</CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">
                      Manage and monitor all supplier accounts
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                        <Filter className="w-4 h-4 mr-2 text-slate-500" />
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Suppliers</SelectItem>
                        <SelectItem value="active">Active Only</SelectItem>
                        <SelectItem value="blocked">Blocked Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredSuppliers.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">No suppliers found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-900">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Supplier</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Company</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Contact</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Country</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Products</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {filteredSuppliers.map((supplier) => (
                          <tr key={supplier?.id || Math.random()} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-xs">
                                    {supplier.name?.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-slate-900 dark:text-white">{supplier.name}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">{supplier.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{supplier.company || 'N/A'}</p>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-sm text-slate-900 dark:text-white">{supplier.phone}</p>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <Badge variant="outline" className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700">
                                {supplier.country}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1 max-w-[150px]">
                                {supplier.exportProducts?.slice(0, 2).map((prod, idx) => (
                                  <Badge key={idx} variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-0 text-xs">
                                    {prod.length > 10 ? prod.substring(0, 10) + '...' : prod}
                                  </Badge>
                                ))}
                                {supplier.exportProducts && supplier.exportProducts.length > 2 && (
                                  <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-0 text-xs">
                                    +{supplier.exportProducts.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className={getStatusColor(supplier.blocked ? 'blocked' : 'active')}>
                                {supplier.blocked ? 'Blocked' : 'Active'}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/50"
                                  onClick={() => handleViewSupplier(supplier)}
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className={`h-8 w-8 p-0 ${
                                    supplier?.blocked 
                                      ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-950/50' 
                                      : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-950/50'
                                  }`}
                                  onClick={() => {
                                    store.toggleBlockSupplier(supplier.id, supplier.userId);
                                    toast({ 
                                      title: supplier.blocked ? "Supplier unblocked" : "Supplier blocked" 
                                    });
                                  }}
                                  title={supplier?.blocked ? "Unblock" : "Block"}
                                >
                                  {supplier?.blocked ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                </Button>
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-950/50"
                                  onClick={() => handleDeleteSupplier(supplier)}
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Products */}
          {activeTab === "products" && (
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900 dark:text-white">Product Management</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  Manage product visibility and featured status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories && categories.map((cat) => {
                    const catProducts = allProducts ? allProducts.filter((p) => p.category === cat.id) : [];
                    return (
                      <Card key={cat.id} className="border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-slate-900 dark:text-white">{cat.name}</h3>
                            <Badge variant="outline" className="bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700">
                              {catProducts.length}
                            </Badge>
                          </div>
                        </div>
                        <div className="divide-y divide-slate-200 dark:divide-slate-800">
                          {catProducts.map((product) => {
                            const isHidden = hiddenProducts.includes(product.id);
                            return (
                              <div key={product.id} className={`p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors ${isHidden ? 'opacity-60' : ''}`}>
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
                                    {product.image ? (
                                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <Package className="w-5 h-5 text-slate-400" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium text-slate-900 dark:text-white">{product.name}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{product.origin}</p>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className={`h-8 ${
                                    isHidden 
                                      ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-950/50' 
                                      : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/50'
                                  }`}
                                  onClick={() => store.toggleProductVisibility(product.id)}
                                >
                                  {isHidden ? (
                                    <><Eye className="w-4 h-4 mr-1" /> Show</>
                                  ) : (
                                    <><EyeOff className="w-4 h-4 mr-1" /> Hide</>
                                  )}
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quotations */}
          {activeTab === "quotations" && (
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900 dark:text-white">Quotation Requests</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  Review and manage buyer quotation requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {quotations.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">No quotation requests yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quotations.map((q) => {
                      const buyer = buyers.find(b => b.userId === q.userId);
                      return (
                        <Card key={q.id} className="border-slate-200 dark:border-slate-800 overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                                    {q.name?.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-slate-900 dark:text-white">{q.name}</p>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">{q.email}</p>
                                  {buyer && (
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                      Registered buyer
                                    </p>
                                  )}
                                </div>
                              </div>
                              <Badge className={
                                q.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' :
                                q.status === 'quoted' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800' :
                                q.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800' :
                                'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                              } variant="outline">
                                {q.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Products Requested</p>
                                <div className="space-y-2">
                                  {q.products.map((p, idx) => (
                                    <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                                      <p className="text-sm font-medium text-slate-900 dark:text-white">{p.name}</p>
                                      <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mt-1">
                                        <span>Qty: {p.quantity}</span>
                                        {p.price && <span>Unit Price: ${p.price}</span>}
                                      </div>
                                      {p.note && (
                                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 italic">"{p.note}"</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Details</p>
                                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Globe className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-700 dark:text-slate-300">{q.country}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-700 dark:text-slate-300">{q.date}</span>
                                  </div>
                                  {q.totalAmount && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <DollarSign className="w-4 h-4 text-slate-400" />
                                      <span className="font-medium text-slate-900 dark:text-white">${q.totalAmount.toLocaleString()}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {q.generalNote && (
                              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg mb-4">
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">General Note</p>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{q.generalNote}</p>
                              </div>
                            )}

                            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
                                onClick={() => {
                                  store.updateQuotationStatus(q.id, 'approved');
                                  toast({ title: "Quotation approved" });
                                }}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/50"
                                onClick={() => {
                                  store.updateQuotationStatus(q.id, 'quoted');
                                  toast({ title: "Quote sent" });
                                }}
                              >
                                <FileText className="w-4 h-4" />
                                Send Quote
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-950/50"
                                onClick={() => {
                                  if (window.confirm('Delete this quotation?')) {
                                    store.deleteQuotation(q.id);
                                    toast({ title: "Quotation deleted" });
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Messages */}
          {activeTab === "messages" && (
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900 dark:text-white">Contact Messages</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  Manage customer inquiries and messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contactMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">No messages yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contactMessages.map((msg) => (
                      <Card
                        key={msg.id}
                        className={`border-slate-200 dark:border-slate-800 overflow-hidden ${
                          !msg.read ? 'border-l-4 border-l-amber-500' : ''
                        }`}
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                                  {msg.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-slate-900 dark:text-white">{msg.name}</p>
                                  {!msg.read && (
                                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-0 text-xs">
                                      New
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{msg.email}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 dark:text-slate-500">
                                  <span>{msg.country}</span>
                                  <span>•</span>
                                  <span>{msg.date}</span>
                                  {msg.phone && (
                                    <>
                                      <span>•</span>
                                      <span>{msg.phone}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
                                onClick={() => {
                                  window.location.href = `mailto:${msg.email}?subject=Re: ${msg.subject}`;
                                  if (!msg.replied) {
                                    store.markMessageReplied(msg.id);
                                  }
                                }}
                              >
                                <Mail className="w-4 h-4" />
                                Reply
                              </Button>
                              {!msg.read && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-950/50"
                                  onClick={() => {
                                    store.markMessageRead(msg.id);
                                    toast({ title: "Message marked as read" });
                                  }}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-950/50"
                                onClick={() => {
                                  if (window.confirm('Delete this message?')) {
                                    store.deleteMessage(msg.id);
                                    toast({ title: "Message deleted" });
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject: {msg.subject}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                          </div>

                          {msg.replied && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Replied</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardContent className="p-8 text-center">
                <Settings className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Platform Settings</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Configure seasonal products, bank details, and platform settings.</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Backend integration required for full functionality.</p>
                
                {/* Debug section - remove in production */}
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-4">Debug Tools</h4>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-rose-600 hover:bg-rose-700 text-white"
                    onClick={() => {
                      if (window.confirm('This will clear ALL buyer and supplier data. Are you sure?')) {
                        store.clearAllData();
                        toast({ title: "All data cleared", description: "Refresh to see changes." });
                      }
                    }}
                  >
                    Clear All Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Enhanced Buyer Details Dialog */}
      <Dialog open={showBuyerDetails} onOpenChange={setShowBuyerDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Users className="w-6 h-6 text-indigo-600" />
              Buyer Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedBuyer && (
            <Tabs defaultValue="overview" className="mt-4">
              <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-900 p-1">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-400">Overview</TabsTrigger>
                <TabsTrigger value="personal" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-400">Personal Info</TabsTrigger>
                <TabsTrigger value="business" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-400">Business</TabsTrigger>
                <TabsTrigger value="quotations" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-400">
                  Quotations ({buyerQuotations.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 mt-4">
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-900 dark:text-white">Activity Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-lg">
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-1">Total Spent</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                          ${selectedBuyer.totalSpent?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg">
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Quotations</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                          {selectedBuyer.quotationsCount || 0}
                        </p>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg">
                        <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">Avg. Order</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                          ${selectedBuyer.averageOrderValue?.toLocaleString() || '0'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm border-t border-slate-200 dark:border-slate-800 pt-4">
                      <div>
                        <p className="text-slate-500 dark:text-slate-400">Last Active</p>
                        <p className="font-medium text-slate-900 dark:text-white">{selectedBuyer.lastActive || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400">Registered</p>
                        <p className="font-medium text-slate-900 dark:text-white">{selectedBuyer.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="personal" className="space-y-4 mt-4">
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-white">
                      <User className="w-4 h-4 text-indigo-600" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Full Name</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">{selectedBuyer.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">{selectedBuyer.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Phone</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">{selectedBuyer.phone}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Country</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">{selectedBuyer.country}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">City</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">{selectedBuyer.city || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Port</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">{selectedBuyer.port || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="business" className="space-y-4 mt-4">
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-white">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      Business Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Company</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">{selectedBuyer.company || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Business Type</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">{selectedBuyer.businessType || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Years in Business</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">{selectedBuyer.yearsInBusiness || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Tax ID</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">{selectedBuyer.taxId || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Website</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">
                          {selectedBuyer.website ? (
                            <a href={selectedBuyer.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                              {selectedBuyer.website}
                            </a>
                          ) : 'N/A'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Annual Volume</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">
                          {selectedBuyer.annualVolume ? `$${selectedBuyer.annualVolume}` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Products of Interest</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedBuyer.productsOfInterest ? (
                          selectedBuyer.productsOfInterest.split(', ').map((product, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-0">
                              {product}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500 dark:text-slate-400">No products specified</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Newsletter</p>
                      <Badge variant={selectedBuyer.newsletter ? "default" : "secondary"} className={
                        selectedBuyer.newsletter 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0' 
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-0'
                      }>
                        {selectedBuyer.newsletter ? 'Subscribed' : 'Not Subscribed'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="quotations" className="space-y-4 mt-4">
                {buyerQuotations.length === 0 ? (
                  <Card className="border-slate-200 dark:border-slate-800">
                    <CardContent className="text-center py-8">
                      <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                      <p className="text-slate-500 dark:text-slate-400">No quotations from this buyer yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  buyerQuotations.map((q, idx) => (
                    <Card key={q.id} className="border-slate-200 dark:border-slate-800">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base text-slate-900 dark:text-white">Quotation #{idx + 1}</CardTitle>
                          <Badge className={
                            q.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' :
                            q.status === 'quoted' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800' :
                            q.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800' :
                            'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                          } variant="outline">
                            {q.status}
                          </Badge>
                        </div>
                        <CardDescription className="text-slate-500 dark:text-slate-400">Submitted on {q.date}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {q.products.map((p, pid) => (
                            <div key={pid} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                              <p className="font-medium text-sm text-slate-900 dark:text-white">{p.name}</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Quantity: {p.quantity}</p>
                              {p.note && <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 italic">"{p.note}"</p>}
                            </div>
                          ))}
                          {q.generalNote && (
                            <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">General Note</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{q.generalNote}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Enhanced Supplier Details Dialog */}
      <Dialog open={showSupplierDetails} onOpenChange={setShowSupplierDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Building2 className="w-6 h-6 text-emerald-600" />
              Supplier Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedSupplier && (
            <Tabs defaultValue="company" className="mt-4">
              <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-900 p-1">
                <TabsTrigger value="company" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-400">Company Info</TabsTrigger>
                <TabsTrigger value="products" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-400">Products</TabsTrigger>
                <TabsTrigger value="trade" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-400">Trade Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="company" className="space-y-4 mt-4">
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-white">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      Company Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Company Name</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">{selectedSupplier.company || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Contact Person</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">{selectedSupplier.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">{selectedSupplier.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Phone</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">{selectedSupplier.phone}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Country</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">{selectedSupplier.country}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Port</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">{selectedSupplier.port || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Business Type</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">{selectedSupplier.businessType || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Year Established</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">{selectedSupplier.yearEstablished || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Employees</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">{selectedSupplier.employeeCount || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Annual Revenue</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">
                          {selectedSupplier.currentRevenue ? `$${selectedSupplier.currentRevenue}` : 'N/A'}
                        </p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Website</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 break-all">
                          {selectedSupplier.website ? (
                            <a href={selectedSupplier.website} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                              {selectedSupplier.website}
                            </a>
                          ) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Badge variant={selectedSupplier.blocked ? "destructive" : "secondary"} className={
                        selectedSupplier.blocked 
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-0' 
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0'
                      }>
                        {selectedSupplier.blocked ? 'Blocked' : 'Active'}
                      </Badge>
                      {selectedSupplier.verified && (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">Verified</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="products" className="space-y-4 mt-4">
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-white">
                      <Package className="w-4 h-4 text-emerald-600" />
                      Export Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedSupplier.exportProducts?.map((product, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                          <p className="font-medium text-slate-900 dark:text-white">{product}</p>
                        </div>
                      ))}
                    </div>
                    
                    {selectedSupplier.productDetails && (
                      <div className="mt-4">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Product Details</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                          {selectedSupplier.productDetails}
                        </p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-lg">
                        <p className="text-xs text-indigo-600 dark:text-indigo-400">Supply Capacity</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">{selectedSupplier.capacity || 'N/A'}</p>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
                        <p className="text-xs text-amber-600 dark:text-amber-400">Min Order</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">{selectedSupplier.minOrderQuantity || 'N/A'}</p>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg">
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">Lead Time</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">{selectedSupplier.leadTime || 'N/A'} days</p>
                      </div>
                    </div>
                    
                    {selectedSupplier.certificates && selectedSupplier.certificates.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Certificates</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedSupplier.certificates.map((cert, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-0">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="trade" className="space-y-4 mt-4">
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-white">
                      <Globe className="w-4 h-4 text-emerald-600" />
                      Trade Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Export Markets</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSupplier.exportMarkets && selectedSupplier.exportMarkets.length > 0 ? (
                          selectedSupplier.exportMarkets.map((market, idx) => (
                            <Badge key={idx} variant="outline" className="bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700">
                              {market}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500 dark:text-slate-400">No markets specified</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Payment Terms</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSupplier.preferredPaymentTerms && selectedSupplier.preferredPaymentTerms.length > 0 ? (
                          selectedSupplier.preferredPaymentTerms.map((term, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-0">
                              {term}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500 dark:text-slate-400">No payment terms specified</p>
                        )}
                      </div>
                    </div>
                    
                    {selectedSupplier.bankName && (
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Banking Information</p>
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                          <p className="text-sm"><span className="text-slate-500 dark:text-slate-400">Bank:</span> <span className="text-slate-900 dark:text-white">{selectedSupplier.bankName}</span></p>
                          <p className="text-sm"><span className="text-slate-500 dark:text-slate-400">Account:</span> <span className="text-slate-900 dark:text-white">{selectedSupplier.bankAccount}</span></p>
                          <p className="text-sm"><span className="text-slate-500 dark:text-slate-400">SWIFT:</span> <span className="text-slate-900 dark:text-white">{selectedSupplier.swiftCode}</span></p>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-lg">
                          <p className="text-xs text-indigo-600 dark:text-indigo-400">Total Orders</p>
                          <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedSupplier.totalOrders || 0}</p>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg">
                          <p className="text-xs text-emerald-600 dark:text-emerald-400">Total Revenue</p>
                          <p className="text-lg font-bold text-slate-900 dark:text-white">${selectedSupplier.totalRevenue?.toLocaleString() || '0'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Logout Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-900 dark:text-white">Confirm Logout</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Re-enter your credentials to confirm logout.</p>
            
            <Input
              placeholder="Admin Email"
              type="email"
              value={logoutEmail}
              onChange={(e) => setLogoutEmail(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500"
            />
            
            <Input
              placeholder="Admin Password"
              type="password"
              value={logoutPassword}
              onChange={(e) => setLogoutPassword(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500"
            />
            
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowLogoutDialog(false)} className="flex-1 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                Cancel
              </Button>
              <Button onClick={handleLogout} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white">
                Logout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;