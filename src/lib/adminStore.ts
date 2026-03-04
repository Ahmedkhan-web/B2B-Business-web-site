import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
  products?: SupplierProduct[];
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
  syncWithAuth: () => void; // New function
  cleanupOrphanedData: () => void; // New function
  
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

      addBuyer: (userId, buyer) => {
        console.log('[AdminStore] Adding buyer with userId:', userId);
        
        // First check if user exists in auth store
        const authStore = useAuthStore.getState();
        const userExists = authStore.users.some(u => u.id === userId);
        
        if (!userExists) {
          console.error('[AdminStore] Cannot add buyer: User does not exist in auth store');
          return;
        }
        
        set((s) => {
          // Check for existing buyer
          const existingBuyerByUserId = s.buyers.find(b => b.userId === userId);
          const existingBuyerByEmail = s.buyers.find(b => b.email === buyer.email);
          
          if (existingBuyerByUserId || existingBuyerByEmail) {
            console.log("Buyer already exists, cannot add again");
            return s;
          }
          
          const newBuyer = {
            ...buyer,
            id: genId(),
            userId,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            blocked: false,
            status: 'active' as const,
            totalQuotations: 0,
            lastActive: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          };
          
          console.log('[AdminStore] New buyer created:', newBuyer);
          
          return {
            buyers: [...s.buyers, newBuyer]
          };
        });
        
        // Sync with auth store
        setTimeout(() => {
          get().syncWithAuth();
        }, 100);
      },

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
        console.log(`[AdminStore] ========== STARTING BUYER DELETION ==========`);
        console.log(`[AdminStore] Deleting buyer with id: ${id} and userId: ${userId}`);
        
        // First remove from admin store
        set((s) => {
          console.log(`[AdminStore] Buyers before deletion:`, s.buyers.map(b => ({ id: b.id, userId: b.userId, email: b.email })));
          const newBuyers = s.buyers.filter((b) => b.id !== id);
          console.log(`[AdminStore] Buyers after deletion:`, newBuyers.map(b => ({ id: b.id, userId: b.userId, email: b.email })));
          return { buyers: newBuyers };
        });
        
        // Then delete from auth store
        try {
          const authStore = useAuthStore.getState();
          
          if (authStore.deleteUser) {
            console.log(`[AdminStore] Calling authStore.deleteUser for userId: ${userId}`);
            authStore.deleteUser(userId);
          }
          
          // Force sync both stores
          setTimeout(() => {
            // Force auth store to sync
            const authState = useAuthStore.getState();
            if (authState.forceSync) {
              authState.forceSync();
            }
            
            // Force admin store to sync
            const adminState = get();
            set({ ...adminState });
            
            // Direct localStorage update for auth store
            try {
              const authStorage = localStorage.getItem('auth-storage');
              if (authStorage) {
                const parsed = JSON.parse(authStorage);
                const originalLength = parsed.state.users.length;
                parsed.state.users = parsed.state.users.filter((u: any) => u.id !== userId);
                
                if (parsed.state.users.length < originalLength) {
                  localStorage.setItem('auth-storage', JSON.stringify(parsed));
                  console.log('[AdminStore] Auth storage updated directly');
                  
                  // Dispatch storage event
                  window.dispatchEvent(new StorageEvent('storage', {
                    key: 'auth-storage',
                    newValue: JSON.stringify(parsed),
                    oldValue: authStorage
                  }));
                }
              }
            } catch (error) {
              console.error('[AdminStore] Error in direct localStorage update:', error);
            }
            
            // Verify deletion
            setTimeout(() => {
              const authUsers = useAuthStore.getState().users;
              const userStillExists = authUsers.some(u => u.id === userId);
              console.log(`[AdminStore] VERIFICATION - User still exists in auth store? ${userStillExists}`);
              
              if (userStillExists) {
                console.log('[AdminStore] WARNING: User still exists after deletion!');
              } else {
                console.log('[AdminStore] SUCCESS: User successfully deleted from auth store');
              }
            }, 500);
            
          }, 200);
          
        } catch (error) {
          console.error('[AdminStore] Error in deleteBuyer:', error);
        }
        
        console.log(`[AdminStore] ========== BUYER DELETION COMPLETE ==========`);
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
        console.log(`[AdminStore] Deleting supplier with id: ${id} and userId: ${userId}`);
        
        set((s) => {
          console.log(`[AdminStore] Suppliers before: ${s.suppliers.length}`);
          const newSuppliers = s.suppliers.filter((sup) => sup.id !== id);
          console.log(`[AdminStore] Suppliers after: ${newSuppliers.length}`);
          return { suppliers: newSuppliers };
        });
        
        try {
          const authStore = useAuthStore.getState();
          if (authStore.deleteUser) {
            authStore.deleteUser(userId);
          }
          
          setTimeout(() => {
            // Direct localStorage backup
            const authStorage = localStorage.getItem('auth-storage');
            if (authStorage) {
              const parsed = JSON.parse(authStorage);
              parsed.state.users = parsed.state.users.filter((u: any) => u.id !== userId);
              localStorage.setItem('auth-storage', JSON.stringify(parsed));
            }
          }, 200);
          
        } catch (error) {
          console.error('[AdminStore] Error in deleteSupplier:', error);
        }
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

      syncWithAuth: () => {
        console.log('[AdminStore] Syncing with auth store');
        const authStore = useAuthStore.getState();
        const currentBuyers = get().buyers;
        
        // Remove any buyers whose users no longer exist in auth store
        const validBuyers = currentBuyers.filter(buyer => 
          authStore.users.some(u => u.id === buyer.userId)
        );
        
        if (validBuyers.length !== currentBuyers.length) {
          console.log(`[AdminStore] Removing ${currentBuyers.length - validBuyers.length} orphaned buyers`);
          set({ buyers: validBuyers });
        }
      },

      cleanupOrphanedData: () => {
        console.log('[AdminStore] Running orphaned data cleanup');
        const authStore = useAuthStore.getState();
        const state = get();
        
        // Clean up buyers
        const validBuyers = state.buyers.filter(buyer => 
          authStore.users.some(u => u.id === buyer.userId)
        );
        
        // Clean up suppliers
        const validSuppliers = state.suppliers.filter(supplier => 
          authStore.users.some(u => u.id === supplier.userId)
        );
        
        // Clean up quotations
        const validQuotations = state.quotations.filter(quotation => 
          authStore.users.some(u => u.id === quotation.userId)
        );
        
        // Clean up messages
        const validMessages = state.contactMessages.filter(message => 
          authStore.users.some(u => u.id === message.userId)
        );
        
        const changes = {
          buyers: state.buyers.length - validBuyers.length,
          suppliers: state.suppliers.length - validSuppliers.length,
          quotations: state.quotations.length - validQuotations.length,
          messages: state.contactMessages.length - validMessages.length,
        };
        
        console.log('[AdminStore] Cleanup removed:', changes);
        
        set({
          buyers: validBuyers,
          suppliers: validSuppliers,
          quotations: validQuotations,
          contactMessages: validMessages,
        });
      },

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
      version: 7, // Increased version
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: unknown, version: number): PersistedState => {
        console.log(`[AdminStore] Migrating from version ${version} to 7`);
        const state = persistedState as PersistedState;
        
        // Ensure all arrays exist
        return {
          buyers: state?.buyers || [],
          suppliers: state?.suppliers || [],
          contactMessages: state?.contactMessages || [],
          quotations: state?.quotations || [],
          hiddenProducts: state?.hiddenProducts || [],
          products: state?.products || sampleProducts,
        };
      },
    }
  )
);

// Run cleanup on store initialization
setTimeout(() => {
  const adminStore = useAdminStore.getState();
  if (adminStore.cleanupOrphanedData) {
    adminStore.cleanupOrphanedData();
  }
  
  const authStore = useAuthStore.getState();
  if (authStore.cleanupOrphanedUsers) {
    authStore.cleanupOrphanedUsers();
  }
}, 500);