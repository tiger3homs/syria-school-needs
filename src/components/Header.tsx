import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription 
} from '@/components/ui/sheet';
import { MenuIcon, X, ArrowRight } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const { user, profile, isAdmin, isPrincipal, signOut } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    const isScrollingUp = prevScrollPos > currentScrollPos;
    
    // Show header when:
    // 1. Scrolling up
    // 2. At the top of the page (within first 10px)
    // 3. When scroll position is less than 50px (to prevent quick hiding at start)
    setVisible(isScrollingUp || currentScrollPos < 10 || currentScrollPos < 50);
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `transition-colors duration-200 ${
      isActive 
        ? 'font-bold text-gold' 
        : 'text-white hover:text-gold'
    }`;
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const NavButton = ({ to, children, className = '', onClick = () => {} }) => (
    <Link to={to} onClick={() => { closeMobileMenu(); onClick(); }} className={`block w-full ${className}`}>
      <Button variant="ghost" className={`text-white hover:bg-white/10 hover:text-gold px-3 py-2 text-sm font-medium ${getLinkClass(to)}`}>
        {children}
      </Button>
    </Link> 
  );

  return (
    <nav className={`bg-primary/95 backdrop-blur-md shadow-lg font-inter fixed w-full z-50 top-0 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between h-16 sm:h-18 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Logo and Brand */}
          <div className={`flex items-center flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link to="/" className={`flex items-center group ${isRTL ? 'flex-row-reverse' : ''}`} onClick={closeMobileMenu}>
              <img 
                src="/logo.jpg" 
                alt="Syrian Ministry Logo" 
                className={`h-10 sm:h-12 w-auto rounded shadow-sm group-hover:shadow-md transition-shadow ${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'}`} 
              />
              <div className="hidden sm:block">
                <span className={`text-lg sm:text-xl font-bold text-white leading-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('site.title')}
                  <span className="block text-sm font-normal opacity-90">{t('site.description')}</span>
                </span>
              </div>
              <div className="block sm:hidden">
                <span className="text-base font-bold text-white">
                  {isRTL ? 'المدارس السورية' : 'Syrian Schools'}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden lg:flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
                        {/* Language Switcher */}
            <LanguageSwitcher />
            
            <Link to="/" className={getLinkClass('/')}>
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-gold px-3 py-2 text-sm font-medium">
                {t('nav.home')}
              </Button>
            </Link>
            <Link to="/needs" className={getLinkClass('/needs')}>
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-gold px-3 py-2 text-sm font-medium">
                {t('nav.needs')}
              </Button>
            </Link>
            <Link to="/schools" className={getLinkClass('/schools')}>
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-gold px-3 py-2 text-sm font-medium">
                {t('nav.schools')}
              </Button>
            </Link>



            {/* User Authentication - Desktop */}
            {!user && (
              <div className={`flex items-center ${isRTL ? 'mr-4 space-x-reverse space-x-2' : 'ml-4 space-x-2'}`}>
                <Link to="/login" className={getLinkClass('/login')}>
                  <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-gold px-3 py-2 text-sm font-medium">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gold text-primary hover:bg-gold/90 rounded-xl px-4 py-2 text-sm font-semibold shadow-md hover:shadow-lg transition-all">
                    {t('nav.register')}
                  </Button>
                </Link>
              </div>
            )}

            {user && (
              <div className={`flex items-center ml-4 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                {profile?.email && (
                  <span className="text-white/90 text-sm hidden xl:block max-w-32 truncate">
                    {profile.email}
                  </span>
                )}
                {isPrincipal && (
                  <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                    <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-gold px-3 py-2 text-sm font-medium">
                      {t('nav.dashboard')}
                    </Button>
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin/dashboard" className={getLinkClass('/admin/dashboard')}>
                    <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-gold px-3 py-2 text-sm font-medium">
                      {t('nav.admin')}
                    </Button>
                  </Link>
                )}
                <Button 
                  onClick={handleSignOut} 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 hover:text-red-300 px-3 py-2 text-sm font-medium"
                >
                  {t('nav.logout')}
                </Button>
              </div>
            )}
          </div>

          

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/10 touch-target"
                  aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-navigation"
                >
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side={isRTL ? "left" : "right"}
                className="w-full sm:w-80 bg-primary text-white border-l-gold/20 p-0"
                role="navigation"
                id="mobile-navigation"
                aria-label="Site navigation"
              >
                <SheetHeader>
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">Access all site pages and features</SheetDescription>
                </SheetHeader>
                {/* Mobile Menu Header */}
                <div className={`flex items-center justify-between p-4 border-b border-white/10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <img src="/logo.jpg" alt="Logo" className={`h-8 w-auto rounded ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <span className="font-bold text-lg">
                      {t('site.title')}
                    </span>
                  </div>
                </div>

                {/* Mobile Menu Content */}
                <nav className="flex flex-col p-4 space-y-2">
                  {/* Language Switcher for Mobile */}
                  <div className="mb-4 pb-4 border-b border-white/10">
                    <LanguageSwitcher />
                  </div>

                  {/* Main Navigation */}
                  <div className="space-y-1">
                    <NavButton to="/" className="w-full">
                      {t('nav.home')}
                    </NavButton>
                    
                    <NavButton to="/needs" className="w-full">
                      {t('nav.needs')}
                    </NavButton>
                    
                    <NavButton to="/schools" className="w-full">
                      {t('nav.schools')}
                    </NavButton>
                  </div>

                  {/* Authentication Section */}
                  <div className="border-t border-white/10 pt-4 mt-4">
                    {!user && (
                      <div className="space-y-2">
                        <Link to="/login" onClick={closeMobileMenu} className="block">
                          <Button 
                            variant="ghost" 
                            className={`w-full text-white hover:bg-white/10 hover:text-gold py-3 px-4 text-base font-medium`}
                          >
                            {t('nav.login')}
                          </Button>
                        </Link>
                        <Link to="/register" onClick={closeMobileMenu} className="block">
                          <Button className="w-full bg-gold text-primary hover:bg-gold/90 rounded-xl py-3 px-4 text-base font-semibold shadow-md">
                            {t('nav.register')}
                            <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                          </Button>
                        </Link>
                      </div>
                    )}

                    {user && (
                      <div className="space-y-2">
                        {profile?.email && (
                          <div className="px-4 py-2 bg-white/5 rounded-lg">
                            <span className="text-white/90 text-sm truncate block">
                              {profile.email}
                            </span>
                          </div>
                        )}
                        
                        {isPrincipal && (
                          <Link to="/dashboard" onClick={closeMobileMenu} className="block">
                            <Button 
                              variant="ghost" 
                              className={`w-full text-white hover:bg-white/10 hover:text-gold py-3 px-4 text-base font-medium ${isRTL ? 'justify-end' : 'justify-start'}`}
                            >
                              {t('nav.dashboard')}
                            </Button>
                          </Link>
                        )}
                        
                        {isAdmin && (
                          <Link to="/admin/dashboard" onClick={closeMobileMenu} className="block">
                            <Button 
                              variant="ghost" 
                              className={`w-full text-white hover:bg-white/10 hover:text-gold py-3 px-4 text-base font-medium ${isRTL ? 'justify-end' : 'justify-start'}`}
                            >
                              {t('nav.admin')}
                            </Button>
                          </Link>
                        )}
                        
                        <Button 
                          onClick={handleSignOut} 
                          variant="ghost" 
                          className={`w-full text-white hover:bg-red-500/20 hover:text-red-300 py-3 px-4 text-base font-medium ${isRTL ? 'justify-end' : 'justify-start'}`}
                        >
                          {t('nav.logout')}
                        </Button>
                      </div>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
