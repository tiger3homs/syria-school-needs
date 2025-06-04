
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSchools from "./pages/AdminSchools";
import AdminNeeds from "./pages/AdminNeeds";
import AdminNotificationsPage from "./pages/AdminNotificationsPage";
import SchoolsPage from "./pages/SchoolsPage";
import NeedsPage from "./pages/NeedsPage";
import NotFound from "./pages/NotFound";
import "./App.css";
import "./i18n";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={
                    <>
                      <Header />
                      <Index />
                    </>
                  } />
                  <Route path="/schools" element={
                    <>
                      <Header />
                      <SchoolsPage />
                    </>
                  } />
                  <Route path="/needs" element={
                    <>
                      <Header />
                      <NeedsPage />
                    </>
                  } />
                  
                  {/* Auth routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected dashboard routes */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/schools" element={<AdminSchools />} />
                  <Route path="/admin/needs" element={<AdminNeeds />} />
                  <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
                  
                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
