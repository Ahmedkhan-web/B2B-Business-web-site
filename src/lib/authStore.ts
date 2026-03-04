import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserRole = 'buyer' | 'supplier' | 'admin';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  company?: string;
  country: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  verified: boolean;
  blocked?: boolean;
}

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  users: User[];
  login: (email: string, password: string, role?: UserRole) => boolean;
  register: (userData: Omit<User, 'id' | 'verified' | 'blocked'>) => boolean;
  logout: () => void;
  getUserById: (id: string) => User | undefined;
  deleteUser: (id: string) => void;
  isEmailAvailable: (email: string, role: UserRole) => boolean;
  isUsernameAvailable: (username: string) => boolean;
  forceSync: () => void;
  cleanupOrphanedUsers: () => void;
  getAllUsers: () => User[]; // New function
}

let counter = 0;
const generateId = (): string => {
  counter += 1;
  return `user-${Date.now()}-${counter}-${Math.random().toString(36).substr(2, 9)}`;
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      users: [
        {
          id: generateId(),
          name: 'Admin',
          username: 'admin',
          email: 'admindf@gmail.com',
          country: 'System',
          role: 'admin',
          verified: true,
          blocked: false,
        }
      ],

      login: (email: string, password: string, role?: UserRole) => {
        const state = get();
        
        // Admin login
        if (email === 'admindf@gmail.com' && password === 'admin123') {
          const adminUser = state.users.find(u => u.email === email);
          if (adminUser) {
            set({ user: adminUser, isLoggedIn: true });
            return true;
          }
        }
        
        // Regular user login
        const foundUser = state.users.find(u => 
          u.email === email && 
          (role ? u.role === role : true) &&
          !u.blocked
        );
        
        if (foundUser) {
          set({ user: foundUser, isLoggedIn: true });
          return true;
        }
        
        return false;
      },

      register: (userData) => {
        const state = get();
        
        // Check username availability - strict check across all users
        if (state.users.some(u => u.username === userData.username)) {
          console.log('[AuthStore] Username already taken:', userData.username);
          return false;
        }
        
        // Check email availability for this role - strict check
        if (state.users.some(u => u.email === userData.email && u.role === userData.role)) {
          console.log('[AuthStore] Email already registered for this role:', userData.email);
          return false;
        }

        const newUser: User = {
          ...userData,
          id: generateId(),
          verified: false,
          blocked: false,
        };

        console.log('[AuthStore] Registering new user:', newUser);
        
        set((state) => {
          const newUsers = [...state.users, newUser];
          console.log('[AuthStore] Users after registration:', newUsers.length);
          
          return {
            users: newUsers,
            user: newUser,
            isLoggedIn: true,
          };
        });

        // Force storage sync
        setTimeout(() => {
          get().forceSync();
        }, 100);

        return true;
      },

      logout: () => set({ user: null, isLoggedIn: false }),

      getUserById: (id) => {
        return get().users.find(u => u.id === id);
      },

      deleteUser: (id) => {
        console.log(`[AuthStore] Deleting user with id: ${id}`);
        
        set((state) => {
          const newUsers = state.users.filter(u => u.id !== id);
          const newUser = state.user?.id === id ? null : state.user;
          const newIsLoggedIn = state.user?.id === id ? false : state.isLoggedIn;
          
          console.log(`[AuthStore] Users before: ${state.users.length}, after: ${newUsers.length}`);
          
          return {
            users: newUsers,
            user: newUser,
            isLoggedIn: newIsLoggedIn,
          };
        });

        // Force sync
        setTimeout(() => {
          get().forceSync();
        }, 100);
      },

      isEmailAvailable: (email: string, role: UserRole) => {
        const state = get();
        // Check if email exists for the same role
        const exists = state.users.some(u => u.email === email && u.role === role);
        console.log(`[AuthStore] Checking email ${email} for role ${role}:`, exists ? 'NOT AVAILABLE' : 'AVAILABLE');
        return !exists;
      },

      isUsernameAvailable: (username: string) => {
        const state = get();
        // Check if username exists across ALL users (usernames must be globally unique)
        const exists = state.users.some(u => u.username === username);
        console.log(`[AuthStore] Checking username ${username}:`, exists ? 'NOT AVAILABLE' : 'AVAILABLE');
        return !exists;
      },

      forceSync: () => {
        const state = get();
        set({ ...state });
        console.log('[AuthStore] Forced sync completed');
      },

      cleanupOrphanedUsers: () => {
        console.log('[AuthStore] Running orphaned users cleanup');
        const state = get();
        const adminStore = localStorage.getItem('admin-storage');
        
        if (adminStore) {
          try {
            const adminData = JSON.parse(adminStore);
            const adminBuyers = adminData.state?.buyers || [];
            const adminSuppliers = adminData.state?.suppliers || [];
            
            // Get all valid user IDs from admin store
            const validUserIds = [
              ...adminBuyers.map((b: any) => b.userId),
              ...adminSuppliers.map((s: any) => s.userId)
            ];
            
            // Keep admin user and users that exist in admin store
            const newUsers = state.users.filter(u => 
              u.role === 'admin' || validUserIds.includes(u.id)
            );
            
            if (newUsers.length !== state.users.length) {
              console.log(`[AuthStore] Cleanup removed ${state.users.length - newUsers.length} orphaned users`);
              set({ users: newUsers });
            }
          } catch (error) {
            console.error('[AuthStore] Error in cleanup:', error);
          }
        }
      },

      getAllUsers: () => {
        return get().users;
      },
    }),
    {
      name: 'auth-storage',
      version: 5, // Increased version
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, version: number) => {
        console.log(`[AuthStore] Migrating from version ${version} to 5`);
        if (version < 5) {
          return {
            users: persistedState?.users || [],
            user: persistedState?.user || null,
            isLoggedIn: persistedState?.isLoggedIn || false,
          };
        }
        return persistedState;
      },
    }
  )
);

export { useAuthStore };