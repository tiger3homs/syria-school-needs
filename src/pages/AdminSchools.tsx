
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { MobileButton } from "@/components/ui/mobile-button";
import { MobileForm, MobileFormSection, MobileFormField } from "@/components/ui/mobile-form";

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t('admin.schools.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-safe-bottom">
      <AdminHeader />
      
      {/* Mobile-First Main Content */}
      <main className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto">
        {/* Mobile-Optimized Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2 truncate">
                {t('admin.schools.directoryTitle')}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t('admin.schools.directoryDescription')}
              </p>
            </div>
            <MobileButton 
              onClick={handleAddSchool} 
              className="w-full sm:w-auto"
              size="default"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t('admin.schools.addSchool')}</span>
              <span className="sm:hidden">{t('common.add')}</span>
            </MobileButton>
          </div>
        </div>

        {/* Mobile-First Search and Filters */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              {t('admin.schools.searchFilters')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {/* Mobile-First Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('admin.schools.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-11 text-base sm:h-10 sm:text-sm"
              />
            </div>
            
            {/* Mobile-First Filter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="h-11 text-base sm:h-10 sm:text-sm">
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
                <SelectTrigger className="h-11 text-base sm:h-10 sm:text-sm">
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
                <SelectTrigger className="h-11 text-base sm:h-10 sm:text-sm">
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
            
            <div className="text-xs sm:text-sm text-muted-foreground">
              {t('admin.schools.showingResults', { count: filteredSchools.length, total: schools.length })}
            </div>
          </CardContent>
        </Card>

        {/* Mobile-First Schools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredSchools.map((school) => {
            const stats = getSchoolStats(school);
            
            return (
              <Card key={school.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center flex-1 min-w-0">
                      <School className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
                      <CardTitle className="text-base sm:text-lg truncate">{school.name}</CardTitle>
                    </div>
                    <div className="flex flex-col space-y-1 items-end flex-shrink-0">
                      <QuickStatusEditor
                        schoolId={school.id}
                        currentStatus={school.status}
                        schoolName={school.name}
                        onStatusUpdate={fetchSchools}
                      />
                      {stats.highPriorityNeeds > 0 && (
                        <Badge variant="destructive" className="text-xs px-1">
                          {stats.highPriorityNeeds} {t('admin.schools.urgent')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription className="flex items-start text-xs sm:text-sm">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mr-1 mt-0.5 flex-shrink-0" />
                    <span className="break-words">{school.address}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3 sm:space-y-4">
                  {/* School Info - Mobile Optimized */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="truncate">{school.number_of_students} {t('admin.schools.students')}</span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm">
                        <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {getEducationLevelBadge(school.education_level)}
                      </div>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="truncate">{t(`governorates.${school.governorate}`)}</span>
                    </div>
                  </div>

                  {/* Contact Info - Mobile Optimized */}
                  {(school.contact_phone || school.contact_email) && (
                    <div className="space-y-1">
                      {school.contact_phone && (
                        <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                          <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                          <span className="truncate">{school.contact_phone}</span>
                        </div>
                      )}
                      {school.contact_email && (
                        <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                          <span className="truncate">{school.contact_email}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Needs Summary - Mobile Optimized */}
                  <div className="pt-2 border-t">
                    <div className="text-xs sm:text-sm font-medium mb-2">{t('admin.schools.needsSummary')}</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-foreground">{stats.totalNeeds}</div>
                        <div className="text-muted-foreground">{t('admin.schools.total')}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-orange-600">{stats.pendingNeeds}</div>
                        <div className="text-muted-foreground">{t('admin.schools.pending')}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">{stats.fulfilledNeeds}</div>
                        <div className="text-muted-foreground">{t('admin.schools.fulfilled')}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions - Mobile Optimized */}
                  <div className="pt-2 border-t">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <MobileButton 
                        variant="outline" 
                        size="sm" 
                        fullWidth
                        onClick={() => handleEditSchool(school)}
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {t('common.edit')}
                      </MobileButton>
                      <MobileButton variant="outline" size="sm" fullWidth>
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {t('admin.schools.view')}
                      </MobileButton>
                    </div>
                  </div>

                  {/* Recent Needs - Mobile Optimized */}
                  {school.needs.length > 0 && (
                    <div className="pt-2 border-t">
                      <div className="text-xs sm:text-sm font-medium mb-2">{t('admin.schools.recentNeeds')}</div>
                      <div className="space-y-1">
                        {school.needs.slice(0, 2).map((need) => (
                          <div key={need.id} className="flex items-center justify-between text-xs">
                            <span className="truncate flex-1 mr-2">{need.title}</span>
                            <div className="flex items-center space-x-1 flex-shrink-0">
                              <Badge variant="outline" className="text-xs px-1">
                                {t(`priority.${need.priority}`)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        {school.needs.length > 2 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{school.needs.length - 2} {t('admin.schools.moreNeeds')}
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

        {/* Empty State - Mobile Optimized */}
        {filteredSchools.length === 0 && (
          <Card>
            <CardContent className="text-center py-8 sm:py-12">
              <School className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">
                {t('admin.schools.noSchoolsFound')}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                {searchTerm ? t('admin.schools.noSchoolsSearchAdjust') : t('admin.schools.noSchoolsFilterAdjust')}
              </p>
              <MobileButton 
                onClick={handleAddSchool}
                className="mx-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('admin.schools.addSchool')}
              </MobileButton>
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
