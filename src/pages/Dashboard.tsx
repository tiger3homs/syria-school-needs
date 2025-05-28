import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { School, Plus, Edit, Eye, Target, MapPin, Users, Phone, Mail, Trash2, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { useSchoolData } from "@/hooks/useSchoolData";
import { EditSchoolProfile } from "@/components/EditSchoolProfile";
import { SubmitNeedForm } from "@/components/SubmitNeedForm";
import { EditNeedModal } from "@/components/EditNeedModal";
import { DeleteNeedDialog } from "@/components/DeleteNeedDialog";
import { DashboardStats } from "@/components/DashboardStats";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { school, needs, loading, error, updateSchool, createNeed, updateNeed, deleteNeed } = useSchoolData();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSubmittingNeed, setIsSubmittingNeed] = useState(false);
  const [editingNeed, setEditingNeed] = useState(null);
  const [deletingNeed, setDeletingNeed] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const { toast } = useToast();

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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <School className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No School Found</h2>
            <p className="text-gray-600 mb-4">Your account is not linked to any school yet.</p>
            <p className="text-sm text-gray-500">Please contact an administrator to link your account to a school.</p>
          </div>
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

  const handleUpdateNeed = async (needId: string, updates: any) => {
    const success = await updateNeed(needId, updates);
    if (success) {
      setEditingNeed(null);
    }
    return success;
  };

  const handleDeleteNeed = async () => {
    if (!deletingNeed) return;
    
    const success = await deleteNeed(deletingNeed.id);
    if (success) {
      toast({
        title: "Need deleted",
        description: "The need has been successfully deleted.",
      });
      setDeletingNeed(null);
    } else {
      toast({
        title: "Error",
        description: "Failed to delete need. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddNeed = () => {
    setIsSubmittingNeed(true);
  };

  // Filter and sort needs
  const categories = [...new Set(needs.map(need => need.category))];
  
  const filteredAndSortedNeeds = needs
    .filter((need) => {
      if (statusFilter !== "all" && need.status !== statusFilter) return false;
      if (priorityFilter !== "all" && need.priority !== priorityFilter) return false;
      if (categoryFilter !== "all" && need.category !== categoryFilter) return false;
      if (searchQuery && !`${need.title} ${need.description}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === "priority") {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
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
            <DashboardStats needs={needs} school={school} />

            {/* Recent Needs */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recent Needs</CardTitle>
                    <CardDescription>Your latest submitted needs and their status</CardDescription>
                  </div>
                  <Button onClick={handleAddNeed}>
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingNeed(need)}
                        >
                          <Edit className="h-4 w-4" />
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
                    <Button onClick={handleAddNeed}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Need
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="mb-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search needs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Filter className="h-4 w-4 text-gray-400" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="fulfilled">Fulfilled</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priorities</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="oldest">Oldest First</SelectItem>
                          <SelectItem value="priority">Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Needs Table */}
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Need</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAndSortedNeeds.map((need) => (
                          <TableRow key={need.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {need.image_url && (
                                  <img
                                    src={need.image_url}
                                    alt={need.title}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                )}
                                <div>
                                  <div className="font-medium">{need.title}</div>
                                  {need.description && (
                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                      {need.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{need.category}</TableCell>
                            <TableCell>
                              <Badge className={getPriorityColor(need.priority)}>
                                {formatPriority(need.priority)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(need.status)}>
                                {formatStatus(need.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>{need.quantity}</TableCell>
                            <TableCell>
                              {new Date(need.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setEditingNeed(need)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setDeletingNeed(need)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {filteredAndSortedNeeds.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No needs found</p>
                        <p className="text-sm">Try adjusting your filters or add a new need</p>
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
                  {/* School Image */}
                  {school.image_url && (
                    <div className="flex justify-center">
                      <img
                        src={school.image_url}
                        alt={school.name}
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                  
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

      {/* Modals */}
      <EditNeedModal
        need={editingNeed}
        isOpen={!!editingNeed}
        onClose={() => setEditingNeed(null)}
        onUpdate={handleUpdateNeed}
      />

      <DeleteNeedDialog
        isOpen={!!deletingNeed}
        onClose={() => setDeletingNeed(null)}
        onConfirm={handleDeleteNeed}
        needTitle={deletingNeed?.title || ''}
      />

      {isSubmittingNeed && (
        <SubmitNeedForm
          onSubmit={handleCreateNeed}
          onCancel={() => setIsSubmittingNeed(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
