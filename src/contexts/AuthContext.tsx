import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, SuperAdmin, AdminCredentials } from '@/types';
import { mockApi } from '@/lib/mockData';

// ============================================
// AUTH CONTEXT TYPE
// ============================================

interface AuthContextType {
  // User authentication
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Admin authentication
  admin: SuperAdmin | null;
  isAdminAuthenticated: boolean;
  
  // User actions
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, fullName: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  
  // Admin actions
  adminLogin: (username: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
  updateAdminCredentials: (currentPassword: string, newUsername?: string, newPassword?: string) => Promise<boolean>;
}

// ============================================
// CREATE CONTEXT
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// AUTH PROVIDER
// ============================================

export function AuthProvider({ children }: { children: ReactNode }) {
  // User state
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Admin state
  const [admin, setAdmin] = useState<SuperAdmin | null>(null);

  // ============================================
  // USER AUTHENTICATION
  // ============================================
  
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const user = await mockApi.login(email, password);
      if (user) {
        setUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, fullName: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const user = await mockApi.signup(email, password, fullName);
      setUser(user);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (user) {
      const refreshed = await mockApi.getUserById(user.id);
      if (refreshed) {
        setUser(refreshed);
      }
    }
  }, [user]);

  // ============================================
  // ADMIN AUTHENTICATION
  // ============================================
  
  const adminLogin = useCallback(async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const admin = await mockApi.adminLogin({ username, password });
      if (admin) {
        setAdmin(admin);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const adminLogout = useCallback(() => {
    setAdmin(null);
  }, []);

  const updateAdminCredentials = useCallback(async (
    currentPassword: string,
    newUsername?: string,
    newPassword?: string
  ): Promise<boolean> => {
    try {
      const updates: Partial<AdminCredentials> = {};
      if (newUsername) updates.username = newUsername;
      if (newPassword) updates.password = newPassword;
      
      const success = await mockApi.updateAdminCredentials(currentPassword, updates);
      
      if (success && admin) {
        // Update local admin state
        const updatedAdmin = await mockApi.getAdminInfo();
        if (updatedAdmin) {
          setAdmin(updatedAdmin);
        }
      }
      
      return success;
    } catch (error) {
      console.error('Update admin credentials error:', error);
      return false;
    }
  }, [admin]);

  // ============================================
  // CONTEXT VALUE
  // ============================================
  
  const value: AuthContextType = {
    // User
    user,
    isLoading,
    isAuthenticated: !!user,
    
    // Admin
    admin,
    isAdminAuthenticated: !!admin,
    
    // User actions
    login,
    signup,
    logout,
    refreshUser,
    
    // Admin actions
    adminLogin,
    adminLogout,
    updateAdminCredentials,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// USE AUTH HOOK
// ============================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
