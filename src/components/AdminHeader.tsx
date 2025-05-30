
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, LogOut, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";

const AdminHeader = () => {
  const { signOut, user } = useAuth();
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

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6">
              <Link to="/admin/dashboard" className="text-blue-600 font-medium">Dashboard</Link>
              <Link to="/admin/needs" className="text-gray-600 hover:text-gray-900">Needs</Link>
              <Link to="/admin/schools" className="text-gray-600 hover:text-gray-900">Schools</Link>
              <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            </nav>
            
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
      </div>
    </header>
  );
};

export default AdminHeader;
