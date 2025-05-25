
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { School, Plus, Edit, Eye, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Mock data - this would come from Supabase
  const schoolData = {
    name: "Damascus Elementary School",
    address: "Al-Midan District, Damascus",
    students: 285,
    phone: "+963 11 123 4567",
    email: "principal@damascus-elem.edu",
    description: "A public elementary school serving the Al-Midan community since 1965."
  };

  const needs = [
    {
      id: 1,
      title: "Student Desks",
      category: "Furniture",
      priority: "High",
      quantity: 50,
      description: "Traditional student desks for grades 1-6",
      status: "Pending",
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      title: "Interactive Whiteboard",
      category: "Equipment",
      priority: "Medium",
      quantity: 3,
      description: "Smart whiteboards for modern classroom learning",
      status: "Fulfilled",
      createdAt: "2024-01-10"
    },
    {
      id: 3,
      title: "Playground Equipment",
      category: "Outdoor Facilities",
      priority: "Low",
      quantity: 1,
      description: "Safe playground set for elementary students",
      status: "Pending",
      createdAt: "2024-01-20"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Fulfilled": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Pending": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
              <Button variant="outline" size="sm">
                <Link to="/login">Logout</Link>
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
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">2 pending, 1 fulfilled</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                  <div className="h-2 w-2 bg-red-500 rounded-full" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">Urgent attention needed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Students</CardTitle>
                  <School className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{schoolData.students}</div>
                  <p className="text-xs text-muted-foreground">Total enrollment</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fulfilled</CardTitle>
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
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
                          Quantity: {need.quantity} • Category: {need.category} • Created: {need.createdAt}
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
                    <p className="mt-1 text-sm">{schoolData.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Number of Students</Label>
                    <p className="mt-1 text-sm">{schoolData.students}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Phone</Label>
                    <p className="mt-1 text-sm">{schoolData.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="mt-1 text-sm">{schoolData.email}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Address</Label>
                  <p className="mt-1 text-sm">{schoolData.address}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Description</Label>
                  <p className="mt-1 text-sm">{schoolData.description}</p>
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
