import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Shield, LogOut, Bell, Home, Users, FileText, School, MenuIcon, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { useTranslation } from 'react-i18next';
import AdminNotifications from "@/components/AdminNotifications";
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const AdminHeader = () => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, visible]);

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
    { path: '/admin/dashboard', label: t('admin.header.dashboard'), icon: Shield },
    { path: '/admin/needs', label: t('admin.header.needs'), icon: FileText },
    { path: '/admin/schools', label: t('admin.header.schools'), icon: School },
    { path: '/', label: t('admin.header.home'), icon: Home },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `transition-colors duration-200 ${
      isActive 
        ? 'font-bold text-gold' 
        : 'text-white hover:text-gold'
    }`;
  };

  return (
    <nav className={`bg-primary/95 backdrop-blur-md shadow-lg font-inter fixed w-full z-50 top-0 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className={`flex justify-between h-14 sm:h-16 md:h-18 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Mobile-First Logo and Title */}
          <div className={`flex items-center flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link to="/admin/dashboard" className={`flex items-center group ${isRTL ? 'flex-row-reverse' : ''}`} onClick={closeMobileMenu}>
              <Shield className={`h-7 sm:h-8 md:h-10 w-auto text-gold group-hover:text-gold/90 transition-colors ${isRTL ? 'ml-1 sm:ml-2 md:ml-3' : 'mr-1 sm:mr-2 md:mr-3'}`} />
              <div className="hidden sm:block">
                <span className={`text-sm sm:text-lg md:text-xl font-bold text-white leading-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('admin.header.adminPanel')}
                </span>
              </div>
              <div className="block sm:hidden">
                <span className="text-sm font-bold text-white">
                  Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Mobile Actions - Notifications and Menu */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Mobile Notification Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-gold h-9 w-9">
                  <Bell className="h-4 w-4" />
                  {unreadNotifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                    >
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <AdminNotifications />
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/10 h-9 w-9"
                  aria-label="Open menu"
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side={isRTL ? "left" : "right"}
                className="w-full sm:w-80 bg-primary text-white border-l-gold/20 p-0"
              >
                {/* Mobile Menu Header */}
                <div className={`flex items-center justify-between p-4 border-b border-white/10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Shield className={`h-6 w-6 text-gold ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <span className="font-bold text-base">
                      {t('admin.header.adminPanel')}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeMobileMenu}
                    className="text-white hover:bg-white/10 h-8 w-8"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Menu Content */}
                <nav className="flex flex-col p-3 space-y-1">
                  {/* Main Navigation */}
                  <div className="space-y-1">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <Link key={item.path} to={item.path} onClick={closeMobileMenu} className="block">
                          <Button 
                            variant="ghost" 
                            className={`w-full text-white hover:bg-white/10 hover:text-gold py-3 px-3 text-sm font-medium ${isRTL ? 'justify-end' : 'justify-start'} ${isActive ? 'bg-white/10 text-gold' : ''}`}
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            {item.label}
                          </Button>
                        </Link>
                      );
                    })}
                  </div>

                  {/* User Info & Logout Section */}
                  <div className="border-t border-white/10 pt-3 mt-3">
                    {user && (
                      <div className="space-y-2">
                        {user.email && (
                          <div className="px-3 py-2 bg-white/5 rounded-lg">
                            <span className="text-white/90 text-sm truncate block">
                              {user.email}
                            </span>
                          </div>
                        )}
                        
                        <Button 
                          onClick={handleSignOut} 
                          variant="ghost" 
                          className={`w-full text-white hover:bg-red-500/20 hover:text-red-300 py-3 px-3 text-sm font-medium ${isRTL ? 'justify-end' : 'justify-start'}`}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          {t('admin.header.logout')}
                        </Button>
                      </div>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation - Hidden on Mobile */}
          <div className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className={getLinkClass(item.path)}>
                  <Button variant="ghost" className={`text-white hover:bg-white/10 hover:text-gold px-3 py-2 text-sm font-medium ${isActive ? 'bg-white/10' : ''}`}>
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}

            {/* Desktop User Actions */}
            <div className={`flex items-center ml-4 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              {user?.email && (
                <span className="text-white/90 text-sm hidden lg:block max-w-48 truncate">
                  {user.email}
                </span>
              )}
              
              {/* Desktop Notification Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-gold">
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                      >
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <AdminNotifications />
              </DropdownMenu>
              
              <Button 
                onClick={handleSignOut} 
                variant="ghost" 
                className="text-white hover:bg-white/10 hover:text-red-300 px-3 py-2 text-sm font-medium"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('admin.header.logout')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminHeader;
