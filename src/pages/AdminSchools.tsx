import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, School, Users, Phone, Mail, MapPin, Eye, CheckCircle, XCircle, Filter, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AdminHeader from "@/components/AdminHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface School {
  id: string;
  name: string;
  address: string;
  governorate: string;
  education_level?: string;
  number_of_students: number;
  contact_phone?: string;
  contact_email?: string;
  status: string;
  created_at: string;
  needs: Array<{
    id: string;
    title: string;
    category: string;
    priority: string;
    status: string;
  }>;
}

const AdminSchoolsComponent = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    governorate: "all",
    education_level: "all"
  });
  const [updatingSchoolId, setUpdatingSchoolId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSchools = async () => {
    try {
      console.log('Fetching schools...');
      const { data, error } = await supabaseAdmin
        .from('schools')
        .select(`
          id,
          name,
          address,
          governorate,
          education_level,
          number_of_students,
          contact_phone,
          contact_email,
          status,
          created_at,
          needs (
            id,
            title,
            category,
            priority,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching schools:', error);
        throw error;
      }
      
      console.log('Fetched schools:', data);
      setSchools(data || []);
    } catch (error: any) {
      console.error('Failed to fetch schools:', error);
      toast({
        title: "Error fetching schools",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    const filtered = schools.filter(school => {
      const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           school.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           school.governorate.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filters.status === "all" || school.status === filters.status;
      const matchesGovernorate = filters.governorate === "all" || school.governorate === filters.governorate;
      const matchesEducationLevel = filters.education_level === "all" || school.education_level === filters.education_level;
      
      return matchesSearch && matchesStatus && matchesGovernorate && matchesEducationLevel;
    });
    setFilteredSchools(filtered);
  }, [schools, searchTerm, filters]);

  const updateSchoolStatus = async (schoolId: string, newStatus: 'approved' | 'rejected') => {
    setUpdatingSchoolId(schoolId);
    
    try {
      console.log(`Updating school ${schoolId} to status: ${newStatus}`);
      
      const { data, error } = await supabaseAdmin
        .from('schools')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', schoolId)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('School updated successfully:', data);

      // Update the local state immediately
      setSchools(prevSchools => 
        prevSchools.map(school => 
          school.id === schoolId 
            ? { ...school, status: newStatus }
            : school
        )
      );
      
      toast({
        title: `School ${newStatus}`,
        description: `The school has been ${newStatus} successfully.`,
        variant: newStatus === 'approved' ? 'default' : 'destructive',
      });

      console.log(`School ${schoolId} successfully ${newStatus}`);
      
    } catch (error: any) {
      console.error('Error updating school status:', error);
      toast({
        title: "Error updating school status",
        description: error.message || 'Failed to update school status',
        variant: "destructive",
      });
    } finally {
      setUpdatingSchoolId(null);
    }
  };

  const getSchoolStats = (school: School) => {
    const totalNeeds = school.needs.length;
    const fulfilledNeeds = school.needs.filter(need => need.status === 'fulfilled').length;
    const pendingNeeds = totalNeeds - fulfilledNeeds;
    const highPriorityNeeds = school.needs.filter(need => need.priority === 'high' && need.status === 'pending').length;

    return { totalNeeds, fulfilledNeeds, pendingNeeds, highPriorityNeeds };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEducationLevelLabel = (level?: string) => {
    switch (level) {
      case 'primary': return 'Primary School';
      case 'middle': return 'Middle School';
      case 'high_school': return 'High School';
      default: return 'Not specified';
    }
  };

  const getEducationLevelBadge = (level?: string) => {
    const label = getEducationLevelLabel(level);
    const colorClass = level === 'primary' ? 'bg-blue-100 text-blue-800' :
                      level === 'middle' ? 'bg-purple-100 text-purple-800' :
                      level === 'high_school' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800';
    
    return <Badge className={colorClass}>{label}</Badge>;
  };

  const uniqueGovernorates = [...new Set(schools.map(school => school.governorate))].filter(Boolean);

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
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Schools Directory</h2>
          <p className="text-gray-600 mt-2">Browse and manage all registered schools</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Search & Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search schools by name, address, or governorate..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.governorate} onValueChange={(value) => setFilters(prev => ({ ...prev, governorate: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Governorates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Governorates</SelectItem>
                  {uniqueGovernorates.map(gov => (
                    <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.education_level} onValueChange={(value) => setFilters(prev => ({ ...prev, education_level: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Education Levels</SelectItem>
                  <SelectItem value="primary">Primary School</SelectItem>
                  <SelectItem value="middle">Middle School</SelectItem>
                  <SelectItem value="high_school">High School</SelectItem>
                </SelectContent>
              </Select>
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
            const isUpdating = updatingSchoolId === school.id;
            
            return (
              <Card key={school.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <School className="h-5 w-5 text-blue-600 mr-2" />
                      <CardTitle className="text-lg">{school.name}</CardTitle>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {getStatusBadge(school.status)}
                      {stats.highPriorityNeeds > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {stats.highPriorityNeeds} urgent
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                    {school.address}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* School Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        {school.number_of_students} students
                      </div>
                      <div className="flex items-center text-sm">
                        <GraduationCap className="h-4 w-4 mr-1" />
                        {getEducationLevelBadge(school.education_level)}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {school.governorate}
                    </div>
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

                  {/* Actions */}
                  <div className="pt-3 border-t">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {school.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateSchoolStatus(school.id, 'approved')}
                            disabled={isUpdating}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {isUpdating ? 'Approving...' : 'Approve'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => updateSchoolStatus(school.id, 'rejected')}
                            disabled={isUpdating}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            {isUpdating ? 'Rejecting...' : 'Reject'}
                          </Button>
                        </>
                      )}
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
                {searchTerm ? 'Try adjusting your search terms.' : 'No schools match your current filters.'}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

const AdminSchools = () => (
  <ProtectedRoute requiredRole="admin">
    <AdminSchoolsComponent />
  </ProtectedRoute>
);

export default AdminSchools;
