
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
import CustomPage from "./pages/CustomPage";
import NotFound from "./pages/NotFound";
import NeedsPage from "./pages/NeedsPage";
import SchoolsPage from "./pages/SchoolsPage";

// Import i18n configuration
import './i18n';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const queryClient = new QueryClient();

const HeaderConditional = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return null; // Don't render header on admin routes
  }

  return <Header />;
};

const AppContent = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set document direction based on language
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="min-h-screen pt-[4rem] sm:pt-[4.5rem]">
      <HeaderConditional />
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
        {/* Dynamic route for custom pages */}
        <Route path="/:slug" element={<CustomPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => {
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
