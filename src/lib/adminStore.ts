import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BuyerEntry {
  id: string;
  name: string;
  email: string;
  company?: string;
  country: string;
  phone: string;
  port?: string;
  city?: string;
  annualVolume?: string;
  productsOfInterest?: string;
  date: string;
  blocked: boolean;
  status?: 'active' | 'inactive' | 'blocked';
  totalQuotations?: number;
  lastActive?: string;
}

export interface SupplierEntry {
  id: string;
  name: string;
  email: string;
  company?: string;
  website?: string;
  country: string;
  phone: string;
  port?: string;
  exportProducts: string[];
  capacity?: string;
  productDetails?: string;
  date: string;
  blocked: boolean;
  verified?: boolean;
  status?: 'pending' | 'approved' | 'rejected' | 'blocked';
  totalProducts?: number;
  lastActive?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone: string;
  country: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  replied?: boolean;
}

export interface QuotationEntry {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone: string;
  country: string;
  products: { name: string; quantity: number; note: string; price?: number }[];
  generalNote?: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  totalAmount?: number;
  buyerId?: string;
}

export interface ProductEntry {
  id: string;
  name: string;
  supplierId: string;
  supplierName: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  origin: string;
  status: 'active' | 'inactive';
  featured: boolean;
  image?: string;
  description?: string;
  createdAt: string;
}

interface AdminStore {
  // Data
  buyers: BuyerEntry[];
  suppliers: SupplierEntry[];
  contactMessages: ContactMessage[];
  quotations: QuotationEntry[];
  products: ProductEntry[];
  hiddenProducts: string[];
  
  // Methods
  addBuyer: (buyer: Omit<BuyerEntry, 'id' | 'date' | 'blocked' | 'status' | 'totalQuotations' | 'lastActive'>) => void;
  addSupplier: (supplier: Omit<SupplierEntry, 'id' | 'date' | 'blocked' | 'verified' | 'status' | 'totalProducts' | 'lastActive'>) => void;
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'read' | 'replied'>) => void;
  addQuotation: (q: Omit<QuotationEntry, 'id' | 'date' | 'status' | 'totalAmount'>) => void;
  addProduct: (product: Omit<ProductEntry, 'id' | 'createdAt'>) => void;
  
  // Buyer actions
  blockBuyer: (id: string) => void;
  unblockBuyer: (id: string) => void;
  deleteBuyer: (id: string) => void;
  
  // Supplier actions
  approveSupplier: (id: string) => void;
  rejectSupplier: (id: string) => void;
  blockSupplier: (id: string) => void;
  deleteSupplier: (id: string) => void;
  
  // Product actions
  toggleProductStatus: (id: string) => void;
  toggleFeatured: (id: string) => void;
  deleteProduct: (id: string) => void;
  
  // Quotation actions
  updateQuotationStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
  deleteQuotation: (id: string) => void;
  
  // Message actions
  markMessageRead: (id: string) => void;
  markMessageReplied: (id: string) => void;
  deleteMessage: (id: string) => void;
  
  // Legacy methods (for compatibility)
  toggleBlockBuyer: (id: string) => void;
  toggleBlockSupplier: (id: string) => void;
  toggleProductVisibility: (productId: string) => void;
  
  // Stats
  getStats: () => {
    totalBuyers: number;
    totalSuppliers: number;
    pendingSuppliers: number;
    totalProducts: number;
    activeProducts: number;
    pendingQuotations: number;
    totalQuotations: number;
    unreadMessages: number;
    totalRevenue: number;
  };
}

let counter = 0;
const genId = () => `entry-${Date.now()}-${++counter}`;

// Sample data for demonstration
const sampleProducts: ProductEntry[] = [
  {
    id: 'p1',
    name: 'Premium Iranian Saffron',
    supplierId: 's1',
    supplierName: 'Premium Dates Exports',
    category: 'Spices',
    price: 450,
    unit: 'kg',
    stock: 50,
    origin: 'Iran',
    status: 'active',
    featured: true,
    createdAt: '2024-01-20'
  },
  {
    id: 'p2',
    name: 'Organic Wild Honey',
    supplierId: 's1',
    supplierName: 'Premium Dates Exports',
    category: 'Honey',
    price: 25,
    unit: 'kg',
    stock: 200,
    origin: 'Yemen',
    status: 'active',
    featured: true,
    createdAt: '2024-01-18'
  }
];

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      // Initial data
      buyers: [],
      suppliers: [],
      contactMessages: [],
      quotations: [],
      products: sampleProducts,
      hiddenProducts: [],

      // Add methods
      addBuyer: (buyer) =>
        set((s) => ({
          buyers: [...s.buyers, {
            ...buyer,
            id: genId(),
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            blocked: false,
            status: 'active',
            totalQuotations: 0,
            lastActive: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          }]
        })),

      addSupplier: (supplier) =>
        set((s) => ({
          suppliers: [...s.suppliers, {
            ...supplier,
            id: genId(),
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            blocked: false,
            verified: false,
            status: 'pending',
            totalProducts: 0,
            lastActive: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          }]
        })),

      addContactMessage: (msg) =>
        set((s) => ({
          contactMessages: [...s.contactMessages, {
            ...msg,
            id: genId(),
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            read: false,
            replied: false
          }]
        })),

      addQuotation: (q) =>
        set((s) => {
          const totalAmount = q.products.reduce((sum, p) => sum + (p.price || 0) * p.quantity, 0);
          return {
            quotations: [...s.quotations, {
              ...q,
              id: genId(),
              date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
              status: 'pending',
              totalAmount
            }]
          };
        }),

      addProduct: (product) =>
        set((s) => ({
          products: [...s.products, {
            ...product,
            id: genId(),
            createdAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          }]
        })),

      // Buyer actions
      blockBuyer: (id) =>
        set((s) => ({
          buyers: s.buyers.map((b) =>
            b.id === id ? { ...b, blocked: true, status: 'blocked' } : b
          )
        })),

      unblockBuyer: (id) =>
        set((s) => ({
          buyers: s.buyers.map((b) =>
            b.id === id ? { ...b, blocked: false, status: 'active' } : b
          )
        })),

      deleteBuyer: (id) =>
        set((s) => ({ buyers: s.buyers.filter((b) => b.id !== id) })),

      // Supplier actions
      approveSupplier: (id) =>
        set((s) => ({
          suppliers: s.suppliers.map((sup) =>
            sup.id === id ? { ...sup, status: 'approved', verified: true, blocked: false } : sup
          )
        })),

      rejectSupplier: (id) =>
        set((s) => ({
          suppliers: s.suppliers.map((sup) =>
            sup.id === id ? { ...sup, status: 'rejected', verified: false } : sup
          )
        })),

      blockSupplier: (id) =>
        set((s) => ({
          suppliers: s.suppliers.map((sup) =>
            sup.id === id ? { ...sup, status: 'blocked', blocked: true } : sup
          )
        })),

      deleteSupplier: (id) =>
        set((s) => ({ suppliers: s.suppliers.filter((sup) => sup.id !== id) })),

      // Product actions
      toggleProductStatus: (id) =>
        set((s) => ({
          products: s.products.map((p) =>
            p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
          )
        })),

      toggleFeatured: (id) =>
        set((s) => ({
          products: s.products.map((p) =>
            p.id === id ? { ...p, featured: !p.featured } : p
          )
        })),

      deleteProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

      // Quotation actions
      updateQuotationStatus: (id, status) =>
        set((s) => ({
          quotations: s.quotations.map((q) =>
            q.id === id ? { ...q, status } : q
          )
        })),

      deleteQuotation: (id) =>
        set((s) => ({ quotations: s.quotations.filter((q) => q.id !== id) })),

      // Message actions
      markMessageRead: (id) =>
        set((s) => ({
          contactMessages: s.contactMessages.map((m) =>
            m.id === id ? { ...m, read: true } : m
          )
        })),

      markMessageReplied: (id) =>
        set((s) => ({
          contactMessages: s.contactMessages.map((m) =>
            m.id === id ? { ...m, replied: true } : m
          )
        })),

      deleteMessage: (id) =>
        set((s) => ({ contactMessages: s.contactMessages.filter((m) => m.id !== id) })),

      // Legacy methods (for compatibility)
      toggleBlockBuyer: (id) => {
        const buyer = get().buyers.find(b => b.id === id);
        if (buyer?.blocked) {
          get().unblockBuyer(id);
        } else {
          get().blockBuyer(id);
        }
      },

      toggleBlockSupplier: (id) => {
        const supplier = get().suppliers.find(s => s.id === id);
        if (supplier?.blocked) {
          set((s) => ({
            suppliers: s.suppliers.map((sup) =>
              sup.id === id ? { ...sup, blocked: false, status: 'approved' } : sup
            )
          }));
        } else {
          get().blockSupplier(id);
        }
      },

      toggleProductVisibility: (id) =>
        set((s) => ({
          products: s.products.map((p) =>
            p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
          ),
          hiddenProducts: s.hiddenProducts.includes(id)
            ? s.hiddenProducts.filter((pid) => pid !== id)
            : [...s.hiddenProducts, id]
        })),

      // Stats
      getStats: () => {
        const state = get();
        return {
          totalBuyers: state.buyers.length,
          totalSuppliers: state.suppliers.length,
          pendingSuppliers: state.suppliers.filter(s => s.status === 'pending').length,
          totalProducts: state.products.length,
          activeProducts: state.products.filter(p => p.status === 'active').length,
          pendingQuotations: state.quotations.filter(q => q.status === 'pending').length,
          totalQuotations: state.quotations.length,
          unreadMessages: state.contactMessages.filter(m => !m.read).length,
          totalRevenue: state.quotations
            .filter(q => q.status === 'approved')
            .reduce((sum, q) => sum + (q.totalAmount || 0), 0)
        };
      },
    }),
    {
      name: 'admin-storage',
    }
  )
);