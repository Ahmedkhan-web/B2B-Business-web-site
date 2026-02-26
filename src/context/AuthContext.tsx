import React, { createContext, useContext, useState, useEffect } from 'react';

// Define specific types for user data
interface BuyerData {
  id: string;
  userName: string;
  email?: string;
  phone?: string;
  companyName?: string;
  // Add other buyer-specific fields
}

interface SupplierData {
  id: string;
  userName: string;
  email?: string;
  phone?: string;
  companyName?: string;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  // Add other supplier-specific fields
}

type UserDataType = BuyerData | SupplierData | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userType: 'buyer' | 'supplier' | null;
  userName: string;
  userEmail: string;
  userPhone: string;
  userData: UserDataType;
  login: (type: 'buyer' | 'supplier', userData: BuyerData | SupplierData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userType, setUserType] = useState<'buyer' | 'supplier' | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [userData, setUserData] = useState<UserDataType>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const auth = JSON.parse(storedAuth);
        setIsAuthenticated(true);
        setUserType(auth.userType);
        setUserName(auth.userName || '');
        setUserEmail(auth.userEmail || '');
        setUserPhone(auth.userPhone || '');
        setUserData(auth.userData || null);
      } catch (error) {
        console.error('Failed to parse auth data:', error);
        localStorage.removeItem('auth');
      }
    }
  }, []);

  const login = (type: 'buyer' | 'supplier', data: BuyerData | SupplierData): void => {
    setIsAuthenticated(true);
    setUserType(type);
    setUserName(data.userName);
    setUserEmail(data.email || '');
    setUserPhone(data.phone || '');
    setUserData(data);
    
    localStorage.setItem('auth', JSON.stringify({ 
      userType: type, 
      userName: data.userName,
      userEmail: data.email || '',
      userPhone: data.phone || '',
      userData: data
    }));
  };

  const logout = (): void => {
    setIsAuthenticated(false);
    setUserType(null);
    setUserName('');
    setUserEmail('');
    setUserPhone('');
    setUserData(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userType, 
      userName, 
      userEmail,
      userPhone,
      userData,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};