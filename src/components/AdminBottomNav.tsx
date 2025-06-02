
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Users, History, Bell, School } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminBottomNav = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const location = useLocation();

  const navItems = [
    {
      to: '/admin/dashboard',
      icon: BarChart3,
      label: t('admin.analytics'),
      key: 'dashboard'
    },
    {
      to: '/admin/schools',
      icon: School,
      label: t('admin.schools'),
      key: 'schools'
    },
    {
      to: '/admin/needs',
      icon: Users,
      label: t('admin.needs'),
      key: 'needs'
    },
    {
      to: '/admin/notifications',
      icon: Bell,
      label: t('admin.notifications.title'),
      key: 'notifications'
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <nav className={`flex ${isRTL ? 'flex-row-reverse' : ''}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          
          return (
            <Link
              key={item.key}
              to={item.to}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors",
                active 
                  ? "text-primary bg-primary/5" 
                  : "text-gray-500 hover:text-primary"
              )}
            >
              <Icon className={cn("h-5 w-5 mb-1", active && "text-primary")} />
              <span className="text-xs text-center leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminBottomNav;
