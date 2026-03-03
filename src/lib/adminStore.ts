import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';

export interface BuyerEntry {
  id: string;
  userId: string;
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
  businessType?: string;
  yearsInBusiness?: string;
  taxId?: string;
  website?: string;
  reference?: string;
  newsletter?: boolean;
  username?: string;
}

// Define a proper type for supplier products
export interface SupplierProduct {
  id: string;
  name: string;
  category: string;
  price?: number;
  unit?: string;
  description?: string;
  image?: string;
  [key: string]: unknown;
}

export interface SupplierEntry {
  id: string;
  userId: string;
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
  businessType?: string;
  yearEstablished?: string;
  employeeCount?: string;
  currentRevenue?: string;
  city?: string;
  address?: string;
  warehouseLocation?: string;
  designation?: string;
  exportMarkets?: string[];
  minOrderQuantity?: string;
  leadTime?: string;
  preferredPaymentTerms?: string[];
  bankName?: string;
  bankAccount?: string;
  swiftCode?: string;
  certificates?: string[];
  products?: SupplierProduct[];  // Fixed: changed from any[] to SupplierProduct[]
  registrationDate?: string;
  emailVerified?: boolean;
  username?: string;
}

export interface ContactMessage {
  id: string;
  userId: string;
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
  userId: string;
  name: string;
  email: string;
  company?: string;
  phone: string;
  country: string;
  products: { name: string; quantity: number; note: string; price?: number }[];
  generalNote?: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'quoted';
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

interface PersistedState {
  buyers: BuyerEntry[];
  suppliers: SupplierEntry[];
  contactMessages: ContactMessage[];
  quotations: QuotationEntry[];
  products: ProductEntry[];
  hiddenProducts: string[];
  [key: string]: unknown;
}

interface AdminStore {
  buyers: BuyerEntry[];
  suppliers: SupplierEntry[];
  contactMessages: ContactMessage[];
  quotations: QuotationEntry[];
  products: ProductEntry[];
  hiddenProducts: string[];
  
  addBuyer: (userId: string, buyer: Omit<BuyerEntry, 'id' | 'userId' | 'date' | 'blocked' | 'status' | 'totalQuotations' | 'lastActive'>) => void;
  addSupplier: (userId: string, supplier: Omit<SupplierEntry, 'id' | 'userId' | 'date' | 'blocked' | 'verified' | 'status' | 'totalProducts' | 'lastActive'>) => void;
  addContactMessage: (userId: string, msg: Omit<ContactMessage, 'id' | 'userId' | 'date' | 'read' | 'replied'>) => void;
  addQuotation: (userId: string, q: Omit<QuotationEntry, 'id' | 'userId' | 'date' | 'status' | 'totalAmount'>) => void;
  addProduct: (product: Omit<ProductEntry, 'id' | 'createdAt'>) => void;
  
  getBuyerByUserId: (userId: string) => BuyerEntry | undefined;
  getSupplierByUserId: (userId: string) => SupplierEntry | undefined;
  getUserMessages: (userId: string) => ContactMessage[];
  getUserQuotations: (userId: string) => QuotationEntry[];
  
  blockBuyer: (id: string) => void;
  unblockBuyer: (id: string) => void;
  deleteBuyer: (id: string, userId: string) => void;
  
  approveSupplier: (id: string) => void;
  rejectSupplier: (id: string) => void;
  blockSupplier: (id: string) => void;
  deleteSupplier: (id: string, userId: string) => void;
  
  toggleProductStatus: (id: string) => void;
  toggleFeatured: (id: string) => void;
  deleteProduct: (id: string) => void;
  
  updateQuotationStatus: (id: string, status: 'pending' | 'approved' | 'rejected' | 'quoted') => void;
  deleteQuotation: (id: string) => void;
  
  markMessageRead: (id: string) => void;
  markMessageReplied: (id: string) => void;
  deleteMessage: (id: string) => void;
  
  toggleBlockBuyer: (id: string, userId: string) => void;
  toggleBlockSupplier: (id: string, userId: string) => void;
  toggleProductVisibility: (productId: string) => void;
  
  clearAllData: () => void;
  
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
      buyers: [],
      suppliers: [],
      contactMessages: [],
      quotations: [],
      products: sampleProducts,
      hiddenProducts: [],

      addBuyer: (userId, buyer) =>
        set((s) => {
          const existingBuyerByUserId = s.buyers.find(b => b.userId === userId);
          const existingBuyerByEmail = s.buyers.find(b => b.email === buyer.email);
          
          if (existingBuyerByUserId || existingBuyerByEmail) {
            console.log("Buyer already exists, cannot add again");
            return s;
          }
          
          return {
            buyers: [...s.buyers, {
              ...buyer,
              id: genId(),
              userId,
              date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
              blocked: false,
              status: 'active',
              totalQuotations: 0,
              lastActive: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            }]
          };
        }),

      addSupplier: (userId, supplier) =>
        set((s) => {
          const existingSupplierByUserId = s.suppliers.find(sup => sup.userId === userId);
          const existingSupplierByEmail = s.suppliers.find(sup => sup.email === supplier.email);
          
          if (existingSupplierByUserId || existingSupplierByEmail) {
            console.log("Supplier already exists, cannot add again");
            return s;
          }
          
          return {
            suppliers: [...s.suppliers, {
              ...supplier,
              id: genId(),
              userId,
              date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
              blocked: false,
              verified: false,
              status: 'pending',
              totalProducts: 0,
              lastActive: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            }]
          };
        }),

      addContactMessage: (userId, msg) =>
        set((s) => ({
          contactMessages: [...s.contactMessages, {
            ...msg,
            id: genId(),
            userId,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            read: false,
            replied: false
          }]
        })),

      addQuotation: (userId, q) =>
        set((s) => {
          const totalAmount = q.products.reduce((sum, p) => sum + (p.price || 0) * p.quantity, 0);
          return {
            quotations: [...s.quotations, {
              ...q,
              id: genId(),
              userId,
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

      getBuyerByUserId: (userId) => {
        return get().buyers.find(b => b.userId === userId);
      },

      getSupplierByUserId: (userId) => {
        return get().suppliers.find(s => s.userId === userId);
      },

      getUserMessages: (userId) => {
        return get().contactMessages.filter(m => m.userId === userId);
      },

      getUserQuotations: (userId) => {
        return get().quotations.filter(q => q.userId === userId);
      },

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

      deleteBuyer: (id, userId) => {
        console.log(`Deleting buyer with id: ${id} and userId: ${userId}`);
        
        const { deleteUser } = useAuthStore.getState();
        if (deleteUser) {
          deleteUser(userId);
        }
        
        set((s) => ({ 
          buyers: s.buyers.filter((b) => b.id !== id) 
        }));
      },

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

      deleteSupplier: (id, userId) => {
        console.log(`Deleting supplier with id: ${id} and userId: ${userId}`);
        
        const { deleteUser } = useAuthStore.getState();
        if (deleteUser) {
          deleteUser(userId);
        }
        
        set((s) => ({ 
          suppliers: s.suppliers.filter((sup) => sup.id !== id) 
        }));
      },

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

      updateQuotationStatus: (id, status) =>
        set((s) => ({
          quotations: s.quotations.map((q) =>
            q.id === id ? { ...q, status } : q
          )
        })),

      deleteQuotation: (id) =>
        set((s) => ({ quotations: s.quotations.filter((q) => q.id !== id) })),

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

      toggleBlockBuyer: (id, userId) => {
        const buyer = get().buyers.find(b => b.id === id);
        if (buyer?.blocked) {
          get().unblockBuyer(id);
        } else {
          get().blockBuyer(id);
        }
      },

      toggleBlockSupplier: (id, userId) => {
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

      clearAllData: () => 
        set({ 
          buyers: [], 
          suppliers: [], 
          contactMessages: [], 
          quotations: [],
          hiddenProducts: []
        }),

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
      version: 6,
      migrate: (persistedState: unknown, version: number): PersistedState => {
        const state = persistedState as PersistedState;
        if (version < 6) {
          return {
            ...state,
            buyers: [],
            suppliers: [],
            contactMessages: [],
            quotations: [],
            hiddenProducts: []
          };
        }
        return state;
      },
    }
  )
);