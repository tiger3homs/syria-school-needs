import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, School, Users, Phone, Mail, MapPin, Eye, Filter, GraduationCap, Plus, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AdminHeader from "@/components/AdminHeader";
import EditSchoolModal from "@/components/EditSchoolModal";
import QuickStatusEditor from "@/components/QuickStatusEditor";
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
  principal_id?: string;
  description?: string;
  needs: Array<{
    id: string;
    title: string;
    category: string;
    priority: string;
    status: string;
  }>;
}

const AdminSchoolsComponent = () => {
  const { t } = useTranslation();
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    governorate: "all",
    education_level: "all"
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
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
          principal_id,
          description,
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
        title: t('toast.errorFetchingSchools'),
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

  const handleEditSchool = (school: School) => {
    setSelectedSchool(school);
    setEditModalOpen(true);
  };

  const handleAddSchool = () => {
    setSelectedSchool(null);
    setEditModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchSchools(); // Refresh the list
  };

  const getSchoolStats = (school: School) => {
    const totalNeeds = school.needs.length;
    const fulfilledNeeds = school.needs.filter(need => need.status === 'fulfilled').length;
    const pendingNeeds = totalNeeds - fulfilledNeeds;
    const highPriorityNeeds = school.needs.filter(need => need.priority === 'high' && need.status === 'pending').length;

    return { totalNeeds, fulfilledNeeds, pendingNeeds, highPriorityNeeds };
  };

  const getEducationLevelLabel = (level?: string) => {
    switch (level) {
      case 'primary': return t('educationLevels.primary');
      case 'middle': return t('educationLevels.middle');
      case 'high_school': return t('educationLevels.highSchool');
      case 'mixed': return t('educationLevels.mixed');
      default: return t('common.notSpecified');
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
          <p className="mt-4 text-gray-600">{t('admin.schools.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{t('admin.schools.directoryTitle')}</h2>
            <p className="text-gray-600 mt-2">{t('admin.schools.directoryDescription')}</p>
          </div>
          <Button onClick={handleAddSchool} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            {t('admin.schools.addSchool')}
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              {t('admin.schools.searchFilters')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('admin.schools.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.schools.allStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.schools.allStatus')}</SelectItem>
                  <SelectItem value="pending">{t('status.pending')}</SelectItem>
                  <SelectItem value="approved">{t('status.approved')}</SelectItem>
                  <SelectItem value="rejected">{t('status.rejected')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.governorate} onValueChange={(value) => setFilters(prev => ({ ...prev, governorate: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.schools.allGovernorates')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.schools.allGovernorates')}</SelectItem>
                  {uniqueGovernorates.map(gov => (
                    <SelectItem key={gov} value={gov}>{t(`governorates.${gov}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.education_level} onValueChange={(value) => setFilters(prev => ({ ...prev, education_level: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.schools.allEducationLevels')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.schools.allEducationLevels')}</SelectItem>
                  <SelectItem value="primary">{t('educationLevels.primary')}</SelectItem>
                  <SelectItem value="middle">{t('educationLevels.middle')}</SelectItem>
                  <SelectItem value="high_school">{t('educationLevels.highSchool')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {t('admin.schools.showingResults', { count: filteredSchools.length, total: schools.length })}
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
                    <div className="flex items-center flex-1">
                      <School className="h-5 w-5 text-blue-600 mr-2" />
                      <CardTitle className="text-lg">{school.name}</CardTitle>
                    </div>
                    <div className="flex flex-col space-y-2 items-end">
                      <QuickStatusEditor
                        schoolId={school.id}
                        currentStatus={school.status}
                        schoolName={school.name}
                        onStatusUpdate={fetchSchools}
                      />
                      {stats.highPriorityNeeds > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {stats.highPriorityNeeds} {t('admin.schools.urgent')}
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
                        {school.number_of_students} {t('admin.schools.students')}
                      </div>
                      <div className="flex items-center text-sm">
                        <GraduationCap className="h-4 w-4 mr-1" />
                        {getEducationLevelBadge(school.education_level)}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {t(`governorates.${school.governorate}`)}
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
                    <div className="text-sm font-medium mb-2">{t('admin.schools.needsSummary')}</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-gray-900">{stats.totalNeeds}</div>
                        <div className="text-gray-500">{t('admin.schools.total')}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-orange-600">{stats.pendingNeeds}</div>
                        <div className="text-gray-500">{t('admin.schools.pending')}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">{stats.fulfilledNeeds}</div>
                        <div className="text-gray-500">{t('admin.schools.fulfilled')}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditSchool(school)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        {t('common.edit')}
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        {t('admin.schools.view')}
                      </Button>
                    </div>
                  </div>

                  {/* Recent Needs */}
                  {school.needs.length > 0 && (
                    <div className="pt-3 border-t">
                      <div className="text-sm font-medium mb-2">{t('admin.schools.recentNeeds')}</div>
                      <div className="space-y-1">
                        {school.needs.slice(0, 3).map((need) => (
                          <div key={need.id} className="flex items-center justify-between text-xs">
                            <span className="truncate flex-1 mr-2">{need.title}</span>
                            <div className="flex items-center space-x-1">
                              <Badge variant="outline" className="text-xs px-1">
                                {t(`priority.${need.priority}`)}
                              </Badge>
                              <Badge 
                                variant={need.status === 'fulfilled' ? 'default' : 'secondary'}
                                className="text-xs px-1"
                              >
                                {t(`status.${need.status}`)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        {school.needs.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{school.needs.length - 3} {t('admin.schools.moreNeeds')}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.schools.noSchoolsFound')}</h3>
              <p className="text-gray-600">
                {searchTerm ? t('admin.schools.noSchoolsSearchAdjust') : t('admin.schools.noSchoolsFilterAdjust')}
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <EditSchoolModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        school={selectedSchool}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

const AdminSchools = () => (
  <ProtectedRoute requiredRole="admin">
    <AdminSchoolsComponent />
  </ProtectedRoute>
);

export default AdminSchools;
