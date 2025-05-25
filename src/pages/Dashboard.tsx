
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { School, Plus, Edit, Eye, Target, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { RegisterSchoolModal } from "@/components/RegisterSchoolModal";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [school, setSchool] = useState<any>(null);
  const [needs, setNeeds] = useState<any[]>([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSchoolData();
    }
  }, [user]);

  const fetchSchoolData = async () => {
    try {
      // Fetch school data
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .select('*')
        .eq('principal_id', user?.id)
        .maybeSingle();

      if (schoolError && schoolError.code !== 'PGRST116') {
        throw schoolError;
      }

      setSchool(schoolData);

      // If school exists, fetch needs
      if (schoolData) {
        const { data: needsData, error: needsError } = await supabase
          .from('needs')
          .select('*')
          .eq('school_id', schoolData.id)
          .order('created_at', { ascending: false });

        if (needsError) throw needsError;
        setNeeds(needsData || []);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "fulfilled": return "bg-green-100 text-green-800";
      case "pending": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no school registered, show registration prompt
  if (!school) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <School className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">School Rebuild Syria</span>
                </Link>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <School className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to School Rebuild Syria</h1>
            <p className="text-lg text-gray-600 mb-8">
              To get started, please register your school information.
            </p>
            <Button
              onClick={() => setShowRegisterModal(true)}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Register Your School
            </Button>
          </div>
        </div>

        <RegisterSchoolModal
          open={showRegisterModal}
          onOpenChange={setShowRegisterModal}
          onSuccess={fetchSchoolData}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <School className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">School Rebuild Syria</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome back, Principal</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{school.name}</h1>
          <p className="text-gray-600">Manage your school profile and submit needs for support</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="needs">Manage Needs</TabsTrigger>
            <TabsTrigger value="profile">School Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Needs</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{needs.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {needs.filter(n => n.status === 'pending').length} pending, {needs.filter(n => n.status === 'fulfilled').length} fulfilled
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                  <div className="h-2 w-2 bg-red-500 rounded-full" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{needs.filter(n => n.priority === 'high').length}</div>
                  <p className="text-xs text-muted-foreground">Urgent attention needed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Students</CardTitle>
                  <School className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{school.number_of_students}</div>
                  <p className="text-xs text-muted-foreground">Total enrollment</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fulfilled</CardTitle>
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{needs.filter(n => n.status === 'fulfilled').length}</div>
                  <p className="text-xs text-muted-foreground">Successfully completed</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Needs */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recent Needs</CardTitle>
                    <CardDescription>Your latest submitted needs and their status</CardDescription>
                  </div>
                  <Link to="/needs/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Need
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {needs.slice(0, 3).map((need) => (
                    <div key={need.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{need.title}</h4>
                          <Badge className={getPriorityColor(need.priority)}>
                            {need.priority}
                          </Badge>
                          <Badge className={getStatusColor(need.status)}>
                            {need.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{need.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Quantity: {need.quantity} • Category: {need.category}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {needs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No needs submitted yet. <Link to="/needs/new" className="text-blue-600 hover:underline">Add your first need</Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Needs Tab */}
          <TabsContent value="needs" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>All School Needs</CardTitle>
                    <CardDescription>Manage and track all submitted needs</CardDescription>
                  </div>
                  <Link to="/needs/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Need
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {needs.map((need) => (
                    <div key={need.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{need.title}</h4>
                          <Badge className={getPriorityColor(need.priority)}>
                            {need.priority}
                          </Badge>
                          <Badge className={getStatusColor(need.status)}>
                            {need.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{need.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Quantity: {need.quantity} • Category: {need.category} • Created: {new Date(need.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {needs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No needs submitted yet. <Link to="/needs/new" className="text-blue-600 hover:underline">Add your first need</Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>School Profile</CardTitle>
                    <CardDescription>View and edit your school information</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">School Name</Label>
                    <p className="mt-1 text-sm">{school.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Number of Students</Label>
                    <p className="mt-1 text-sm">{school.number_of_students}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Phone</Label>
                    <p className="mt-1 text-sm">{school.contact_phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="mt-1 text-sm">{school.contact_email}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Address</Label>
                  <p className="mt-1 text-sm">{school.address}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Description</Label>
                  <p className="mt-1 text-sm">{school.description || "No description provided"}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

function Label({ className, children, ...props }: { className?: string; children: React.ReactNode }) {
  return <label className={className} {...props}>{children}</label>;
}

export default Dashboard;
