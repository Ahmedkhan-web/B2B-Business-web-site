import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Package, FileText, MessageSquare, 
  Settings, LogOut, Menu, Building2, Eye, EyeOff, Ban, 
  UserCheck, Trash2, Mail, ChevronRight
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
import { useAuthStore } from "@/lib/authStore";
import { useAdminStore } from "@/lib/adminStore";
import { useToast } from "@/hooks/use-toast";
import { categories, allProducts } from "@/lib/productData";

// Import types from your store
import type { BuyerEntry, SupplierEntry, ContactMessage, QuotationEntry } from "@/lib/adminStore";

const sidebarItems: { icon: React.FC<{ className?: string }>; label: string; id: string }[] = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Users, label: "Buyers", id: "buyers" },
  { icon: Building2, label: "Suppliers", id: "suppliers" },
  { icon: Package, label: "Products", id: "products" },
  { icon: FileText, label: "Quotations", id: "quotations" },
  { icon: MessageSquare, label: "Contact Messages", id: "messages" },
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
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerEntry | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierEntry | null>(null);
  const [showBuyerDetails, setShowBuyerDetails] = useState<boolean>(false);
  const [showSupplierDetails, setShowSupplierDetails] = useState<boolean>(false);

  // Check if user is admin
  if (!isLoggedIn || !user || user.role !== 'admin') {
    return <Navigate to="/admin-login" replace />;
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

  const unreadMessages: number = store.contactMessages.filter((m: ContactMessage) => !m.read).length;

  // Stats for dashboard
  const stats = {
    totalBuyers: store.buyers.length,
    totalSuppliers: store.suppliers.length,
    totalProducts: allProducts.length,
    totalQuotations: store.quotations.length,
    totalMessages: store.contactMessages.length,
    blockedBuyers: store.buyers.filter((b: BuyerEntry) => b.blocked).length,
    blockedSuppliers: store.suppliers.filter((s: SupplierEntry) => s.blocked).length,
    unreadMessages
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col fixed h-full z-30`}>
        <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
          <div className={`flex items-center ${sidebarOpen ? 'space-x-2' : 'justify-center w-full'}`}>
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            {sidebarOpen && <span className="font-bold text-sm text-gray-900 dark:text-white">Admin Panel</span>}
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
                    ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.id === 'messages' && unreadMessages > 0 && (
                      <span className="w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                        {unreadMessages}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
        
        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && "Sign Out"}
          </button>
        </div>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${!sidebarOpen && 'rotate-180'}`} />
        </button>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
            {activeTab}
          </h1>
          
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden md:block relative">
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-64 pl-9"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Admin Profile */}
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-red-600 text-white">A</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Admin</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
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
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Buyers</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalBuyers}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                  {stats.blockedBuyers > 0 && (
                    <p className="text-xs text-red-600 mt-2">{stats.blockedBuyers} blocked</p>
                  )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Suppliers</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalSuppliers}</p>
                    </div>
                    <Building2 className="w-8 h-8 text-green-500" />
                  </div>
                  {stats.blockedSuppliers > 0 && (
                    <p className="text-xs text-red-600 mt-2">{stats.blockedSuppliers} blocked</p>
                  )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalProducts}</p>
                    </div>
                    <Package className="w-8 h-8 text-purple-500" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{store.hiddenProducts.length} hidden</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Messages</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalMessages}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-amber-500" />
                  </div>
                  {stats.unreadMessages > 0 && (
                    <p className="text-xs text-amber-600 mt-2">{stats.unreadMessages} unread</p>
                  )}
                </div>
              </div>

              {/* Recent Buyers and Suppliers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Buyers</h3>
                  {store.buyers.slice(0, 5).map((buyer: BuyerEntry) => (
                    <div key={buyer.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{buyer.name}</p>
                        <p className="text-xs text-gray-500">{buyer.country}</p>
                      </div>
                      <Badge variant={buyer.blocked ? "destructive" : "secondary"}>
                        {buyer.blocked ? 'Blocked' : 'Active'}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Suppliers</h3>
                  {store.suppliers.slice(0, 5).map((supplier: SupplierEntry) => (
                    <div key={supplier.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{supplier.name}</p>
                        <p className="text-xs text-gray-500">{supplier.country}</p>
                      </div>
                      <Badge variant={supplier.blocked ? "destructive" : "secondary"}>
                        {supplier.blocked ? 'Blocked' : 'Active'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Buyers */}
          {activeTab === "buyers" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Buyer Management ({store.buyers.length})</h3>
                
                <div className="flex items-center gap-2">
                  <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value)}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {store.buyers.length === 0 ? (
                <p className="p-6 text-center text-gray-500">No buyer registrations yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-400">Name</th>
                        <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-400">Email</th>
                        <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-400 hidden md:table-cell">Country</th>
                        <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-400 hidden lg:table-cell">Date</th>
                        <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-400">Status</th>
                        <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {store.buyers
                        .filter((b: BuyerEntry) => {
                          if (statusFilter === 'active') return !b.blocked;
                          if (statusFilter === 'blocked') return b.blocked;
                          return true;
                        })
                        .filter((b: BuyerEntry) => 
                          b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (b.company?.toLowerCase() || '').includes(searchTerm.toLowerCase())
                        )
                        .map((buyer: BuyerEntry) => (
                        <tr key={buyer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{buyer.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{buyer.name}</p>
                                {buyer.company && (
                                  <p className="text-xs text-gray-500">{buyer.company}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{buyer.email}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden md:table-cell">{buyer.country}</td>
                          <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{buyer.date}</td>
                          <td className="px-4 py-3">
                            <Badge variant={buyer.blocked ? "destructive" : "secondary"}>
                              {buyer.blocked ? 'Blocked' : 'Active'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  setSelectedBuyer(buyer);
                                  setShowBuyerDetails(true);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`h-8 w-8 p-0 ${buyer.blocked ? 'text-green-600' : 'text-red-600'}`}
                                onClick={() => {
                                  store.toggleBlockBuyer(buyer.id);
                                  toast({ 
                                    title: buyer.blocked ? "Buyer unblocked" : "Buyer blocked" 
                                  });
                                }}
                              >
                                {buyer.blocked ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-600"
                                onClick={() => {
                                  if (window.confirm('Delete this buyer?')) {
                                    store.deleteBuyer(buyer.id);
                                    toast({ title: "Buyer deleted" });
                                  }
                                }}
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
            </div>
          )}

          {/* Suppliers */}
          {activeTab === "suppliers" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Supplier Management ({store.suppliers.length})</h3>
                
                <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {store.suppliers.length === 0 ? (
                <p className="p-6 text-center text-gray-500">No supplier registrations yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-400">Name</th>
                        <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-400">Company</th>
                        <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-400 hidden md:table-cell">Country</th>
                        <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-400 hidden lg:table-cell">Products</th>
                        <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-400">Status</th>
                        <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {store.suppliers
                        .filter((s: SupplierEntry) => {
                          if (statusFilter === 'active') return !s.blocked;
                          if (statusFilter === 'blocked') return s.blocked;
                          return true;
                        })
                        .filter((s: SupplierEntry) => 
                          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (s.company?.toLowerCase() || '').includes(searchTerm.toLowerCase())
                        )
                        .map((supplier: SupplierEntry) => (
                        <tr key={supplier.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{supplier.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{supplier.name}</p>
                                <p className="text-xs text-gray-500">{supplier.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{supplier.company}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden md:table-cell">{supplier.country}</td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {supplier.exportProducts.slice(0, 2).map((prod: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {prod}
                                </Badge>
                              ))}
                              {supplier.exportProducts.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{supplier.exportProducts.length - 2}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={supplier.blocked ? "destructive" : "secondary"}>
                              {supplier.blocked ? 'Blocked' : 'Active'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  setSelectedSupplier(supplier);
                                  setShowSupplierDetails(true);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`h-8 w-8 p-0 ${supplier.blocked ? 'text-green-600' : 'text-red-600'}`}
                                onClick={() => {
                                  store.toggleBlockSupplier(supplier.id);
                                  toast({ 
                                    title: supplier.blocked ? "Supplier unblocked" : "Supplier blocked" 
                                  });
                                }}
                              >
                                {supplier.blocked ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-600"
                                onClick={() => {
                                  if (window.confirm('Delete this supplier?')) {
                                    store.deleteSupplier(supplier.id);
                                    toast({ title: "Supplier deleted" });
                                  }
                                }}
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
            </div>
          )}

          {/* Products */}
          {activeTab === "products" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Toggle product visibility. Hidden products won't appear on the website.
              </p>
              
              {categories.map((cat) => {
                const catProducts = allProducts.filter((p) => p.category === cat.id);
                return (
                  <div key={cat.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {cat.name} ({catProducts.length})
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {catProducts.map((product) => {
                        const isHidden = store.hiddenProducts.includes(product.id);
                        return (
                          <div key={product.id} className={`p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 ${isHidden ? 'opacity-60' : ''}`}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                                {product.image && (
                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                                <p className="text-sm text-gray-500">{product.origin}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className={`h-8 ${isHidden ? 'text-green-600' : 'text-gray-600'}`}
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
                  </div>
                );
              })}
            </div>
          )}

          {/* Quotations */}
          {activeTab === "quotations" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Quotation Requests ({store.quotations.length})</h3>
              </div>

              {store.quotations.length === 0 ? (
                <p className="p-6 text-center text-gray-500">No quotation requests yet.</p>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {store.quotations.map((q: QuotationEntry) => (
                    <div key={q.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{q.name}</p>
                          <p className="text-sm text-gray-600">{q.email}</p>
                          <p className="text-xs text-gray-500 mt-1">{q.country} • {q.date}</p>
                          
                          <div className="mt-2 space-y-1">
                            {q.products.map((p: { name: string; quantity: number; note: string }, idx: number) => (
                              <p key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                                • {p.name} × {p.quantity}
                              </p>
                            ))}
                          </div>
                          
                          {q.generalNote && (
                            <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded">
                              Note: {q.generalNote}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            q.status === 'approved' ? 'default' : 
                            q.status === 'quoted' ? 'secondary' : 'outline'
                          }>
                            {q.status}
                          </Badge>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-600"
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          {activeTab === "messages" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Contact Messages ({store.contactMessages.length})</h3>
              </div>

              {store.contactMessages.length === 0 ? (
                <p className="p-6 text-center text-gray-500">No contact messages yet.</p>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {store.contactMessages.map((msg: ContactMessage) => (
                    <div key={msg.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${!msg.read ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}`}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 dark:text-white">{msg.name}</p>
                            {!msg.read && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{msg.email}</p>
                          <p className="text-xs text-gray-500 mt-1">{msg.country} • {msg.date}</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">{msg.subject}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{msg.message}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!msg.read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                store.markMessageRead(msg.id);
                                toast({ title: "Message marked as read" });
                              }}
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Mark Read
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600"
                            onClick={() => {
                              if (window.confirm('Delete this message?')) {
                                store.deleteContactMessage(msg.id);
                                toast({ title: "Message deleted" });
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Platform Settings</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Configure seasonal products, bank details, and platform settings.</p>
              <p className="text-xs text-gray-500 mt-1">Backend integration required for full functionality.</p>
            </div>
          )}
        </div>
      </main>

      {/* Buyer Details Dialog */}
      <Dialog open={showBuyerDetails} onOpenChange={setShowBuyerDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Buyer Details</DialogTitle>
          </DialogHeader>
          
          {selectedBuyer && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="text-lg">{selectedBuyer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedBuyer.name}</h3>
                  <p className="text-gray-500">{selectedBuyer.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBuyer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBuyer.country}</p>
                </div>
                {selectedBuyer.company && (
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBuyer.company}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Registered</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBuyer.date}</p>
                </div>
                {selectedBuyer.city && (
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBuyer.city}</p>
                  </div>
                )}
                {selectedBuyer.productsOfInterest && (
                  <div>
                    <p className="text-sm text-gray-500">Products of Interest</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBuyer.productsOfInterest}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Supplier Details Dialog */}
      <Dialog open={showSupplierDetails} onOpenChange={setShowSupplierDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Supplier Details</DialogTitle>
          </DialogHeader>
          
          {selectedSupplier && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="text-lg">{selectedSupplier.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedSupplier.name}</h3>
                  <p className="text-gray-500">{selectedSupplier.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedSupplier.company}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedSupplier.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedSupplier.country}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registered</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedSupplier.date}</p>
                </div>
                {selectedSupplier.website && (
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedSupplier.website}</p>
                  </div>
                )}
                {selectedSupplier.capacity && (
                  <div>
                    <p className="text-sm text-gray-500">Capacity</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedSupplier.capacity}</p>
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Export Products</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSupplier.exportProducts.map((product: string, idx: number) => (
                    <Badge key={idx} variant="secondary">{product}</Badge>
                  ))}
                </div>
              </div>
              
              {selectedSupplier.productDetails && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Details</p>
                  <p className="text-sm text-gray-600">{selectedSupplier.productDetails}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Logout Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Re-enter your credentials to confirm logout.</p>
            
            <Input
              placeholder="Admin Email"
              type="email"
              value={logoutEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogoutEmail(e.target.value)}
            />
            
            <Input
              placeholder="Admin Password"
              type="password"
              value={logoutPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogoutPassword(e.target.value)}
            />
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowLogoutDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleLogout} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
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