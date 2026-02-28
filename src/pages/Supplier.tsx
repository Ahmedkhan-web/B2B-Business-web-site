import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Building2, CheckCircle2, Phone, AlertCircle, Globe2, 
  MapPin, Ship, Factory, Package2, ShieldCheck, FileText,
  ArrowRight, Mail, Lock, User, Plus, X, Download, Upload,
  Calendar, DollarSign, Scale, Truck, Edit3, Save, LayoutDashboard,
  MessageSquare, Users, Settings, LogOut, Award, Clock,
  TrendingUp, BarChart, Star, FileCheck, BookOpen, Send, Eye,
  Trash2, Edit, MoreVertical, Copy, Printer, Download as DownloadIcon,
  Filter, Search, Grid, List, ChevronDown, ChevronUp, Info,
  CreditCard, Building, Briefcase, Globe, Hash, Fingerprint
} from "lucide-react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { countries } from "@/lib/countryData";
import { validateEmail, validatePhone, getPhoneRule } from "@/lib/validationUtils";
import { useAdminStore } from "@/lib/adminStore";
import { Link } from "react-router-dom";

// Define types for product
interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  specifications: string;
  price: string;
  priceUnit: string;
  minOrderQuantity: string;
  minOrderUnit: string;
  supplyCapacity: string;
  capacityUnit: string;
  images: File[];
  certifications: string[];
  hsCode: string;
  origin: string;
  packaging: string;
  leadTime: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
}

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
  companyName: string;
  businessType: string;
  name: string;
  email: string;
  phone: string;
  phoneCode: string;
  city: string;
  currentRevenue: string;
  profileData: {
    companyName: string;
    businessType: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    currentRevenue: string;
  };
  setProfileData: React.Dispatch<React.SetStateAction<{
    companyName: string;
    businessType: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    currentRevenue: string;
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
  onLogout: () => void;
}

// Define props type for ProductsManager
interface ProductsManagerProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
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
    <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300 max-w-[90vw] sm:max-w-md">
      <div className="bg-green-500/90 backdrop-blur-sm text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl border border-green-400/30 flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
        <span className="font-medium break-words">{message}</span>
      </div>
    </div>
  );
};

// Message Center Component
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
      { id: 1, text: "Welcome to the Supplier Portal. Our team will assist you with your inquiries.", sender: "support", time: "09:00 AM" }
    ]);
  };

  return (
    <div className="glass-card flex flex-col h-[500px] sm:h-[600px] overflow-hidden gradient-border">
      <div className="p-3 sm:p-4 border-b border-white/10 bg-white/5 flex flex-wrap justify-between items-center gap-2">
        <h3 className="font-bold flex items-center gap-2 text-sm sm:text-base"><MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> Supplier Support</h3>
        <div className="flex items-center gap-2">
          <span className="text-[8px] sm:text-[10px] bg-green-500/20 text-green-500 px-2 py-1 rounded-full font-bold uppercase">Online</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 sm:h-8 px-2 text-muted-foreground hover:text-destructive"
            onClick={handleClearChat}
            title="Clear chat history"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 bg-black/20">
        {messagesList.map((msg) => (
          <div key={msg.id} className={`flex flex-col gap-1 ${msg.sender === "user" ? "items-end ml-auto" : "items-start"} max-w-[90%] sm:max-w-[80%]`}>
            <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm ${msg.sender === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted text-foreground rounded-tl-none"}`}>
              {msg.text}
            </div>
            <span className="text-[8px] sm:text-[9px] text-muted-foreground px-1">{msg.sender === "user" ? "You" : "Support"} • {msg.time}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white/5 border-t border-white/10 flex gap-2">
        <Input 
          placeholder="Type your message..." 
          className="bg-black/40 border-white/10 text-sm" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="submit" className="btn-gradient-gold px-3 sm:px-4"><Send className="w-3 h-3 sm:w-4 sm:h-4" /></Button>
      </form>
    </div>
  );
};

// Product Management Component
const ProductsManager = ({ products, setProducts }: ProductsManagerProps) => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  
  // New product form state
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: '',
    description: '',
    specifications: '',
    price: '',
    priceUnit: 'USD',
    minOrderQuantity: '',
    minOrderUnit: 'MT',
    supplyCapacity: '',
    capacityUnit: 'MT/year',
    images: [],
    certifications: [],
    hsCode: '',
    origin: '',
    packaging: '',
    leadTime: '',
    status: 'draft'
  });

  // Product categories (expanded)
  const productCategories = [
    "Grains & Pulses",
    "Edible Oils", 
    "Spices",
    "Fruits & Vegetables",
    "Processed Foods",
    "Chemicals",
    "Petrochemicals",
    "Pharmaceuticals",
    "Fertilizers",
    "Paper & Pulp",
    "Scrap Materials",
    "Metals & Minerals",
    "Textiles",
    "Leather Goods",
    "Handicrafts",
    "Machinery",
    "Electronics",
    "Automotive Parts",
    "Construction Materials",
    "Packaging Materials",
    "Agricultural Products",
    "Dairy Products",
    "Meat & Poultry",
    "Seafood",
    "Beverages",
    "Essential Oils",
    "Raw Materials",
    "Industrial Supplies"
  ];

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category) return;
    
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name || '',
      category: newProduct.category || '',
      description: newProduct.description || '',
      specifications: newProduct.specifications || '',
      price: newProduct.price || '',
      priceUnit: newProduct.priceUnit || 'USD',
      minOrderQuantity: newProduct.minOrderQuantity || '',
      minOrderUnit: newProduct.minOrderUnit || 'MT',
      supplyCapacity: newProduct.supplyCapacity || '',
      capacityUnit: newProduct.capacityUnit || 'MT/year',
      images: newProduct.images || [],
      certifications: newProduct.certifications || [],
      hsCode: newProduct.hsCode || '',
      origin: newProduct.origin || '',
      packaging: newProduct.packaging || '',
      leadTime: newProduct.leadTime || '',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    setProducts([...products, product]);
    setNewProduct({
      name: '',
      category: '',
      description: '',
      specifications: '',
      price: '',
      priceUnit: 'USD',
      minOrderQuantity: '',
      minOrderUnit: 'MT',
      supplyCapacity: '',
      capacityUnit: 'MT/year',
      images: [],
      certifications: [],
      hsCode: '',
      origin: '',
      packaging: '',
      leadTime: '',
      status: 'draft'
    });
    setShowAddProduct(false);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    
    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleDuplicateProduct = (product: Product) => {
    const duplicate: Product = {
      ...product,
      id: Date.now().toString(),
      name: `${product.name} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString()
    };
    setProducts([...products, duplicate]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewProduct({...newProduct, images: [...(newProduct.images || []), ...files]});
  };

  const removeImage = (index: number) => {
    const newImages = [...(newProduct.images || [])];
    newImages.splice(index, 1);
    setNewProduct({...newProduct, images: newImages});
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.hsCode.includes(searchTerm);
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Package2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" /> Product Catalog
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Manage your products and inventory</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 h-8 sm:h-9 px-2 sm:px-3"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="w-3 h-3 sm:w-4 sm:h-4" /> : <Grid className="w-3 h-3 sm:w-4 sm:h-4" />}
          </Button>
          <Button
            className="btn-gradient-gold h-8 sm:h-9 text-xs sm:text-sm"
            onClick={() => setShowAddProduct(true)}
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="bg-white/5 border-white/10 pl-8 sm:pl-9 text-sm h-8 sm:h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="bg-white/5 border-white/10 h-8 sm:h-10 text-sm">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {productCategories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="bg-white/5 border-white/10 h-8 sm:h-10 text-sm">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs sm:text-sm text-muted-foreground flex items-center">
            {filteredProducts.length} products found
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddProduct || editingProduct) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto" onClick={() => {
          setShowAddProduct(false);
          setEditingProduct(null);
        }}>
          <div className="bg-background border border-white/10 rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-background">
              <h3 className="text-base sm:text-xl font-bold flex items-center gap-2">
                <Package2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => {
                setShowAddProduct(false);
                setEditingProduct(null);
              }}>
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Basic Information */}
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="font-bold text-primary text-sm sm:text-base">Basic Information</h4>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Product Name *</label>
                    <Input
                      placeholder="e.g., Premium Basmati Rice"
                      value={editingProduct ? editingProduct.name : newProduct.name}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, name: e.target.value})
                        : setNewProduct({...newProduct, name: e.target.value})
                      }
                      className="bg-white/5 border-white/10 h-8 sm:h-10 text-sm"
                    />
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Category *</label>
                    <Select 
                      value={editingProduct ? editingProduct.category : newProduct.category}
                      onValueChange={(val) => editingProduct 
                        ? setEditingProduct({...editingProduct, category: val})
                        : setNewProduct({...newProduct, category: val})
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 h-8 sm:h-10 text-sm">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="max-h-40 sm:max-h-60">
                        {productCategories.map(cat => (
                          <SelectItem key={cat} value={cat} className="text-sm">{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">HS Code</label>
                    <Input
                      placeholder="e.g., 1006.30"
                      value={editingProduct ? editingProduct.hsCode : newProduct.hsCode}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, hsCode: e.target.value})
                        : setNewProduct({...newProduct, hsCode: e.target.value})
                      }
                      className="bg-white/5 border-white/10 h-8 sm:h-10 text-sm"
                    />
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Country of Origin</label>
                    <Select 
                      value={editingProduct ? editingProduct.origin : newProduct.origin}
                      onValueChange={(val) => editingProduct 
                        ? setEditingProduct({...editingProduct, origin: val})
                        : setNewProduct({...newProduct, origin: val})
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 h-8 sm:h-10 text-sm">
                        <SelectValue placeholder="Select origin" />
                      </SelectTrigger>
                      <SelectContent className="max-h-40 sm:max-h-60">
                        {countries.map(c => (
                          <SelectItem key={c.code} value={c.name} className="text-sm">{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Pricing & Quantity */}
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="font-bold text-primary text-sm sm:text-base">Pricing & Quantity</h4>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Price</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={editingProduct ? editingProduct.price : newProduct.price}
                        onChange={(e) => editingProduct 
                          ? setEditingProduct({...editingProduct, price: e.target.value})
                          : setNewProduct({...newProduct, price: e.target.value})
                        }
                        className="bg-white/5 border-white/10 flex-1 h-8 sm:h-10 text-sm"
                      />
                      <Select 
                        value={editingProduct ? editingProduct.priceUnit : newProduct.priceUnit}
                        onValueChange={(val) => editingProduct 
                          ? setEditingProduct({...editingProduct, priceUnit: val})
                          : setNewProduct({...newProduct, priceUnit: val})
                        }
                      >
                        <SelectTrigger className="w-16 sm:w-24 bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CNY">CNY</SelectItem>
                          <SelectItem value="JPY">JPY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Minimum Order Quantity</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="MOQ"
                        value={editingProduct ? editingProduct.minOrderQuantity : newProduct.minOrderQuantity}
                        onChange={(e) => editingProduct 
                          ? setEditingProduct({...editingProduct, minOrderQuantity: e.target.value})
                          : setNewProduct({...newProduct, minOrderQuantity: e.target.value})
                        }
                        className="bg-white/5 border-white/10 flex-1 h-8 sm:h-10 text-sm"
                      />
                      <Select 
                        value={editingProduct ? editingProduct.minOrderUnit : newProduct.minOrderUnit}
                        onValueChange={(val) => editingProduct 
                          ? setEditingProduct({...editingProduct, minOrderUnit: val})
                          : setNewProduct({...newProduct, minOrderUnit: val})
                        }
                      >
                        <SelectTrigger className="w-16 sm:w-24 bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MT">MT</SelectItem>
                          <SelectItem value="KG">KG</SelectItem>
                          <SelectItem value="Tons">Tons</SelectItem>
                          <SelectItem value="Units">Units</SelectItem>
                          <SelectItem value="Containers">Containers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Supply Capacity</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Capacity"
                        value={editingProduct ? editingProduct.supplyCapacity : newProduct.supplyCapacity}
                        onChange={(e) => editingProduct 
                          ? setEditingProduct({...editingProduct, supplyCapacity: e.target.value})
                          : setNewProduct({...newProduct, supplyCapacity: e.target.value})
                        }
                        className="bg-white/5 border-white/10 flex-1 h-8 sm:h-10 text-sm"
                      />
                      <Select 
                        value={editingProduct ? editingProduct.capacityUnit : newProduct.capacityUnit}
                        onValueChange={(val) => editingProduct 
                          ? setEditingProduct({...editingProduct, capacityUnit: val})
                          : setNewProduct({...newProduct, capacityUnit: val})
                        }
                      >
                        <SelectTrigger className="w-16 sm:w-24 bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MT/year">MT/year</SelectItem>
                          <SelectItem value="tons/year">tons/year</SelectItem>
                          <SelectItem value="kg/year">kg/year</SelectItem>
                          <SelectItem value="units/year">units/year</SelectItem>
                          <SelectItem value="containers/year">containers/year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Lead Time (days)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 15"
                      value={editingProduct ? editingProduct.leadTime : newProduct.leadTime}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, leadTime: e.target.value})
                        : setNewProduct({...newProduct, leadTime: e.target.value})
                      }
                      className="bg-white/5 border-white/10 h-8 sm:h-10 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Description & Specifications */}
              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-bold text-primary text-sm sm:text-base">Description & Specifications</h4>
                
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Description</label>
                  <Textarea
                    placeholder="Detailed description of your product..."
                    rows={2}
                    value={editingProduct ? editingProduct.description : newProduct.description}
                    onChange={(e) => editingProduct 
                      ? setEditingProduct({...editingProduct, description: e.target.value})
                      : setNewProduct({...newProduct, description: e.target.value})
                    }
                    className="bg-white/5 border-white/10 text-sm"
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Specifications</label>
                  <Textarea
                    placeholder="Technical specifications, grades, varieties..."
                    rows={2}
                    value={editingProduct ? editingProduct.specifications : newProduct.specifications}
                    onChange={(e) => editingProduct 
                      ? setEditingProduct({...editingProduct, specifications: e.target.value})
                      : setNewProduct({...newProduct, specifications: e.target.value})
                    }
                    className="bg-white/5 border-white/10 text-sm"
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Packaging Details</label>
                  <Input
                    placeholder="e.g., 25kg bags, 20ft containers"
                    value={editingProduct ? editingProduct.packaging : newProduct.packaging}
                    onChange={(e) => editingProduct 
                      ? setEditingProduct({...editingProduct, packaging: e.target.value})
                      : setNewProduct({...newProduct, packaging: e.target.value})
                    }
                    className="bg-white/5 border-white/10 h-8 sm:h-10 text-sm"
                  />
                </div>
              </div>

              {/* Images */}
              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-bold text-primary text-sm sm:text-base">Product Images</h4>
                
                <div className="border-2 border-dashed border-white/10 rounded-xl p-4 sm:p-6 text-center">
                  <input
                    type="file"
                    id="product-images"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="product-images"
                    className="cursor-pointer inline-flex flex-col items-center gap-2"
                  >
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                    <span className="text-xs sm:text-sm font-medium">Click to upload images</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">JPG, PNG, WEBP (Max 5MB each)</span>
                  </label>
                </div>

                {(newProduct.images && newProduct.images.length > 0) && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                    {newProduct.images.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Product ${index + 1}`}
                          className="w-full h-16 sm:h-24 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-2 h-2 sm:w-3 sm:h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3 pt-4">
                <Button
                  className="btn-gradient-gold flex-1 text-xs sm:text-sm h-8 sm:h-10"
                  onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
                <Button
                  variant="outline"
                  className="border-white/10 text-xs sm:text-sm h-8 sm:h-10"
                  onClick={() => {
                    setShowAddProduct(false);
                    setEditingProduct(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <div className="glass-card p-8 sm:p-12 text-center">
          <Package2 className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-base sm:text-xl font-bold mb-2">No Products Found</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">Get started by adding your first product</p>
          <Button onClick={() => setShowAddProduct(true)} className="btn-gradient-teal text-xs sm:text-sm h-8 sm:h-10">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Add Your First Product
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="glass-card overflow-hidden group hover:border-primary/30 transition-all">
              <div className="relative h-32 sm:h-40 lg:h-48 bg-gradient-to-br from-primary/10 to-secondary/10">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={URL.createObjectURL(product.images[0])}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package2 className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className={`text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold uppercase ${
                    product.status === 'active' ? 'bg-green-500/20 text-green-500' :
                    product.status === 'draft' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-gray-500/20 text-gray-500'
                  }`}>
                    {product.status}
                  </span>
                </div>
              </div>
              
              <div className="p-3 sm:p-4">
                <h4 className="font-bold text-sm sm:text-base mb-1 line-clamp-1">{product.name}</h4>
                <p className="text-[10px] sm:text-xs text-primary mb-2">{product.category}</p>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2 sm:mb-3">{product.description}</p>
                
                <div className="grid grid-cols-2 gap-1 sm:gap-2 text-[10px] sm:text-xs mb-2 sm:mb-3">
                  <div>
                    <span className="text-muted-foreground">Price:</span>
                    <p className="font-bold">{product.price} {product.priceUnit}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">MOQ:</span>
                    <p className="font-bold">{product.minOrderQuantity} {product.minOrderUnit}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-[10px] sm:text-xs h-7 sm:h-8 px-1 sm:px-2"
                    onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                  >
                    {expandedProduct === product.id ? 'Show Less' : 'View Details'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 text-primary"
                    onClick={() => setEditingProduct(product)}
                  >
                    <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 text-destructive"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8"
                    onClick={() => handleDuplicateProduct(product)}
                  >
                    <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>

                {expandedProduct === product.id && (
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 space-y-2 sm:space-y-3 animate-in slide-in-from-top-2">
                    <div>
                      <p className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Specifications</p>
                      <p className="text-[10px] sm:text-xs">{product.specifications || 'No specifications provided'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-1 sm:gap-2 text-[10px] sm:text-xs">
                      <div>
                        <p className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">HS Code</p>
                        <p className="font-mono">{product.hsCode || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Origin</p>
                        <p>{product.origin || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Packaging</p>
                        <p>{product.packaging || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Lead Time</p>
                        <p>{product.leadTime ? `${product.leadTime} days` : '—'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[8px] sm:text-[9px] uppercase font-bold text-muted-foreground">Supply Capacity</p>
                      <p className="text-[10px] sm:text-xs">{product.supplyCapacity} {product.capacityUnit}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left p-2 sm:p-4 text-[10px] sm:text-xs font-bold uppercase text-muted-foreground">Product</th>
                  <th className="text-left p-2 sm:p-4 text-[10px] sm:text-xs font-bold uppercase text-muted-foreground">Category</th>
                  <th className="text-left p-2 sm:p-4 text-[10px] sm:text-xs font-bold uppercase text-muted-foreground">Price</th>
                  <th className="text-left p-2 sm:p-4 text-[10px] sm:text-xs font-bold uppercase text-muted-foreground">MOQ</th>
                  <th className="text-left p-2 sm:p-4 text-[10px] sm:text-xs font-bold uppercase text-muted-foreground">Status</th>
                  <th className="text-left p-2 sm:p-4 text-[10px] sm:text-xs font-bold uppercase text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-2 sm:p-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-primary/10 rounded-lg overflow-hidden flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <img src={URL.createObjectURL(product.images[0])} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package2 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 m-1.5 sm:m-2 lg:m-2.5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs sm:text-sm truncate">{product.name}</p>
                          <p className="text-[8px] sm:text-[10px] text-muted-foreground truncate">HS: {product.hsCode || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 sm:p-4 text-[10px] sm:text-xs">{product.category}</td>
                    <td className="p-2 sm:p-4 text-[10px] sm:text-xs">{product.price} {product.priceUnit}</td>
                    <td className="p-2 sm:p-4 text-[10px] sm:text-xs">{product.minOrderQuantity} {product.minOrderUnit}</td>
                    <td className="p-2 sm:p-4">
                      <span className={`text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold uppercase whitespace-nowrap ${
                        product.status === 'active' ? 'bg-green-500/20 text-green-500' :
                        product.status === 'draft' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-gray-500/20 text-gray-500'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-2 sm:p-4">
                      <div className="flex gap-1 sm:gap-2">
                        <Button variant="ghost" size="icon" className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" onClick={() => setEditingProduct(product)}>
                          <Edit3 className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-destructive" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" onClick={() => handleDuplicateProduct(product)}>
                          <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Profile Settings Component
const ProfileSettings = ({ 
  companyName, 
  businessType, 
  name, 
  email, 
  phone,
  phoneCode,
  city,
  currentRevenue,
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
  phoneLengths,
  onLogout
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
    <div className="space-y-4 sm:space-y-6">
      <div className="glass-card p-4 sm:p-6 lg:p-8 gradient-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center border border-primary/30 flex-shrink-0">
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-primary" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold break-words">{profileData.companyName}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2"><Award className="w-3 h-3 sm:w-4 sm:h-4" /> {profileData.businessType}</p>
            </div>
          </div>
          <Button 
            variant={isEditingProfile ? "default" : "outline"} 
            className={`${isEditingProfile ? "btn-gradient-teal" : "border-white/10"} text-xs sm:text-sm h-8 sm:h-10 w-full sm:w-auto`}
            onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
          >
            {isEditingProfile ? <><Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Save</> : <><Edit3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Edit</>}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-primary">Company Details</h4>
            <div className="space-y-2 sm:space-y-3">
              <div className="space-y-1">
                <label className="text-[8px] sm:text-[10px] uppercase font-bold text-muted-foreground ml-1">Company Name</label>
                <Input 
                  disabled={!isEditingProfile} 
                  value={profileData.companyName} 
                  onChange={(e) => setProfileData({...profileData, companyName: e.target.value})} 
                  className="bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] sm:text-[10px] uppercase font-bold text-muted-foreground ml-1">Business Type</label>
                <Input 
                  disabled={!isEditingProfile} 
                  value={profileData.businessType} 
                  onChange={(e) => setProfileData({...profileData, businessType: e.target.value})} 
                  className="bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] sm:text-[10px] uppercase font-bold text-muted-foreground ml-1">City</label>
                <Input 
                  disabled={!isEditingProfile} 
                  value={profileData.city} 
                  onChange={(e) => setProfileData({...profileData, city: e.target.value})} 
                  className="bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] sm:text-[10px] uppercase font-bold text-muted-foreground ml-1">Annual Revenue</label>
                <div className="relative">
                  <DollarSign className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                  <Input 
                    disabled={!isEditingProfile} 
                    value={profileData.currentRevenue} 
                    onChange={(e) => setProfileData({...profileData, currentRevenue: e.target.value})} 
                    className="bg-white/5 border-white/10 pl-6 sm:pl-8 h-8 sm:h-10 text-xs sm:text-sm" 
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-primary">Contact Information</h4>
            <div className="space-y-2 sm:space-y-3">
              <div className="space-y-1">
                <label className="text-[8px] sm:text-[10px] uppercase font-bold text-muted-foreground ml-1">Contact Person</label>
                <Input 
                  disabled={!isEditingProfile} 
                  value={profileData.name} 
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
                  className="bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] sm:text-[10px] uppercase font-bold text-muted-foreground ml-1">Email Address</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Input 
                      disabled={!isEditingProfile} 
                      value={profileData.email} 
                      onChange={(e) => {
                        setProfileData({...profileData, email: e.target.value});
                      }} 
                      className={`bg-white/5 border-white/10 w-full h-8 sm:h-10 text-xs sm:text-sm ${isCurrentEmailVerified ? 'pr-8 sm:pr-10' : ''}`} 
                    />
                    {isCurrentEmailVerified && !isEditingProfile && (
                      <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                      </div>
                    )}
                  </div>
                  {isEditingProfile && profileData.email !== email && !isCurrentEmailVerified && !showEmailVerification && (
                    <Button 
                      type="button"
                      size="sm"
                      className="btn-gradient-teal whitespace-nowrap h-8 sm:h-10 text-xs sm:text-sm"
                      onClick={handleSendVerificationCode}
                    >
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Verify
                    </Button>
                  )}
                  {isCurrentEmailVerified && isEditingProfile && (
                    <div className="flex items-center px-2 sm:px-3 bg-green-500/10 text-green-500 rounded-lg text-[10px] sm:text-sm font-medium h-8 sm:h-10">
                      <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Verified
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] sm:text-[10px] uppercase font-bold text-muted-foreground ml-1">Phone Number</label>
                <div className="flex gap-2">
                  <div className="w-12 sm:w-16 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-[10px] sm:text-xs h-8 sm:h-10 flex-shrink-0">
                    {phoneCode || "—"}
                  </div>
                  <Input 
                    disabled={!isEditingProfile} 
                    placeholder="Enter phone number"
                    type="tel"
                    value={profileData.phone} 
                    onChange={(e) => handlePhoneChange(e.target.value)} 
                    className="bg-white/5 border-white/10 flex-1 h-8 sm:h-10 text-xs sm:text-sm" 
                  />
                </div>
                {phoneLengths.length > 0 && (
                  <p className="text-[8px] sm:text-[10px] text-muted-foreground mt-1">
                    Accepts {phoneLengths.join(' or ')} digits
                  </p>
                )}
                {phoneError && <p className="text-destructive text-[8px] sm:text-[10px] mt-1">{phoneError}</p>}
              </div>
            </div>
          </div>
        </div>
        
        {showEmailVerification && isEditingProfile && (
          <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-primary/10 rounded-xl border border-primary/20 animate-in fade-in slide-in-from-top-2">
            <h4 className="text-xs sm:text-sm font-bold flex items-center gap-2 mb-2 sm:mb-4">
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-primary" /> Verify New Email Address
            </h4>
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-3 sm:mb-4">
              A verification code has been sent to {profileData.email}. Please enter it below.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Input 
                placeholder="Enter 6-digit code" 
                className="bg-black/40 border-white/10 text-center text-base sm:text-lg tracking-widest h-8 sm:h-10"
                maxLength={6}
                value={emailVerificationCode}
                onChange={(e) => setEmailVerificationCode(e.target.value.replace(/\D/g, ''))}
              />
              <Button 
                className="btn-gradient-teal h-8 sm:h-10 text-xs sm:text-sm"
                onClick={handleVerifyEmail}
                disabled={emailVerificationCode.length !== 6}
              >
                Verify
              </Button>
            </div>
          </div>
        )}

        {isEditingProfile && !showEmailVerification && (
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3 animate-in fade-in slide-in-from-top-2">
            <Button 
              className="btn-gradient-gold flex-1 h-8 sm:h-10 text-xs sm:text-sm" 
              onClick={handleSaveProfile}
              disabled={(profileData.email !== email && !isCurrentEmailVerified) || !!phoneError}
            >
              Update Account
            </Button>
            <Button variant="ghost" className="h-8 sm:h-10 text-xs sm:text-sm" onClick={() => {
              setIsEditingProfile(false); 
              setProfileData({companyName, businessType, name, email, phone, city, currentRevenue});
              setShowEmailVerification(false);
              setEmailVerificationCode("");
            }}>Cancel</Button>
          </div>
        )}

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
          <Button variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive/10 h-8 sm:h-10 text-xs sm:text-sm" onClick={onLogout}>
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Logout
          </Button>
        </div>
      </div>

      <div className="glass-card p-4 sm:p-6 border-l-4 border-gold">
        <div className="flex items-center gap-3 sm:gap-4">
          <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-gold flex-shrink-0" />
          <div>
            <h4 className="font-bold text-xs sm:text-sm">Verification Status</h4>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {isEmailVerified ? "Email verified ✓" : "Email verification pending"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export Markets Options
const exportMarketOptions = [
  "North America (USA, Canada, Mexico)",
  "South America (Brazil, Argentina, Chile, etc.)",
  "Central America & Caribbean",
  "European Union (EU)",
  "United Kingdom",
  "Eastern Europe (Russia, Ukraine, Poland, etc.)",
  "Middle East (UAE, Saudi Arabia, Qatar, etc.)",
  "North Africa (Egypt, Morocco, Algeria, etc.)",
  "Sub-Saharan Africa",
  "Central Asia (Kazakhstan, Uzbekistan, etc.)",
  "South Asia (India, Pakistan, Bangladesh, etc.)",
  "Southeast Asia (Indonesia, Vietnam, Thailand, etc.)",
  "East Asia (China, Japan, South Korea)",
  "Oceania (Australia, New Zealand)",
  "Global - All Markets"
];

// Payment terms (updated - removed Western Union)
const paymentTerms = [
  "Letter of Credit (L/C)",
  "Telegraphic Transfer (T/T)",
  "Documentary Collection",
  "Open Account",
  "Cash in Advance",
  "PayPal",
  "Escrow"
];

const Supplier = () => {
  const [step, setStep] = useState(1);
  const [submitted, setIsSubmitted] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [view, setView] = useState("dashboard");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  
  // Company Information
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [yearEstablished, setYearEstablished] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [currentRevenue, setCurrentRevenue] = useState("");
  
  // Location Information
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedPort, setSelectedPort] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [warehouseLocation, setWarehouseLocation] = useState("");
  
  // Contact Information
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  
  // Business Details
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [exportMarkets, setExportMarkets] = useState<string[]>([]);
  const [capacity, setCapacity] = useState("");
  const [capacityUnit, setCapacityUnit] = useState("MT/year");
  const [productDetails, setProductDetails] = useState("");
  const [minOrderQuantity, setMinOrderQuantity] = useState("");
  const [leadTime, setLeadTime] = useState("");
  
  // Trade Information
  const [preferredPaymentTerms, setPreferredPaymentTerms] = useState<string[]>([]);
  
  // Banking Information (Optional - for security)
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [showBanking, setShowBanking] = useState(false);
  
  // Documents
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  
  // Products
  const [products, setProducts] = useState<Product[]>([]);
  
  // Validation States
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  
  // Step Validation States
  const [step1Errors, setStep1Errors] = useState<{[key: string]: string}>({});
  const [step2Errors, setStep2Errors] = useState<{[key: string]: string}>({});
  const [step3Errors, setStep3Errors] = useState<{[key: string]: string}>({});
  
  // Messages State
  const [messagesList, setMessagesList] = useState([
    { id: 1, text: "Welcome to the Supplier Portal. Our team will assist you with your inquiries.", sender: "support", time: "09:00 AM" }
  ]);
  
  // Profile email verification
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");

  // Success Popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const addSupplier = useAdminStore((s) => s.addSupplier);
  
  const countryInfo = countries.find((c) => c.name === selectedCountry);
  const phoneCode = countryInfo?.phoneCode || "";
  const countryCode = countryInfo?.code || "";
  const phoneLengths = countryInfo?.phoneLength || [];
  const availablePorts = countryInfo?.ports || [];

  // Profile State - Initialize with form data
  const [profileData, setProfileData] = useState({
    companyName: "",
    businessType: "",
    name: "",
    email: "",
    phone: "",
    city: "",
    currentRevenue: ""
  });

  // Update profile data when form data changes
  useEffect(() => {
    setProfileData({
      companyName,
      businessType,
      name,
      email,
      phone,
      city,
      currentRevenue
    });
  }, [companyName, businessType, name, email, phone, city, currentRevenue]);

  // Set verified email on registration
  useEffect(() => {
    if (submitted) {
      setVerifiedEmail(email);
      setIsEmailVerified(true);
    }
  }, [submitted]);

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

  const handleEmailBlur = () => {
    if (email) {
      const result = validateEmail(email);
      setEmailError(result.valid ? "" : result.message);
    }
  };

  const handleSendVerification = () => {
    if (!emailError && email) {
      setShowVerification(true);
      // In real app, send verification email here
    }
  };

  const handleVerifyCode = () => {
    if (verificationCode.length === 6) {
      setEmailVerified(true);
      setShowVerification(false);
    }
  };

  const toggleSelection = (item: string, list: string[], setList: (items: string[]) => void) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setCertificateFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setCertificateFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Validate Step 1
  const validateStep1 = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!companyName.trim()) errors.companyName = "Company name is required";
    if (!businessType) errors.businessType = "Business type is required";
    if (!selectedCountry) errors.country = "Country is required";
    if (!city.trim()) errors.city = "City is required";
    if (!name.trim()) errors.name = "Contact person name is required";
    if (!email.trim()) errors.email = "Email is required";
    else if (!validateEmail(email).valid) errors.email = validateEmail(email).message;
    if (!phone.trim()) errors.phone = "Phone number is required";
    else if (phoneLengths.length > 0 && !phoneLengths.includes(phone.length)) {
      errors.phone = `Phone number must be ${phoneLengths.join(' or ')} digits`;
    }
    
    setStep1Errors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate Step 2
  const validateStep2 = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (selectedProducts.length === 0) errors.products = "Please select at least one product";
    if (!capacity) errors.capacity = "Supply capacity is required";
    
    setStep2Errors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate Step 3
  const validateStep3 = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (preferredPaymentTerms.length === 0) errors.paymentTerms = "Please select at least one payment term";
    
    setStep3Errors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (validateStep1()) {
        if (!emailVerified) {
          handleSendVerification();
          return;
        }
        setStep(2);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    } else if (step === 3) {
      if (validateStep3()) {
        addSupplier({
          companyName,
          businessType,
          yearEstablished,
          employeeCount,
          currentRevenue,
          country: selectedCountry,
          port: selectedPort,
          city,
          address,
          warehouseLocation,
          name,
          designation,
          email,
          phone: `${phoneCode} ${phone}`,
          website,
          exportProducts: selectedProducts,
          exportMarkets,
          capacity: `${capacity} ${capacityUnit}`,
          productDetails,
          minOrderQuantity,
          leadTime,
          preferredPaymentTerms,
          bankName: showBanking ? bankName : undefined,
          bankAccount: showBanking ? bankAccount : undefined,
          swiftCode: showBanking ? swiftCode : undefined,
          certificates: certificateFiles.map(f => f.name),
          products: products,
          status: 'pending',
          registrationDate: new Date().toISOString(),
          emailVerified: true
        });
        
        setIsSubmitted(true);
        setSuccessMessage("Registration submitted successfully!");
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000);
      }
    }
  };

  // Profile Handlers
  const handleSaveProfile = () => {
    // Validate phone number
    if (phoneLengths.length > 0 && !phoneLengths.includes(profileData.phone.length)) {
      alert(`Phone number must be ${phoneLengths.join(' or ')} digits`);
      return;
    }
    
    setCompanyName(profileData.companyName);
    setBusinessType(profileData.businessType);
    setName(profileData.name);
    setEmail(profileData.email);
    setPhone(profileData.phone);
    setCity(profileData.city);
    setCurrentRevenue(profileData.currentRevenue);
    setIsEditingProfile(false);
    setShowEmailVerification(false);
    setEmailVerificationCode("");
    setIsEmailChanged(false);
    
    setSuccessMessage("Profile updated successfully!");
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const handleSendVerificationCode = () => {
    setShowEmailVerification(true);
    setEmailVerificationCode("");
    console.log("Verification code sent to:", profileData.email);
  };

  const handleVerifyEmail = () => {
    if (emailVerificationCode.length === 6) {
      setShowEmailVerification(false);
      setEmailVerificationCode("");
      setIsEmailVerified(true);
      setVerifiedEmail(profileData.email);
      setIsEmailChanged(false);
      
      setSuccessMessage("Email verified successfully!");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  // Dashboard Component
  const Dashboard = useMemo(() => {
    const Component = () => (
      <div className="space-y-4 sm:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass-card p-3 sm:p-4 lg:p-6 border-l-4 border-primary">
            <p className="text-[8px] sm:text-[10px] lg:text-xs uppercase font-bold text-muted-foreground">Status</p>
            <div className="flex items-center justify-between mt-1 sm:mt-2">
              <h4 className="text-sm sm:text-base lg:text-xl font-bold text-secondary">
                {isEmailVerified ? "Verified" : "Pending"}
              </h4>
              {isEmailVerified ? (
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-500" />
              ) : (
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-yellow-500" />
              )}
            </div>
          </div>
          <div className="glass-card p-3 sm:p-4 lg:p-6 border-l-4 border-teal-500">
            <p className="text-[8px] sm:text-[10px] lg:text-xs uppercase font-bold text-muted-foreground">Products Listed</p>
            <div className="flex items-center justify-between mt-1 sm:mt-2">
              <h4 className="text-sm sm:text-base lg:text-xl font-bold">{products.length}</h4>
              <Package2 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-teal-500" />
            </div>
          </div>
          <div className="glass-card p-3 sm:p-4 lg:p-6 border-l-4 border-purple-500">
            <p className="text-[8px] sm:text-[10px] lg:text-xs uppercase font-bold text-muted-foreground">Capacity</p>
            <div className="flex items-center justify-between mt-1 sm:mt-2">
              <h4 className="text-sm sm:text-base lg:text-xl font-bold truncate">{capacity || "0"} {capacityUnit}</h4>
              <Scale className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-purple-500" />
            </div>
          </div>
          <div 
            className="glass-card p-3 sm:p-4 lg:p-6 border-l-4 border-gold cursor-pointer hover:bg-white/5 transition-colors" 
            onClick={() => setView("messages")}
          >
            <p className="text-[8px] sm:text-[10px] lg:text-xs uppercase font-bold text-muted-foreground">Messages</p>
            <div className="flex items-center justify-between mt-1 sm:mt-2">
              <h4 className="text-sm sm:text-base lg:text-xl font-bold">{messagesList.length}</h4>
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gold" />
            </div>
          </div>
        </div>

        {/* Recent Products */}
        <div className="glass-card p-4 sm:p-5 lg:p-6 gradient-border">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base lg:text-lg font-bold flex items-center gap-2">
              <Package2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> Recent Products
            </h3>
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm h-7 sm:h-8" onClick={() => setView("products")}>
              View All <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
            </Button>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {products.slice(0, 3).map((product) => (
                <div key={product.id} className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg overflow-hidden flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <img src={URL.createObjectURL(product.images[0])} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package2 className="w-4 h-4 sm:w-5 sm:h-5 m-2 sm:m-2.5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs sm:text-sm truncate">{product.name}</p>
                      <p className="text-[8px] sm:text-[10px] text-muted-foreground truncate">{product.category}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-[8px] sm:text-[10px] lg:text-xs">
                    <span>{product.price} {product.priceUnit}</span>
                    <span className="text-primary">{product.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 border-2 border-dashed border-white/10 rounded-xl">
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">No products added yet</p>
              <Button onClick={() => setView("products")} className="btn-gradient-teal text-xs sm:text-sm h-8 sm:h-10">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Add Your First Product
              </Button>
            </div>
          )}
        </div>
      </div>
    );
    return Component;
  }, [isEmailVerified, products, capacity, capacityUnit, messagesList.length]);

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 sm:pt-24 pb-16 sm:pb-20 container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 space-y-1 sm:space-y-2">
              <div className="p-3 sm:p-4 mb-4 sm:mb-6 glass-card text-center bg-primary/5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-tr from-primary to-secondary rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center text-white text-base sm:text-lg lg:text-xl font-bold">
                  {companyName?.charAt(0) || 'S'}
                </div>
                <h3 className="font-bold text-foreground text-sm sm:text-base break-words">{companyName || 'Supplier'}</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground break-words">{businessType}</p>
              </div>
              
              <Button 
                variant={view === "dashboard" ? "default" : "ghost"} 
                className="w-full justify-start gap-2 sm:gap-3 text-xs sm:text-sm h-8 sm:h-10" 
                onClick={() => setView("dashboard")}
              >
                <LayoutDashboard className="w-3 h-3 sm:w-4 sm:h-4" /> Dashboard
              </Button>
              <Button 
                variant={view === "products" ? "default" : "ghost"} 
                className="w-full justify-start gap-2 sm:gap-3 text-xs sm:text-sm h-8 sm:h-10" 
                onClick={() => setView("products")}
              >
                <Package2 className="w-3 h-3 sm:w-4 sm:h-4" /> Products
              </Button>
              <Button 
                variant={view === "messages" ? "default" : "ghost"} 
                className="w-full justify-start gap-2 sm:gap-3 text-xs sm:text-sm h-8 sm:h-10" 
                onClick={() => setView("messages")}
              >
                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" /> Messages
              </Button>
              <Button 
                variant={view === "profile" ? "default" : "ghost"} 
                className="w-full justify-start gap-2 sm:gap-3 text-xs sm:text-sm h-8 sm:h-10" 
                onClick={() => setView("profile")}
              >
                <User className="w-3 h-3 sm:w-4 sm:h-4" /> Profile
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 sm:gap-3 text-destructive hover:text-destructive text-xs sm:text-sm h-8 sm:h-10" 
                onClick={handleLogout}
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" /> Logout
              </Button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {view === "dashboard" && <Dashboard />}
              {view === "messages" && (
                <MessageCenter messagesList={messagesList} setMessagesList={setMessagesList} />
              )}
              {view === "profile" && (
                <ProfileSettings 
                  companyName={companyName}
                  businessType={businessType}
                  name={name}
                  email={email}
                  phone={phone}
                  phoneCode={phoneCode}
                  city={city}
                  currentRevenue={currentRevenue}
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
                  onLogout={handleLogout}
                />
              )}
              {view === "products" && (
                <ProductsManager products={products} setProducts={setProducts} />
              )}
            </main>
          </div>
        </div>
        <Footer />
        
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

  // Expanded product categories for registration
  const productCategories = [
    "Grains & Pulses",
    "Edible Oils", 
    "Spices",
    "Fruits & Vegetables",
    "Processed Foods",
    "Chemicals",
    "Petrochemicals",
    "Pharmaceuticals",
    "Fertilizers",
    "Paper & Pulp",
    "Scrap Materials",
    "Metals & Minerals",
    "Textiles",
    "Leather Goods",
    "Handicrafts",
    "Machinery",
    "Electronics",
    "Automotive Parts",
    "Construction Materials",
    "Packaging Materials"
  ];

  // Business types
  const businessTypes = [
    "Manufacturer",
    "Exporter",
    "Trader",
    "Distributor",
    "Wholesaler",
    "Producer",
    "Processor",
    "Grower",
    "Cooperative",
    "Trading House"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 sm:pt-24 pb-16 sm:pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <ScrollReveal>
            <div className="text-center mb-8 sm:mb-12">
              <span className="text-secondary text-[10px] sm:text-xs font-semibold uppercase tracking-widest">Become a Verified Supplier</span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-2 sm:mt-3">
                Supplier <span className="text-primary">Registration</span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-2 sm:mt-3 font-body max-w-2xl mx-auto px-4">
                Join our global network of verified commodity suppliers. Complete your profile to start connecting with international buyers.
              </p>
            </div>
          </ScrollReveal>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 mb-6 sm:mb-8 px-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-1 sm:gap-2">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${
                  s <= step ? 'btn-gradient-gold text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-8 sm:w-12 md:w-16 h-0.5 ${s < step ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>

          <ScrollReveal delay={100}>
            <div className="glass-card p-4 sm:p-6 md:p-8 gradient-border">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Step 1: Basic Information */}
                {step === 1 && (
                  <div className="space-y-5 sm:space-y-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-white/10">
                      <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <h3 className="font-bold text-base sm:text-lg text-foreground">Company Information</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                          Company Name * 
                          {step1Errors.companyName && <span className="text-destructive text-[8px] sm:text-[10px]">({step1Errors.companyName})</span>}
                        </label>
                        <Input 
                          placeholder="Enter your company name" 
                          value={companyName} 
                          onChange={(e) => setCompanyName(e.target.value)} 
                          className={`bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm ${step1Errors.companyName ? 'border-destructive' : ''}`} 
                          required 
                        />
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                          Business Type *
                          {step1Errors.businessType && <span className="text-destructive text-[8px] sm:text-[10px]">({step1Errors.businessType})</span>}
                        </label>
                        <Select value={businessType} onValueChange={setBusinessType} required>
                          <SelectTrigger className={`bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm ${step1Errors.businessType ? 'border-destructive' : ''}`}>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                          <SelectContent>
                            {businessTypes.map((type) => (
                              <SelectItem key={type} value={type} className="text-xs sm:text-sm">{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Year Established</label>
                        <Input 
                          type="number" 
                          placeholder="YYYY" 
                          max={new Date().getFullYear()} 
                          value={yearEstablished} 
                          onChange={(e) => setYearEstablished(e.target.value)} 
                          className="bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm" 
                        />
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Number of Employees</label>
                        <Input 
                          type="number" 
                          placeholder="e.g., 50" 
                          value={employeeCount} 
                          onChange={(e) => setEmployeeCount(e.target.value)} 
                          className="bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm" 
                        />
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Current Revenue (USD) *</label>
                        <div className="relative">
                          <DollarSign className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                          <Input 
                            type="number" 
                            placeholder="1000000" 
                            value={currentRevenue} 
                            onChange={(e) => setCurrentRevenue(e.target.value)} 
                            className="bg-white/5 border-white/10 pl-6 sm:pl-8 h-8 sm:h-10 text-xs sm:text-sm" 
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 mt-6 sm:mt-8 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-white/10">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <h3 className="font-bold text-base sm:text-lg text-foreground">Location Information</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                          Country *
                          {step1Errors.country && <span className="text-destructive text-[8px] sm:text-[10px]">({step1Errors.country})</span>}
                        </label>
                        <Select value={selectedCountry} onValueChange={(val) => { setSelectedCountry(val); setSelectedPort(""); }} required>
                          <SelectTrigger className={`bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm ${step1Errors.country ? 'border-destructive' : ''}`}>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent className="max-h-40 sm:max-h-60">
                            {countries.map((c) => (
                              <SelectItem key={c.code} value={c.name} className="text-xs sm:text-sm">{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                          City *
                          {step1Errors.city && <span className="text-destructive text-[8px] sm:text-[10px]">({step1Errors.city})</span>}
                        </label>
                        <Input 
                          placeholder="Enter city" 
                          value={city} 
                          onChange={(e) => setCity(e.target.value)} 
                          className={`bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm ${step1Errors.city ? 'border-destructive' : ''}`} 
                          required 
                        />
                      </div>

                      <div className="space-y-1 sm:space-y-2 md:col-span-2">
                        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Business Address</label>
                        <Textarea 
                          placeholder="Enter your full business address" 
                          rows={2}
                          value={address} 
                          onChange={(e) => setAddress(e.target.value)} 
                          className="bg-white/5 border-white/10 text-xs sm:text-sm" 
                        />
                      </div>

                      {availablePorts.length > 0 ? (
                        <div className="space-y-1 sm:space-y-2">
                          <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Export Port</label>
                          <Select value={selectedPort} onValueChange={setSelectedPort}>
                            <SelectTrigger className="bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm">
                              <SelectValue placeholder="Select export port" />
                            </SelectTrigger>
                            <SelectContent>
                              {availablePorts.map((port) => (
                                <SelectItem key={port} value={port} className="text-xs sm:text-sm">{port}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : selectedCountry ? (
                        <div className="space-y-1 sm:space-y-2">
                          <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Nearest Port</label>
                          <Input 
                            placeholder="Enter nearest port" 
                            value={warehouseLocation} 
                            onChange={(e) => setWarehouseLocation(e.target.value)} 
                            className="bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm" 
                          />
                        </div>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 mt-6 sm:mt-8 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-white/10">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <h3 className="font-bold text-base sm:text-lg text-foreground">Contact Information</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                          Contact Person *
                          {step1Errors.name && <span className="text-destructive text-[8px] sm:text-[10px]">({step1Errors.name})</span>}
                        </label>
                        <Input 
                          placeholder="Full name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          className={`bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm ${step1Errors.name ? 'border-destructive' : ''}`} 
                          required 
                        />
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Designation</label>
                        <Input 
                          placeholder="e.g., Export Manager" 
                          value={designation} 
                          onChange={(e) => setDesignation(e.target.value)} 
                          className="bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm" 
                        />
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                          Email *
                          {step1Errors.email && <span className="text-destructive text-[8px] sm:text-[10px]">({step1Errors.email})</span>}
                        </label>
                        <Input 
                          type="email" 
                          placeholder="email@company.com" 
                          value={email} 
                          onChange={(e) => { setEmail(e.target.value); setEmailError(""); }} 
                          onBlur={handleEmailBlur}
                          className={`bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm ${step1Errors.email || emailError ? 'border-destructive' : ''}`} 
                          required 
                        />
                        {emailError && (
                          <p className="text-[8px] sm:text-[10px] text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="w-2 h-2 sm:w-3 sm:h-3" />{emailError}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                          Phone Number *
                          {step1Errors.phone && <span className="text-destructive text-[8px] sm:text-[10px]">({step1Errors.phone})</span>}
                        </label>
                        <div className="flex gap-2">
                          <div className="w-12 sm:w-16 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-[8px] sm:text-[10px] h-8 sm:h-10 flex-shrink-0">
                            {phoneCode || "—"}
                          </div>
                          <Input 
                            placeholder="Enter phone number" 
                            type="tel" 
                            value={phone} 
                            onChange={(e) => handlePhoneChange(e.target.value)} 
                            className={`bg-white/5 border-white/10 flex-1 h-8 sm:h-10 text-xs sm:text-sm ${step1Errors.phone || phoneError ? 'border-destructive' : ''}`} 
                            required 
                          />
                        </div>
                        {phoneLengths.length > 0 && (
                          <p className="text-[8px] sm:text-[10px] text-muted-foreground mt-1">
                            Accepts {phoneLengths.join(' or ')} digits
                          </p>
                        )}
                        {phoneError && (
                          <p className="text-[8px] sm:text-[10px] text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="w-2 h-2 sm:w-3 sm:h-3" />{phoneError}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Website (Optional)</label>
                        <Input 
                          type="url" 
                          placeholder="https://www.company.com" 
                          value={website} 
                          onChange={(e) => setWebsite(e.target.value)} 
                          className="bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm" 
                        />
                      </div>
                    </div>

                    {/* Email Verification */}
                    {showVerification && !emailVerified && (
                      <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-primary/5 rounded-xl border border-primary/20">
                        <h4 className="font-bold text-sm sm:text-base mb-2 sm:mb-4">Verify Your Email</h4>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-3 sm:mb-4">
                          Enter the 6-digit code sent to {email}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <Input 
                            placeholder="000000" 
                            className="text-center text-base sm:text-xl tracking-[0.3em] sm:tracking-[0.5em] font-bold h-10 sm:h-12 bg-white/5"
                            maxLength={6}
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                          />
                          <Button 
                            type="button"
                            className="btn-gradient-gold h-10 sm:h-12 text-xs sm:text-sm"
                            onClick={handleVerifyCode}
                            disabled={verificationCode.length !== 6}
                          >
                            Verify
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Products & Capabilities */}
                {step === 2 && (
                  <div className="space-y-5 sm:space-y-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-white/10">
                      <Package2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <h3 className="font-bold text-base sm:text-lg text-foreground">Products & Capabilities</h3>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                        Products You Export *
                        {step2Errors.products && <span className="text-destructive text-[8px] sm:text-[10px]">({step2Errors.products})</span>}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-h-60 sm:max-h-80 overflow-y-auto p-2 border border-white/10 rounded-xl">
                        {productCategories.map((product) => (
                          <label key={product} className="flex items-center gap-2 cursor-pointer glass-card p-2 sm:p-3 rounded-lg hover:bg-white/5 transition-colors">
                            <Checkbox
                              checked={selectedProducts.includes(product)}
                              onCheckedChange={() => toggleSelection(product, selectedProducts, setSelectedProducts)}
                              className="h-3 w-3 sm:h-4 sm:w-4"
                            />
                            <span className="text-[10px] sm:text-xs text-foreground">{product}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-4">
                      <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Product Details</label>
                      <Textarea 
                        placeholder="List your specific products with detailed specifications, grades, varieties, etc." 
                        rows={3}
                        value={productDetails} 
                        onChange={(e) => setProductDetails(e.target.value)} 
                        className="bg-white/5 border-white/10 text-xs sm:text-sm" 
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                          Annual Supply Capacity *
                          {step2Errors.capacity && <span className="text-destructive text-[8px] sm:text-[10px]">({step2Errors.capacity})</span>}
                        </label>
                        <div className="flex gap-2">
                          <Input 
                            type="number" 
                            placeholder="Capacity" 
                            value={capacity} 
                            onChange={(e) => setCapacity(e.target.value)} 
                            className={`bg-white/5 border-white/10 flex-1 h-8 sm:h-10 text-xs sm:text-sm ${step2Errors.capacity ? 'border-destructive' : ''}`} 
                            required 
                          />
                          <Select value={capacityUnit} onValueChange={setCapacityUnit}>
                            <SelectTrigger className="w-20 sm:w-24 bg-white/5 border-white/10 h-8 sm:h-10 text-[10px] sm:text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MT/year">MT/year</SelectItem>
                              <SelectItem value="tons/year">tons/year</SelectItem>
                              <SelectItem value="kg/year">kg/year</SelectItem>
                              <SelectItem value="units/year">units/year</SelectItem>
                              <SelectItem value="containers/year">containers/year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Minimum Order Quantity</label>
                        <Input 
                          placeholder="e.g., 20 MT" 
                          value={minOrderQuantity} 
                          onChange={(e) => setMinOrderQuantity(e.target.value)} 
                          className="bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm" 
                        />
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Lead Time (days)</label>
                        <Input 
                          type="number" 
                          placeholder="e.g., 15" 
                          value={leadTime} 
                          onChange={(e) => setLeadTime(e.target.value)} 
                          className="bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm" 
                        />
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Export Markets</label>
                        <Select value={exportMarkets[0] || ""} onValueChange={(val) => setExportMarkets([val])}>
                          <SelectTrigger className="bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm">
                            <SelectValue placeholder="Select primary market" />
                          </SelectTrigger>
                          <SelectContent className="max-h-40 sm:max-h-60">
                            {exportMarketOptions.map((market) => (
                              <SelectItem key={market} value={market} className="text-xs sm:text-sm">{market}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-4">
                      <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Upload Certificates (Optional)</label>
                      <div className="border-2 border-dashed border-white/10 rounded-xl p-4 sm:p-6 text-center">
                        <input
                          type="file"
                          id="certificate-upload"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                        <label
                          htmlFor="certificate-upload"
                          className="cursor-pointer inline-flex flex-col items-center gap-1 sm:gap-2"
                        >
                          <Upload className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-muted-foreground" />
                          <span className="text-[10px] sm:text-xs font-medium">Click to upload certificates</span>
                          <span className="text-[8px] sm:text-[10px] text-muted-foreground">PDF, JPG, PNG (Max 10MB each)</span>
                        </label>
                      </div>
                      {certificateFiles.length > 0 && (
                        <div className="space-y-1 sm:space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
                          {certificateFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg">
                              <span className="text-[10px] sm:text-xs truncate flex-1">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 sm:h-7 sm:w-7"
                                onClick={() => removeFile(index)}
                              >
                                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Trade Information */}
                {step === 3 && (
                  <div className="space-y-5 sm:space-y-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-white/10">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <h3 className="font-bold text-base sm:text-lg text-foreground">Trade Information</h3>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                        Preferred Payment Terms *
                        {step3Errors.paymentTerms && <span className="text-destructive text-[8px] sm:text-[10px]">({step3Errors.paymentTerms})</span>}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {paymentTerms.map((term) => (
                          <label key={term} className="flex items-center gap-2 cursor-pointer glass-card p-2 sm:p-3 rounded-lg hover:bg-white/5 transition-colors">
                            <Checkbox
                              checked={preferredPaymentTerms.includes(term)}
                              onCheckedChange={() => toggleSelection(term, preferredPaymentTerms, setPreferredPaymentTerms)}
                              className="h-3 w-3 sm:h-4 sm:w-4"
                            />
                            <span className="text-[10px] sm:text-xs text-foreground">{term}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Optional Banking Information Toggle */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-white/10 text-xs sm:text-sm h-8 sm:h-10"
                        onClick={() => setShowBanking(!showBanking)}
                      >
                        {showBanking ? "Hide" : "Add"} Banking Information
                      </Button>
                      <span className="text-[8px] sm:text-[10px] text-muted-foreground">(Optional - for faster transactions)</span>
                    </div>

                    {showBanking && (
                      <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                        <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Banking Information</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <Input 
                            placeholder="Bank Name" 
                            value={bankName} 
                            onChange={(e) => setBankName(e.target.value)} 
                            className="bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm" 
                          />
                          <Input 
                            placeholder="Account Number" 
                            value={bankAccount} 
                            onChange={(e) => setBankAccount(e.target.value)} 
                            className="bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm" 
                          />
                          <Input 
                            placeholder="SWIFT Code" 
                            value={swiftCode} 
                            onChange={(e) => setSwiftCode(e.target.value)} 
                            className="bg-white/5 border-white/10 h-8 sm:h-10 text-xs sm:text-sm" 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                  {step > 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(step - 1)}
                      className="flex-1 border-white/10 h-8 sm:h-10 text-xs sm:text-sm order-2 sm:order-1"
                    >
                      Previous
                    </Button>
                  )}
                  <Button 
                    type="submit" 
                    className={`${step === 3 ? 'btn-gradient-gold' : 'btn-gradient-teal'} flex-1 h-8 sm:h-10 text-xs sm:text-sm order-1 sm:order-2`}
                  >
                    {step === 1 && (emailVerified ? "Next: Products & Capabilities" : "Verify Email & Continue")}
                    {step === 2 && "Next: Trade Information"}
                    {step === 3 && "Submit Registration"}
                    <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </ScrollReveal>

          <p className="text-center text-[10px] sm:text-xs text-muted-foreground font-body mt-4 sm:mt-6">
            Already registered? <Link to="/supplier/login" className="text-primary hover:underline">Login →</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Supplier;