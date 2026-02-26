import { create } from 'zustand';

export type UserRole = 'buyer' | 'supplier' | 'admin';

export interface User {
  id: string;
  name: string;
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
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: false,
  login: (user) => set({ user, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false }),
}));
