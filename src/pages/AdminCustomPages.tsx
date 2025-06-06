
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminHeader from '@/components/AdminHeader';
import CreateCustomPageModal from '@/components/CreateCustomPageModal';
import EditCustomPageModal from '@/components/EditCustomPageModal';
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  const isRTL = i18n.language === 'ar';
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<CustomPage | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<CustomPage | null>(null);

  const { data: pages, isLoading } = useQuery({
    queryKey: ['custom-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_pages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CustomPage[];
    },
  });

  const deletePageMutation = useMutation({
    mutationFn: async (pageId: string) => {
      const { error } = await supabase
        .from('custom_pages')
        .delete()
        .eq('id', pageId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: t('customPages.success'),
        description: t('customPages.pageDeleted'),
      });
      queryClient.invalidateQueries({ queryKey: ['custom-pages'] });
      setDeleteDialogOpen(false);
      setPageToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('customPages.deleteError'),
        variant: 'destructive',
      });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ pageId, published }: { pageId: string; published: boolean }) => {
      const { error } = await supabase
        .from('custom_pages')
        .update({ published, updated_at: new Date().toISOString() })
        .eq('id', pageId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-pages'] });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('customPages.toggleError'),
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (page: CustomPage) => {
    setSelectedPage(page);
    setEditModalOpen(true);
  };

  const handleDelete = (page: CustomPage) => {
    setPageToDelete(page);
    setDeleteDialogOpen(true);
  };

  const handleTogglePublish = (page: CustomPage) => {
    togglePublishMutation.mutate({
      pageId: page.id,
      published: !page.published
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`flex justify-between items-center mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t('customPages.title')}</h2>
            <p className="text-muted-foreground">{t('customPages.description')}</p>
          </div>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('customPages.createNew')}
          </Button>
        </div>

        {pages && pages.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <Card key={page.id} className="relative">
                <CardHeader>
                  <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <CardTitle className={`text-lg font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
                      {page.subject}
                    </CardTitle>
                    <Badge variant={page.published ? 'default' : 'secondary'}>
                      {page.published ? t('customPages.published') : t('customPages.draft')}
                    </Badge>
                  </div>
                  <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                    /{page.slug}
                  </p>
                </CardHeader>
                <CardContent>
                  <div 
                    className={`text-sm text-muted-foreground mb-4 line-clamp-3 ${isRTL ? 'text-right' : 'text-left'}`}
                    dangerouslySetInnerHTML={{ 
                      __html: page.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                    }}
                  />
                  
                  <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(page)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {t('common.edit')}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublish(page)}
                      disabled={togglePublishMutation.isPending}
                    >
                      {page.published ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          {t('customPages.unpublish')}
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          {t('customPages.publish')}
                        </>
                      )}
                    </Button>
                    
                    {page.published && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/${page.slug}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        {t('customPages.view')}
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(page)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {t('common.delete')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">{t('customPages.noPages')}</p>
              <Button onClick={() => setCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('customPages.createFirst')}
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <CreateCustomPageModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      <EditCustomPageModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        page={selectedPage}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('customPages.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('customPages.confirmDeleteDescription', { title: pageToDelete?.subject })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pageToDelete && deletePageMutation.mutate(pageToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCustomPages;
