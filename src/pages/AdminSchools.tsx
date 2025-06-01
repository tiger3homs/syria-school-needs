
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, School, Users, Phone, Mail, MapPin, CheckCircle, XCircle, Filter, GraduationCap, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AdminHeader from "@/components/AdminHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EditSchoolModal } from "@/components/EditSchoolModal";

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
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [updatingSchool, setUpdatingSchool] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSchools = async () => {
    try {
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

      if (error) throw error;
      setSchools(data || []);
    } catch (error: any) {
      console.error('Error fetching schools:', error);
      toast({
        title: t('toast.error'),
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

  const updateSchoolStatus = async (schoolId: string, status: 'approved' | 'rejected') => {
    setUpdatingSchool(schoolId);
    
    try {
      const { error } = await supabaseAdmin
        .from('schools')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', schoolId);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Update local state
      setSchools(schools.map(school => 
        school.id === schoolId ? { ...school, status } : school
      ));
      
      toast({
        title: t('toast.success'),
        description: status === 'approved' ? t('toast.schoolApproved') : t('toast.schoolRejected'),
        variant: status === 'approved' ? 'default' : 'destructive',
      });

      console.log(`School ${schoolId} ${status} successfully`);
    } catch (error: any) {
      console.error('Error updating school status:', error);
      toast({
        title: t('toast.error'),
        description: error.message || t('toast.errorUpdatingSchool'),
        variant: "destructive",
      });
    } finally {
      setUpdatingSchool(null);
    }
  };

  const handleSchoolUpdate = (schoolId: string, updates: Partial<School>) => {
    setSchools(schools.map(school => 
      school.id === schoolId ? { ...school, ...updates } : school
    ));
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
        return <Badge className="bg-green-100 text-green-800">{t('status.approved')}</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">{t('status.rejected')}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">{t('status.pending')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEducationLevelLabel = (level?: string) => {
    switch (level) {
      case 'primary': return t('educationLevels.primary');
      case 'middle': return t('educationLevels.middle');
      case 'high_school': return t('educationLevels.highSchool');
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
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{t('admin.schoolsDirectory.title')}</h2>
          <p className="text-gray-600 mt-2">{t('admin.schoolsDirectory.subtitle')}</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              {t('admin.schoolsDirectory.filters.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('admin.schoolsDirectory.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.schoolsDirectory.filters.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.schoolsDirectory.filters.status')}</SelectItem>
                  <SelectItem value="pending">{t('status.pending')}</SelectItem>
                  <SelectItem value="approved">{t('status.approved')}</SelectItem>
                  <SelectItem value="rejected">{t('status.rejected')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.governorate} onValueChange={(value) => setFilters(prev => ({ ...prev, governorate: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.schoolsDirectory.filters.governorate')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.schoolsDirectory.filters.governorate')}</SelectItem>
                  {uniqueGovernorates.map(gov => (
                    <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.education_level} onValueChange={(value) => setFilters(prev => ({ ...prev, education_level: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.schoolsDirectory.filters.educationLevel')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.schoolsDirectory.filters.educationLevel')}</SelectItem>
                  <SelectItem value="primary">{t('educationLevels.primary')}</SelectItem>
                  <SelectItem value="middle">{t('educationLevels.middle')}</SelectItem>
                  <SelectItem value="high_school">{t('educationLevels.highSchool')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {t('admin.schoolsDirectory.showing')} {filteredSchools.length} {t('admin.schoolsDirectory.of')} {schools.length} {t('admin.schoolsDirectory.schools')}
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
                        {school.number_of_students} {t('school.students').toLowerCase()}
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
                    <div className="text-sm font-medium mb-2">{t('admin.schoolsDirectory.needsSummary.title')}</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-gray-900">{stats.totalNeeds}</div>
                        <div className="text-gray-500">{t('admin.schoolsDirectory.needsSummary.total')}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-orange-600">{stats.pendingNeeds}</div>
                        <div className="text-gray-500">{t('admin.schoolsDirectory.needsSummary.pending')}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">{stats.fulfilledNeeds}</div>
                        <div className="text-gray-500">{t('admin.schoolsDirectory.needsSummary.fulfilled')}</div>
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
                        onClick={() => setEditingSchool(school)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        {t('admin.schoolsDirectory.actions.edit')}
                      </Button>
                      {school.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateSchoolStatus(school.id, 'approved')}
                            disabled={updatingSchool === school.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {updatingSchool === school.id ? t('admin.schoolsDirectory.actions.approving') : t('admin.schoolsDirectory.actions.approve')}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => updateSchoolStatus(school.id, 'rejected')}
                            disabled={updatingSchool === school.id}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            {updatingSchool === school.id ? t('admin.schoolsDirectory.actions.rejecting') : t('admin.schoolsDirectory.actions.reject')}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Recent Needs */}
                  {school.needs.length > 0 && (
                    <div className="pt-3 border-t">
                      <div className="text-sm font-medium mb-2">{t('admin.schoolsDirectory.recentNeeds.title')}</div>
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
                            +{school.needs.length - 3} {t('admin.schoolsDirectory.recentNeeds.moreNeeds')}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.schoolsDirectory.noSchoolsFound')}</h3>
              <p className="text-gray-600">
                {searchTerm ? t('admin.schoolsDirectory.tryAdjusting') : t('admin.schoolsDirectory.noMatch')}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Edit School Modal */}
        <EditSchoolModal
          school={editingSchool}
          isOpen={!!editingSchool}
          onClose={() => setEditingSchool(null)}
          onUpdate={handleSchoolUpdate}
        />
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
