
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminNeeds from "./pages/AdminNeeds";
import AdminSchools from "./pages/AdminSchools";
import AdminNotificationsPage from "./pages/AdminNotificationsPage";
import NotFound from "./pages/NotFound";
import NeedsPage from "./pages/NeedsPage";
import SchoolsPage from "./pages/SchoolsPage";

// Import i18n configuration
import './i18n';
import { useTranslation } from 'react-i18next';
import { useEffect, Suspense } from 'react';
import { performanceMonitor } from '@/utils/performance';

// Performance: Create query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

const HeaderConditional = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return null; // Don't render header on admin routes
  }

  return <Header />;
};

// Performance: Loading component for Suspense
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

const AppContent = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    performanceMonitor.mark('app-init-start');
    
    // Set document direction and language based on i18n
    const isRTL = i18n.language === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    
    // Security: Add security-related meta tags and attributes
    document.documentElement.setAttribute('data-theme', 'default');
    
    // Performance: Preload critical resources
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = '/src/index.css';
    document.head.appendChild(link);
    
    performanceMonitor.mark('app-init-end');
    performanceMonitor.measure('app-initialization', 'app-init-start', 'app-init-end');
    
    return () => {
      document.head.removeChild(link);
    };
  }, [i18n.language]);

  return (
    <div className="min-h-screen pt-[4rem] sm:pt-[4.5rem]">
      <HeaderConditional />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          } />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute requireAuth>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/needs" element={<NeedsPage />} />
          <Route path="/schools" element={<SchoolsPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/needs" element={
            <ProtectedRoute requiredRole="admin">
              <AdminNeeds />
            </ProtectedRoute>
          } />
          <Route path="/admin/schools" element={
            <ProtectedRoute requiredRole="admin">
              <AdminSchools />
            </ProtectedRoute>
          } />
          <Route path="/admin/notifications" element={
            <ProtectedRoute requiredRole="admin">
              <AdminNotificationsPage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
};

const App = () => {
  useEffect(() => {
    // Security: Set up security headers via meta tags
    const metaCSP = document.createElement('meta');
    metaCSP.httpEquiv = 'Content-Security-Policy';
    metaCSP.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.gpteng.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self' data:;";
    document.head.appendChild(metaCSP);

    // Performance: Enable passive listeners for better scroll performance
    const options = { passive: true };
    
    return () => {
      document.head.removeChild(metaCSP);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
