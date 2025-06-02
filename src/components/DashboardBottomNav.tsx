
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, School, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const DashboardBottomNav = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const location = useLocation();

  const navItems = [
    {
      to: '/dashboard',
      icon: Home,
      label: t('dashboard.overview'),
      key: 'overview'
    },
    {
      to: '/needs/new',
      icon: Plus,
      label: t('needs.addNeed'),
      key: 'add'
    },
    {
      to: '/needs',
      icon: School,
      label: t('nav.needs'),
      key: 'needs'
    },
    {
      to: '/dashboard',
      icon: User,
      label: t('dashboard.profile'),
      key: 'profile'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
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
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardBottomNav;
