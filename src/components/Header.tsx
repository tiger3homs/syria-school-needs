import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';

const Header = () => {
  const { user, profile, isAdmin, isPrincipal, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

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
  };

  const getLinkClass = (path: string) => {
    return `hover:text-gold transition-colors ${location.pathname === path ? 'font-bold text-gold' : 'text-white-bg'}`;
  };

  return (
    <nav className={`bg-primary bg-opacity-80 backdrop-blur-md shadow-md font-inter fixed w-full z-50 top-0 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo.jpg" alt="Syrian Ministry of Education Logo" className="h-12 w-auto mr-3" />
              <span className="ml-2 text-xl font-extrabold text-white-bg">School Rebuild Syria</span>
            </Link>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            {/* Public Navigation Links */}
            <Link to="/" className={getLinkClass('/')}>
              <Button variant="ghost" className="text-white-bg hover:bg-primary/80 hover:text-gold px-4 py-2">Home</Button>
            </Link>
            <Link to="/needs" className={getLinkClass('/needs')}>
              <Button variant="ghost" className="text-white-bg hover:bg-primary/80 hover:text-gold px-4 py-2">Needs</Button>
            </Link>
            <Link to="/schools" className={getLinkClass('/schools')}>
              <Button variant="ghost" className="text-white-bg hover:bg-primary/80 hover:text-gold px-4 py-2">Schools</Button>
            </Link>

            {/* Login and Register School Buttons for public view */}
            {!user && (
              <>
                <Link to="/login" className={getLinkClass('/login')}>
                  <Button variant="ghost" className="text-white-bg hover:bg-primary/80 hover:text-gold px-4 py-2">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gold text-white hover:bg-gold/90 rounded-full px-6 py-2 shadow-md">Register School</Button>
                </Link>
              </>
            )}

            {/* Conditional User/Admin/Principal Links */}
            {user && (
              <>
                {profile?.email && (
                  <span className="text-white-bg text-sm hidden sm:block">{profile.email}</span>
                )}
                {isPrincipal && (
                  <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                    <Button variant="ghost" className="text-white-bg hover:bg-primary/80 hover:text-gold px-4 py-2">Dashboard</Button>
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin/dashboard" className={getLinkClass('/admin/dashboard')}>
                    <Button variant="ghost" className="text-white-bg hover:bg-primary/80 hover:text-gold px-4 py-2">Admin Dashboard</Button>
                  </Link>
                )}
                <Button onClick={handleSignOut} variant="ghost" className="text-white-bg hover:bg-primary/80 hover:text-gold px-4 py-2">Sign Out</Button>
              </>
            )}
          </div>
          <div className="sm:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white-bg">
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-primary text-white-bg">
                <nav className="flex flex-col gap-4 pt-8">
                  <Link to="/" className={getLinkClass('/')}>
                    <Button variant="ghost" className="w-full justify-start text-white-bg hover:bg-primary/80 hover:text-gold">Home</Button>
                  </Link>
                  <Link to="/needs" className={getLinkClass('/needs')}>
                    <Button variant="ghost" className="w-full justify-start text-white-bg hover:bg-primary/80 hover:text-gold">Needs</Button>
                  </Link>
                  <Link to="/schools" className={getLinkClass('/schools')}>
                    <Button variant="ghost" className="w-full justify-start text-white-bg hover:bg-primary/80 hover:text-gold">Schools</Button>
                  </Link>

                  {!user && (
                    <>
                      <Link to="/login" className={getLinkClass('/login')}>
                        <Button variant="ghost" className="w-full justify-start text-white-bg hover:bg-primary/80 hover:text-gold">Login</Button>
                      </Link>
                      <Link to="/register">
                        <Button className="w-full justify-center bg-gold text-white hover:bg-gold/90 rounded-full shadow-md">Register School</Button>
                      </Link>
                    </>
                  )}

                  {user && (
                    <>
                      {profile?.email && (
                        <span className="text-white-bg text-sm px-4 py-2">{profile.email}</span>
                      )}
                      {isPrincipal && (
                        <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                          <Button variant="ghost" className="w-full justify-start text-white-bg hover:bg-primary/80 hover:text-gold">Dashboard</Button>
                        </Link>
                      )}
                      {isAdmin && (
                        <Link to="/admin/dashboard" className={getLinkClass('/admin/dashboard')}>
                          <Button variant="ghost" className="w-full justify-start text-white-bg hover:bg-primary/80 hover:text-gold">Admin Dashboard</Button>
                        </Link>
                      )}
                      <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start text-white-bg hover:bg-primary/80 hover:text-gold">Sign Out</Button>
                    </>
                  )}
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
