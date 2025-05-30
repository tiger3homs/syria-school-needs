
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, LogOut, Bell, Home, Users, FileText, School } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";

const AdminHeader = () => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const fetchUnreadCount = async () => {
    if (!user) return;

    try {
      const { count } = await supabaseAdmin
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .eq('read', false);

      setUnreadNotifications(count || 0);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Set up real-time subscription for notifications
    const channel = supabaseAdmin
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user?.id}`
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabaseAdmin.removeChannel(channel);
    };
  }, [user]);

  const navigationItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: Shield },
    { path: '/admin/needs', label: 'Needs', icon: FileText },
    { path: '/admin/schools', label: 'Schools', icon: School },
    { path: '/', label: 'Home', icon: Home },
  ];

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`;
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path} className={getLinkClass(item.path)}>
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* User info */}
            <div className="hidden sm:block text-sm text-gray-600">
              Admin: {user?.email}
            </div>
            
            {/* Notification Indicator */}
            <div className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadNotifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </Badge>
              )}
            </div>
            
            <Button variant="outline" onClick={() => signOut()}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <nav className="flex space-x-2 overflow-x-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path} className={getLinkClass(item.path)}>
                  <Icon className="h-4 w-4 mr-1" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
