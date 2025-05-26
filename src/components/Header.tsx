import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { School } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { user, profile, isAdmin, isPrincipal, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const getLinkClass = (path: string) => {
    return `hover:text-blue-600 transition-colors ${location.pathname === path ? 'font-bold text-blue-600' : 'text-gray-900'}`;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <School className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">School Rebuild Syria</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {profile?.email && (
                  <span className="text-gray-700 text-sm hidden sm:block">{profile.email}</span>
                )}
                {isPrincipal && (
                  <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin/dashboard" className={getLinkClass('/admin/dashboard')}>
                    <Button variant="ghost">Admin Dashboard</Button>
                  </Link>
                )}
                <Button onClick={handleSignOut} variant="ghost">Sign Out</Button>
              </>
            ) : (
              <>
                <Link to="/login" className={getLinkClass('/login')}>
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register" className={getLinkClass('/register')}>
                  <Button>Register School</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
