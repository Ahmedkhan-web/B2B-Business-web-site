import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
        
        if (email === 'admindf@gmail.com' && password === 'admin123') {
          const adminUser = state.users.find(u => u.email === email);
          if (adminUser) {
            set({ user: adminUser, isLoggedIn: true });
            return true;
          }
        }
        
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
        
        if (state.users.some(u => u.username === userData.username)) {
          return false;
        }
        
        if (state.users.some(u => u.email === userData.email && u.role === userData.role)) {
          return false;
        }

        const newUser: User = {
          ...userData,
          id: generateId(),
          verified: false,
          blocked: false,
        };

        set((state) => ({
          users: [...state.users, newUser],
          user: newUser,
          isLoggedIn: true,
        }));

        return true;
      },

      logout: () => set({ user: null, isLoggedIn: false }),

      getUserById: (id) => {
        return get().users.find(u => u.id === id);
      },

      deleteUser: (id) => {
        console.log(`Deleting user with id: ${id} from auth store`);
        set((state) => ({
          users: state.users.filter(u => u.id !== id),
          user: state.user?.id === id ? null : state.user,
          isLoggedIn: state.user?.id === id ? false : state.isLoggedIn,
        }));
      },

      isEmailAvailable: (email: string, role: UserRole) => {
        const state = get();
        return !state.users.some(u => u.email === email && u.role === role);
      },

      isUsernameAvailable: (username: string) => {
        const state = get();
        return !state.users.some(u => u.username === username);
      },
    }),
    {
      name: 'auth-storage',
      version: 3,
    }
  )
);

export { useAuthStore };