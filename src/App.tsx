import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import LandingPage from '@/sections/landing/LandingPage';
import SignInPage from '@/sections/auth/SignInPage';
import SignUpPage from '@/sections/auth/SignUpPage';
import AdminLoginPage from '@/sections/auth/AdminLoginPage';
import UserDashboard from '@/sections/user/UserDashboard';
import AdminDashboard from '@/sections/admin/AdminDashboard';

// ============================================
// PAGE TYPES
// ============================================

export type Page = 
  | 'landing' 
  | 'signin' 
  | 'signup' 
  | 'admin-login'  // Dedicated admin login page
  | 'dashboard' 
  | 'market' 
  | 'deposit' 
  | 'withdraw' 
  | 'copytraders' 
  | 'profile' 
  | 'transactions'
  | 'admin';

// ============================================
// APP CONTENT
// ============================================

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const { isAuthenticated, isAdminAuthenticated } = useAuth();

  // Handle navigation
  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Redirect based on auth state
  useEffect(() => {
    // If admin is logged in, ensure they stay on admin pages
    if (isAdminAuthenticated) {
      if (currentPage !== 'admin') {
        navigate('admin');
      }
    }
    // If regular user is logged in, redirect away from auth pages
    else if (isAuthenticated) {
      if (['landing', 'signin', 'signup', 'admin-login'].includes(currentPage)) {
        navigate('dashboard');
      }
    }
  }, [isAuthenticated, isAdminAuthenticated, currentPage]);

  // Render the appropriate page
  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigate} />;
      case 'signin':
        return <SignInPage onNavigate={navigate} />;
      case 'signup':
        return <SignUpPage onNavigate={navigate} />;
      case 'admin-login':
        return <AdminLoginPage onNavigate={navigate} />;
      case 'dashboard':
      case 'market':
      case 'deposit':
      case 'withdraw':
      case 'copytraders':
      case 'profile':
      case 'transactions':
        return (
          <UserDashboard 
            currentPage={currentPage} 
            onNavigate={navigate} 
          />
        );
      case 'admin':
        return <AdminDashboard onNavigate={navigate} />;
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0C111D]">
      {renderPage()}
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
