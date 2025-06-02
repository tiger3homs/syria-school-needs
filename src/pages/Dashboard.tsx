import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from 'react-i18next';
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
import { AddEditNeedModal } from "@/components/AddEditNeedModal";
import { DeleteNeedDialog } from "@/components/DeleteNeedDialog";
import { DashboardStats } from "@/components/DashboardStats";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { user, signOut } = useAuth();
  const { school, needs, loading, error, updateSchool, createNeed, updateNeed, deleteNeed } = useSchoolData();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [needModalOpen, setNeedModalOpen] = useState(false);
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
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mt-4 text-gray-600">{t('errors.loginRequired')}</p>
          <Link to="/login" className="text-blue-500">{t('nav.login')}</Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mt-4 text-red-600">{error}</p>
          <p className="text-gray-600">{t('common.tryAgain')}</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('errors.pageNotFound')}</h2>
            <p className="text-gray-600 mb-4">{t('dashboard.mySchool')}</p>
            <p className="text-sm text-gray-500">{t('errors.accessDenied')}</p>
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
      setNeedModalOpen(false);
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
        title: t('needs.deleteNeed'),
        description: t('common.success'),
      });
      setDeletingNeed(null);
    } else {
      toast({
        title: t('common.error'),
        description: t('common.tryAgain'),
        variant: "destructive",
      });
    }
  };

  const handleAddNeed = () => {
    setEditingNeed(null);
    setNeedModalOpen(true);
  };

  const handleEditNeed = (need: any) => {
    setEditingNeed(need);
    setNeedModalOpen(true);
  };

  const handleNeedModalSubmit = async (needData: any) => {
    if (editingNeed) {
      return await handleUpdateNeed(editingNeed.id, needData);
    } else {
      return await handleCreateNeed(needData);
    }
  };

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
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard.welcome')}</h1>
          <p className="text-gray-600">{t('dashboard.mySchool')}</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">{t('dashboard.overview')}</TabsTrigger>
            <TabsTrigger value="needs">{t('dashboard.manageNeeds')}</TabsTrigger>
            <TabsTrigger value="profile">{t('dashboard.profile')}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <DashboardStats needs={needs} school={school} />

            {/* Recent Needs */}
            <Card>
              <CardHeader>
                <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div>
                    <CardTitle>{t('dashboard.recentNeeds')}</CardTitle>
                    <CardDescription>{t('dashboard.stats')}</CardDescription>
                  </div>
                  <Button onClick={handleAddNeed}>
                    <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('needs.addNeed')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`space-y-4 ${isRTL ? 'text-right' : ''}`}>
                  {needs.slice(0, 3).map((need) => (
                    <div key={need.id} className={`flex items-center justify-between p-4 border rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {need.image_url && (
                          <img
                            src={need.image_url}
                            alt={need.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <h4 className="font-medium">{need.title}</h4>
                            <Badge className={getPriorityColor(need.priority)}>
                              {t(`priority.${need.priority}`)}
                            </Badge>
                            <Badge className={getStatusColor(need.status)}>
                              {t(`status.${need.status}`)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{need.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {t('needs.quantity')}: {need.quantity} • {t('needs.category')}: {t(`categories.${need.category}`)}
                          </p>
                        </div>
                      </div>
                      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditNeed(need)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {needs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>{t('needs.noNeeds')}</p>
                      <p className="text-sm">{t('needs.noNeedsDescription')}</p>
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
                <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div>
                    <CardTitle>{t('needs.allNeeds')}</CardTitle>
                    <CardDescription>{t('dashboard.manageNeeds')}</CardDescription>
                  </div>
                  <Button onClick={handleAddNeed}>
                    <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('needs.addNeed')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className={`${isRTL ? 'text-right' : ''}`}>
                {/* Filters */}
                <div className="mb-6 space-y-4">
                  <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="flex-1">
                      <div className="relative">
                        <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4`} />
                        <Input
                          placeholder={t('needs.searchPlaceholder')}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`${isRTL ? 'pr-10' : 'pl-10'}`}
                          dir={isRTL ? 'rtl' : 'ltr'}
                        />
                      </div>
                    </div>
                    <Filter className="h-4 w-4 text-gray-400" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger dir={isRTL ? 'rtl' : 'ltr'}>
                        <SelectValue placeholder={t('needs.filters.allStatuses')} />
                      </SelectTrigger>
                      <SelectContent dir={isRTL ? 'rtl' : 'ltr'}>
                        <SelectItem value="all">{t('needs.filters.allStatuses')}</SelectItem>
                        <SelectItem value="pending">{t('status.pending')}</SelectItem>
                        <SelectItem value="in_progress">{t('status.in_progress')}</SelectItem>
                        <SelectItem value="fulfilled">{t('status.fulfilled')}</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger dir={isRTL ? 'rtl' : 'ltr'}>
                        <SelectValue placeholder={t('needs.filters.allPriorities')} />
                      </SelectTrigger>
                      <SelectContent dir={isRTL ? 'rtl' : 'ltr'}>
                        <SelectItem value="all">{t('needs.filters.allPriorities')}</SelectItem>
                        <SelectItem value="high">{t('priority.high')}</SelectItem>
                        <SelectItem value="medium">{t('priority.medium')}</SelectItem>
                        <SelectItem value="low">{t('priority.low')}</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger dir={isRTL ? 'rtl' : 'ltr'}>
                        <SelectValue placeholder={t('needs.filters.allCategories')} />
                      </SelectTrigger>
                      <SelectContent dir={isRTL ? 'rtl' : 'ltr'}>
                        <SelectItem value="all">{t('needs.filters.allCategories')}</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {t(`categories.${category}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger dir={isRTL ? 'rtl' : 'ltr'}>
                        <SelectValue placeholder={t('needs.filters.sortBy')} />
                      </SelectTrigger>
                      <SelectContent dir={isRTL ? 'rtl' : 'ltr'}>
                        <SelectItem value="newest">{t('needs.filters.newest')}</SelectItem>
                        <SelectItem value="oldest">{t('needs.filters.oldest')}</SelectItem>
                        <SelectItem value="priority">{t('needs.filters.priority')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Needs Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className={`${isRTL ? 'text-right' : ''}`}>{t('needs.title')}</TableHead>
                        <TableHead className={`${isRTL ? 'text-right' : ''}`}>{t('needs.category')}</TableHead>
                        <TableHead className={`${isRTL ? 'text-right' : ''}`}>{t('needs.priority')}</TableHead>
                        <TableHead className={`${isRTL ? 'text-right' : ''}`}>{t('needs.status')}</TableHead>
                        <TableHead className={`${isRTL ? 'text-right' : ''}`}>{t('needs.quantity')}</TableHead>
                        <TableHead className={`${isRTL ? 'text-right' : ''}`}>{t('needs.posted')}</TableHead>
                        <TableHead className="text-right">{t('common.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedNeeds.map((need) => (
                        <TableRow key={need.id}>
                          <TableCell>
                            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                          <TableCell className={`${isRTL ? 'text-right' : ''}`}>{t(`categories.${need.category}`)}</TableCell>
                          <TableCell className={`${isRTL ? 'text-right' : ''}`}>
                            <Badge className={getPriorityColor(need.priority)}>
                              {t(`priority.${need.priority}`)}
                            </Badge>
                          </TableCell>
                          <TableCell className={`${isRTL ? 'text-right' : ''}`}>
                            <Badge className={getStatusColor(need.status)}>
                              {t(`status.${need.status}`)}
                            </Badge>
                          </TableCell>
                          <TableCell className={`${isRTL ? 'text-right' : ''}`}>{need.quantity}</TableCell>
                          <TableCell className={`${isRTL ? 'text-right' : ''}`}>
                            {new Date(need.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className={`flex justify-end gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditNeed(need)}
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
                      <p>{t('needs.noNeeds')}</p>
                      <p className="text-sm">{t('needs.noNeedsDescription')}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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
                  <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <CardTitle>{t('dashboard.profile')}</CardTitle>
                      <CardDescription>{t('dashboard.schoolInfo')}</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setIsEditingProfile(true)}>
                      <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('dashboard.editProfile')}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className={`space-y-6 ${isRTL ? 'text-right' : ''}`}>
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
                    <div dir={isRTL ? 'rtl' : 'ltr'}>
                      <label className="text-sm font-medium text-gray-500">{t('dashboard.schoolNameLabel')}</label>
                      <p className="mt-1 text-sm">{school.name}</p>
                    </div>
                    <div dir={isRTL ? 'rtl' : 'ltr'}>
                      <label className="text-sm font-medium text-gray-500">{t('dashboard.numberOfStudentsLabel')}</label>
                      <p className="mt-1 text-sm flex items-center gap-1">
                        <Users className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                        {school.number_of_students}
                      </p>
                    </div>
                    <div dir={isRTL ? 'rtl' : 'ltr'}>
                      <label className="text-sm font-medium text-gray-500">{t('dashboard.governorateLabel')}</label>
                      <p className="mt-1 text-sm flex items-center gap-1">
                        <MapPin className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                        {school.governorate || t('common.notSpecified')}
                      </p>
                    </div>
                    <div dir={isRTL ? 'rtl' : 'ltr'}>
                      <label className="text-sm font-medium text-gray-500">{t('dashboard.educationLevelLabel')}</label>
                      <p className="mt-1 text-sm">
                        {school.education_level ? t(`educationLevels.${school.education_level}`) : t('common.notSpecified')}
                      </p>
                    </div>
                    <div dir={isRTL ? 'rtl' : 'ltr'}>
                      <label className="text-sm font-medium text-gray-500">{t('dashboard.phoneLabel')}</label>
                      <p className="mt-1 text-sm flex items-center gap-1">
                        <Phone className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                        {school.contact_phone || t('common.notProvided')}
                      </p>
                    </div>
                    <div dir={isRTL ? 'rtl' : 'ltr'}>
                      <label className="text-sm font-medium text-gray-500">{t('dashboard.emailLabel')}</label>
                      <p className="mt-1 text-sm flex items-center gap-1">
                        <Mail className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                        {school.contact_email || t('common.notProvided')}
                      </p>
                    </div>
                  </div>
                  <div dir={isRTL ? 'rtl' : 'ltr'}>
                    <label className="text-sm font-medium text-gray-500">{t('dashboard.addressLabel')}</label>
                    <p className="mt-1 text-sm">{school.address}</p>
                  </div>
                  <div dir={isRTL ? 'rtl' : 'ltr'}>
                    <label className="text-sm font-medium text-gray-500">{t('dashboard.descriptionLabel')}</label>
                    <p className="mt-1 text-sm">{school.description || t('common.noDescriptionProvided')}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Unified Add/Edit Need Modal */}
      <AddEditNeedModal
        need={editingNeed}
        isOpen={needModalOpen}
        onClose={() => {
          setNeedModalOpen(false);
          setEditingNeed(null);
        }}
        onSubmit={handleNeedModalSubmit}
      />

      {/* Delete Need Dialog */}
      <DeleteNeedDialog
        isOpen={!!deletingNeed}
        onClose={() => setDeletingNeed(null)}
        onConfirm={handleDeleteNeed}
        needTitle={deletingNeed?.title || ''}
      />
    </div>
  );
};

export default Dashboard;
