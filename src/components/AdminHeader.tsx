import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AdminHeader = () => {
  const { signOut } = useAuth();

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
