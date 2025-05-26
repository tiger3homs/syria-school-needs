
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { School, Plus, Edit, Eye, Target, MapPin, Users, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useSchoolData } from "@/hooks/useSchoolData";
import { EditSchoolProfile } from "@/components/EditSchoolProfile";
import { SubmitNeedForm } from "@/components/SubmitNeedForm";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { school, needs, loading, error, updateSchool, createNeed } = useSchoolData();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSubmittingNeed, setIsSubmittingNeed] = useState(false);

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mt-4 text-gray-600">You are not authenticated.</p>
          <Link to="/login" className="text-blue-500">Login</Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mt-4 text-red-600">{error}</p>
          <p className="text-gray-600">Please contact support if this issue persists.</p>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mt-4 text-gray-600">No school found for your account.</p>
          <p className="text-sm text-gray-500">Please contact support to link your school.</p>
        </div>
      </div>
    );
  }

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
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatPriority = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const handleUpdateSchool = async (updates: any) => {
    const success = await updateSchool(updates);
    if (success) {
      setIsEditingProfile(false);
    }
    return success;
  };

  const handleCreateNeed = async (needData: any) => {
    const success = await createNeed(needData);
    if (success) {
      setIsSubmittingNeed(false);
    }
    return success;
  };

  // Calculate stats
  const totalNeeds = needs.length;
  const pendingNeeds = needs.filter(need => need.status === 'pending').length;
  const fulfilledNeeds = needs.filter(need => need.status === 'fulfilled').length;
  const highPriorityNeeds = needs.filter(need => need.priority === 'high').length;

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
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">School Dashboard</h1>
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
                  <div className="text-2xl font-bold">{totalNeeds}</div>
                  <p className="text-xs text-muted-foreground">
                    {pendingNeeds} pending, {fulfilledNeeds} fulfilled
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                  <div className="h-2 w-2 bg-red-500 rounded-full" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{highPriorityNeeds}</div>
                  <p className="text-xs text-muted-foreground">Urgent attention needed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
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
                  <div className="text-2xl font-bold">{fulfilledNeeds}</div>
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
                  <Button onClick={() => setIsSubmittingNeed(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Need
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {needs.slice(0, 3).map((need) => (
                    <div key={need.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {need.image_url && (
                          <img
                            src={need.image_url}
                            alt={need.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{need.title}</h4>
                            <Badge className={getPriorityColor(need.priority)}>
                              {formatPriority(need.priority)}
                            </Badge>
                            <Badge className={getStatusColor(need.status)}>
                              {formatStatus(need.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{need.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Quantity: {need.quantity} • Category: {need.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {needs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No needs submitted yet</p>
                      <p className="text-sm">Submit your first need to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Needs Tab */}
          <TabsContent value="needs" className="space-y-6">
            {isSubmittingNeed ? (
              <SubmitNeedForm
                onSubmit={handleCreateNeed}
                onCancel={() => setIsSubmittingNeed(false)}
              />
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>All School Needs</CardTitle>
                      <CardDescription>Manage and track all submitted needs</CardDescription>
                    </div>
                    <Button onClick={() => setIsSubmittingNeed(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Need
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {needs.map((need) => (
                      <div key={need.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          {need.image_url && (
                            <img
                              src={need.image_url}
                              alt={need.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{need.title}</h4>
                              <Badge className={getPriorityColor(need.priority)}>
                                {formatPriority(need.priority)}
                              </Badge>
                              <Badge className={getStatusColor(need.status)}>
                                {formatStatus(need.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{need.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Quantity: {need.quantity} • Category: {need.category} • Created: {new Date(need.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {needs.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No needs submitted yet</p>
                        <p className="text-sm">Submit your first need to get started</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {isEditingProfile ? (
              <EditSchoolProfile
                school={school}
                onUpdate={handleUpdateSchool}
                onCancel={() => setIsEditingProfile(false)}
              />
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>School Profile</CardTitle>
                      <CardDescription>View and edit your school information</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setIsEditingProfile(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500">School Name</label>
                      <p className="mt-1 text-sm">{school.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Number of Students</label>
                      <p className="mt-1 text-sm flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {school.number_of_students}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Governorate</label>
                      <p className="mt-1 text-sm flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {school.governorate || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="mt-1 text-sm flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {school.contact_phone || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="mt-1 text-sm flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {school.contact_email || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="mt-1 text-sm">{school.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="mt-1 text-sm">{school.description || 'No description provided'}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
