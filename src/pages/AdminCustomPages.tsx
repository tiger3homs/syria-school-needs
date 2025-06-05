
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AdminHeader from '@/components/AdminHeader';
import CreateCustomPageModal from '@/components/CreateCustomPageModal';
import EditCustomPageModal from '@/components/EditCustomPageModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface CustomPage {
  id: string;
  subject: string;
  slug: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const AdminCustomPages = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';
  
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<CustomPage | null>(null);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('custom_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching custom pages:', error);
      toast({
        title: t('admin.customPages.error'),
        description: t('admin.customPages.fetchError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (pageId: string) => {
    try {
      const { error } = await supabaseAdmin
        .from('custom_pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;

      setPages(pages.filter(page => page.id !== pageId));
      toast({
        title: t('admin.customPages.success'),
        description: t('admin.customPages.deleteSuccess'),
      });
    } catch (error) {
      console.error('Error deleting page:', error);
      toast({
        title: t('admin.customPages.error'),
        description: t('admin.customPages.deleteError'),
        variant: 'destructive',
      });
    }
  };

  const handleTogglePublished = async (pageId: string, published: boolean) => {
    try {
      const { error } = await supabaseAdmin
        .from('custom_pages')
        .update({ published: !published, updated_at: new Date().toISOString() })
        .eq('id', pageId);

      if (error) throw error;

      setPages(pages.map(page => 
        page.id === pageId ? { ...page, published: !published } : page
      ));

      toast({
        title: t('admin.customPages.success'),
        description: t('admin.customPages.statusUpdated'),
      });
    } catch (error) {
      console.error('Error updating page status:', error);
      toast({
        title: t('admin.customPages.error'),
        description: t('admin.customPages.updateError'),
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (page: CustomPage) => {
    setSelectedPage(page);
    setEditModalOpen(true);
  };

  const handlePageCreated = (newPage: CustomPage) => {
    setPages([newPage, ...pages]);
    setCreateModalOpen(false);
  };

  const handlePageUpdated = (updatedPage: CustomPage) => {
    setPages(pages.map(page => 
      page.id === updatedPage.id ? updatedPage : page
    ));
    setEditModalOpen(false);
    setSelectedPage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('admin.customPages.title')}
              </h1>
              <p className="text-gray-600 mt-2">
                {t('admin.customPages.description')}
              </p>
            </div>
            <Button
              onClick={() => setCreateModalOpen(true)}
              className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Plus className="h-4 w-4" />
              {t('admin.customPages.createNew')}
            </Button>
          </div>

          <div className="grid gap-6">
            {pages.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500 mb-4">
                    {t('admin.customPages.noPages')}
                  </p>
                  <Button onClick={() => setCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('admin.customPages.createFirst')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              pages.map((page) => (
                <Card key={page.id}>
                  <CardHeader>
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <CardTitle className="text-xl">{page.subject}</CardTitle>
                        <Badge variant={page.published ? 'default' : 'secondary'}>
                          {page.published ? t('admin.customPages.published') : t('admin.customPages.draft')}
                        </Badge>
                      </div>
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/${page.slug}`, '_blank')}
                          disabled={!page.published}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(page)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('admin.customPages.confirmDelete')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('admin.customPages.deleteWarning')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(page.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {t('common.delete')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className={`flex items-center gap-2 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="font-medium">{t('admin.customPages.slug')}:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded">/{page.slug}</code>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTogglePublished(page.id, page.published)}
                        >
                          {page.published ? t('admin.customPages.unpublish') : t('admin.customPages.publish')}
                        </Button>
                        <span className="text-xs text-gray-500">
                          {t('admin.customPages.lastUpdated')}: {new Date(page.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      <CreateCustomPageModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onPageCreated={handlePageCreated}
      />

      {selectedPage && (
        <EditCustomPageModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          page={selectedPage}
          onPageUpdated={handlePageUpdated}
        />
      )}
    </div>
  );
};

export default AdminCustomPages;
