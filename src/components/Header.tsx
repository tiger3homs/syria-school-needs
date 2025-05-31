
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MenuIcon, X, ArrowRight } from 'lucide-react';

const Header = () => {
  const { user, profile, isAdmin, isPrincipal, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <nav className={`bg-primary/95 backdrop-blur-md shadow-lg font-inter fixed w-full z-50 top-0 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-18 items-center">
          {/* Logo and Brand - Mobile Optimized */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center group" onClick={closeMobileMenu}>
              <img 
                src="/logo.jpg" 
                alt="Syrian Ministry Logo" 
                className="h-10 sm:h-12 w-auto mr-2 sm:mr-3 rounded shadow-sm group-hover:shadow-md transition-shadow" 
              />
              <div className="hidden sm:block">
                <span className="text-lg sm:text-xl font-bold text-white leading-tight">
                  إعادة بناء المدارس
                  <span className="block text-sm font-normal opacity-90">School Rebuild Syria</span>
                </span>
              </div>
              <div className="block sm:hidden">
                <span className="text-base font-bold text-white">
                  المدارس السورية
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link to="/" className={getLinkClass('/')}>
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-gold px-3 py-2 text-sm font-medium">
                الرئيسية
                <span className="block text-xs opacity-75">Home</span>
              </Button>
            </Link>
            <Link to="/needs" className={getLinkClass('/needs')}>
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-gold px-3 py-2 text-sm font-medium">
                الاحتياجات
                <span className="block text-xs opacity-75">Needs</span>
              </Button>
            </Link>
            <Link to="/schools" className={getLinkClass('/schools')}>
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-gold px-3 py-2 text-sm font-medium">
                المدارس
                <span className="block text-xs opacity-75">Schools</span>
              </Button>
            </Link>

            {/* User Authentication - Desktop */}
            {!user && (
              <div className="flex items-center space-x-2 ml-4">
                <Link to="/login" className={getLinkClass('/login')}>
                  <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-gold px-3 py-2 text-sm font-medium">
                    تسجيل الدخول
                    <span className="block text-xs opacity-75">Login</span>
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gold text-primary hover:bg-gold/90 rounded-lg px-4 py-2 text-sm font-semibold shadow-md hover:shadow-lg transition-all">
                    تسجيل مدرسة
                    <span className="block text-xs font-normal">Register School</span>
                  </Button>
                </Link>
              </div>
            )}

            {user && (
              <div className="flex items-center space-x-2 ml-4">
                {profile?.email && (
                  <span className="text-white/90 text-sm hidden xl:block max-w-32 truncate">
                    {profile.email}
                  </span>
                )}
                {isPrincipal && (
                  <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                    <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-gold px-3 py-2 text-sm font-medium">
                      لوحة التحكم
                      <span className="block text-xs opacity-75">Dashboard</span>
                    </Button>
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin/dashboard" className={getLinkClass('/admin/dashboard')}>
                    <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-gold px-3 py-2 text-sm font-medium">
                      إدارة النظام
                      <span className="block text-xs opacity-75">Admin</span>
                    </Button>
                  </Link>
                )}
                <Button 
                  onClick={handleSignOut} 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 hover:text-red-300 px-3 py-2 text-sm font-medium"
                >
                  خروج
                  <span className="block text-xs opacity-75">Sign Out</span>
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
                  aria-label="Open menu"
                >
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-full sm:w-80 bg-primary text-white border-l-gold/20 p-0"
              >
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div className="flex items-center">
                    <img src="/logo.jpg" alt="Logo" className="h-8 w-auto mr-2 rounded" />
                    <span className="font-bold text-lg">
                      المدارس السورية
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeMobileMenu}
                    className="text-white hover:bg-white/10 touch-target"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                {/* Mobile Menu Content */}
                <nav className="flex flex-col p-4 space-y-2">
                  {/* Main Navigation */}
                  <div className="space-y-1">
                    <Link to="/" onClick={closeMobileMenu} className="block">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-white hover:bg-white/10 hover:text-gold py-3 px-4 text-base font-medium"
                      >
                        الرئيسية
                        <span className="text-sm opacity-75 ml-auto">Home</span>
                      </Button>
                    </Link>
                    
                    <Link to="/needs" onClick={closeMobileMenu} className="block">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-white hover:bg-white/10 hover:text-gold py-3 px-4 text-base font-medium"
                      >
                        الاحتياجات
                        <span className="text-sm opacity-75 ml-auto">Needs</span>
                      </Button>
                    </Link>
                    
                    <Link to="/schools" onClick={closeMobileMenu} className="block">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-white hover:bg-white/10 hover:text-gold py-3 px-4 text-base font-medium"
                      >
                        المدارس
                        <span className="text-sm opacity-75 ml-auto">Schools</span>
                      </Button>
                    </Link>
                  </div>

                  {/* Authentication Section */}
                  <div className="border-t border-white/10 pt-4 mt-4">
                    {!user && (
                      <div className="space-y-2">
                        <Link to="/login" onClick={closeMobileMenu} className="block">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-white hover:bg-white/10 hover:text-gold py-3 px-4 text-base font-medium"
                          >
                            تسجيل الدخول
                            <span className="text-sm opacity-75 ml-auto">Login</span>
                          </Button>
                        </Link>
                        <Link to="/register" onClick={closeMobileMenu} className="block">
                          <Button className="w-full bg-gold text-primary hover:bg-gold/90 rounded-lg py-3 px-4 text-base font-semibold shadow-md">
                            تسجيل مدرسة جديدة
                            <span className="block text-sm font-normal">Register New School</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
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
                              className="w-full justify-start text-white hover:bg-white/10 hover:text-gold py-3 px-4 text-base font-medium"
                            >
                              لوحة التحكم
                              <span className="text-sm opacity-75 ml-auto">Dashboard</span>
                            </Button>
                          </Link>
                        )}
                        
                        {isAdmin && (
                          <Link to="/admin/dashboard" onClick={closeMobileMenu} className="block">
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start text-white hover:bg-white/10 hover:text-gold py-3 px-4 text-base font-medium"
                            >
                              إدارة النظام
                              <span className="text-sm opacity-75 ml-auto">Admin Dashboard</span>
                            </Button>
                          </Link>
                        )}
                        
                        <Button 
                          onClick={handleSignOut} 
                          variant="ghost" 
                          className="w-full justify-start text-white hover:bg-red-500/20 hover:text-red-300 py-3 px-4 text-base font-medium"
                        >
                          تسجيل الخروج
                          <span className="text-sm opacity-75 ml-auto">Sign Out</span>
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
