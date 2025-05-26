import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, School, ClipboardList, CheckCircle, XCircle, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ProtectedRoute } from "@/components/ProtectedRoute";

interface DashboardStats {
  totalNeeds: number;
  fulfilledNeeds: number;
  pendingNeeds: number;
  totalSchools: number;
  needsByCategory: Record<string, number>;
}

const AdminDashboardComponent = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      // Fetch needs statistics
      const { data: needs, error: needsError } = await supabaseAdmin
        .from('needs')
        .select('category, status');

      if (needsError) throw needsError;

      // Fetch schools count
      const { count: schoolsCount, error: schoolsError } = await supabaseAdmin
        .from('schools')
        .select('*', { count: 'exact', head: true });

      if (schoolsError) throw schoolsError;

      // Calculate statistics
      const totalNeeds = needs?.length || 0;
      const fulfilledNeeds = needs?.filter((n) => n.status === 'fulfilled').length || 0;
      const pendingNeeds = totalNeeds - fulfilledNeeds;

      const needsByCategory = needs?.reduce((acc, need) => {
        acc[need.category] = (acc[need.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      setStats({
        totalNeeds,
        fulfilledNeeds,
        pendingNeeds,
        totalSchools: schoolsCount || 0,
        needsByCategory,
      });
    } catch (error: any) {
      toast({
        title: "Error fetching statistics",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
              </nav>
              <Button variant="outline">
                <Link to="/admin/login">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600">Monitor and manage school needs across Syria</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Needs</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalNeeds}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fulfilled</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.fulfilledNeeds}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <XCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats?.pendingNeeds}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Schools</CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalSchools}</div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Needs by Category</CardTitle>
              <CardDescription>Distribution of needs across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats?.needsByCategory || {}).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="capitalize font-medium">{category.replace('_', ' ')}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link to="/admin/needs">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Manage All Needs
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/admin/schools">
                  <School className="h-4 w-4 mr-2" />
                  View Schools Directory
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

const AdminDashboard = () => (
  <ProtectedRoute requiredRole="admin">
    <AdminDashboardComponent />
  </ProtectedRoute>
);

export default AdminDashboard;
