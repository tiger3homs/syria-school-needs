
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, Search, School, Users, Phone, Mail, LogOut, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface School {
  id: string;
  name: string;
  address: string;
  number_of_students: number;
  contact_phone?: string;
  contact_email?: string;
  needs: Array<{
    id: string;
    title: string;
    category: string;
    priority: string;
    status: string;
  }>;
}

const AdminSchools = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchSchools();
  }, []);

  useEffect(() => {
    filterSchools();
  }, [schools, searchTerm]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/admin/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      navigate('/admin/login');
    }
  };

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select(`
          id,
          name,
          address,
          number_of_students,
          contact_phone,
          contact_email,
          needs (
            id,
            title,
            category,
            priority,
            status
          )
        `)
        .order('name');

      if (error) throw error;
      setSchools(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching schools",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterSchools = () => {
    const filtered = schools.filter(school =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSchools(filtered);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const getSchoolStats = (school: School) => {
    const totalNeeds = school.needs.length;
    const fulfilledNeeds = school.needs.filter(need => need.status === 'fulfilled').length;
    const pendingNeeds = totalNeeds - fulfilledNeeds;
    const highPriorityNeeds = school.needs.filter(need => need.priority === 'high' && need.status === 'pending').length;

    return { totalNeeds, fulfilledNeeds, pendingNeeds, highPriorityNeeds };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading schools...</p>
        </div>
      </div>
    );
  }

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
                <Link to="/admin/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
                <Link to="/admin/needs" className="text-gray-600 hover:text-gray-900">Needs</Link>
                <Link to="/admin/schools" className="text-blue-600 font-medium">Schools</Link>
              </nav>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Schools Directory</h2>
          <p className="text-gray-600">Browse all registered schools and their information</p>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search schools by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Showing {filteredSchools.length} of {schools.length} schools
            </div>
          </CardContent>
        </Card>

        {/* Schools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school) => {
            const stats = getSchoolStats(school);
            return (
              <Card key={school.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <School className="h-5 w-5 text-blue-600 mr-2" />
                      <CardTitle className="text-lg">{school.name}</CardTitle>
                    </div>
                    {stats.highPriorityNeeds > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {stats.highPriorityNeeds} urgent
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                    {school.address}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* School Info */}
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {school.number_of_students} students
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1">
                    {school.contact_phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {school.contact_phone}
                      </div>
                    )}
                    {school.contact_email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {school.contact_email}
                      </div>
                    )}
                  </div>

                  {/* Needs Summary */}
                  <div className="pt-3 border-t">
                    <div className="text-sm font-medium mb-2">Needs Summary</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-gray-900">{stats.totalNeeds}</div>
                        <div className="text-gray-500">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-orange-600">{stats.pendingNeeds}</div>
                        <div className="text-gray-500">Pending</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">{stats.fulfilledNeeds}</div>
                        <div className="text-gray-500">Fulfilled</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Needs */}
                  {school.needs.length > 0 && (
                    <div className="pt-3 border-t">
                      <div className="text-sm font-medium mb-2">Recent Needs</div>
                      <div className="space-y-1">
                        {school.needs.slice(0, 3).map((need) => (
                          <div key={need.id} className="flex items-center justify-between text-xs">
                            <span className="truncate flex-1 mr-2">{need.title}</span>
                            <div className="flex items-center space-x-1">
                              <Badge variant="outline" className="text-xs px-1">
                                {need.priority}
                              </Badge>
                              <Badge 
                                variant={need.status === 'fulfilled' ? 'default' : 'secondary'}
                                className="text-xs px-1"
                              >
                                {need.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        {school.needs.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{school.needs.length - 3} more needs
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredSchools.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms.' : 'No schools have been registered yet.'}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminSchools;
