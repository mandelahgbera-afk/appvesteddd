import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User, SuperAdmin, AdminCredentials } from '@/types';
import { signIn, signOut, signUp, getCurrentUser, supabase } from '@/lib/supabase';

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
      const { user: authUser, error } = await signIn(email, password);
      if (error) {
        console.error('Login error:', error);
        return false;
      }
      if (authUser) {
        setUser(authUser);
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
      const { user: authUser, error } = await signUp(email, password, fullName);
      if (error) {
        console.error('Signup error:', error);
        return false;
      }
      if (authUser) {
        setUser(authUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
    setAdmin(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const refreshed = await getCurrentUser();
    if (refreshed) {
      setUser(refreshed);
    }
  }, []);

  // ============================================
  // ADMIN AUTHENTICATION (Separate from Supabase)
  // ============================================
  // Admin authentication is handled separately via the super_admin table
  // This is a placeholder for future implementation
  
  const adminLogin = useCallback(async (_username: string, _password: string): Promise<boolean> => {
    console.warn('Admin login not yet implemented');
    return false;
  }, []);

  const adminLogout = useCallback(() => {
    setAdmin(null);
  }, []);

  const updateAdminCredentials = useCallback(async (
    _currentPassword: string,
    _newUsername?: string,
    _newPassword?: string
  ): Promise<boolean> => {
    console.warn('Update admin credentials not yet implemented');
    return false;
  }, []);

  // ============================================
  // INITIALIZE AUTH STATE
  // ============================================

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const user = await getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          const user = await getCurrentUser();
          setUser(user);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

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
