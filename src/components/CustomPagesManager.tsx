import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RichTextEditor } from '@/components/RichTextEditor';
import { useCustomPages, CreateCustomPageData, CustomPage } from '@/hooks/useCustomPages';
import { Plus, Edit, Trash2, ExternalLink, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface CustomPageFormData {
  subject: string;
  slug: string;
  content: string;
  published: boolean;
}

export const CustomPagesManager = () => {
  const { t } = useTranslation();
  const { customPages, isLoading, createPage, updatePage, deletePage, isCreating, isUpdating, isDeleting } = useCustomPages();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<CustomPageFormData>({
    defaultValues: {
      subject: '',
      slug: '',
      content: '',
      published: true
    }
  });

  const watchedContent = watch('content');

  const validateSlug = (slug: string) => {
    const slugRegex = /^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/;
    return slugRegex.test(slug) || 'Slug must be URL-safe (alphanumeric, hyphens, underscores only)';
  };

  const onSubmit = (data: CustomPageFormData) => {
    if (editingPage) {
      updatePage({ id: editingPage.id, ...data });
      setEditingPage(null);
    } else {
      createPage(data);
      setIsCreateDialogOpen(false);
    }
    reset();
  };

  const handleEdit = (page: CustomPage) => {
    setEditingPage(page);
    setValue('subject', page.subject);
    setValue('slug', page.slug);
    setValue('content', page.content);
    setValue('published', page.published);
  };

  const handleCancelEdit = () => {
    setEditingPage(null);
    reset();
  };

  const handleDelete = (pageId: string) => {
    deletePage(pageId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('customPages.title')}</h2>
          <p className="text-muted-foreground">{t('customPages.description')}</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('customPages.create')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('customPages.createNew')}</DialogTitle>
              <DialogDescription>
                {t('customPages.createDescription')}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject">{t('customPages.subject')}</Label>
                  <Input
                    id="subject"
                    {...register('subject', { required: 'Subject is required' })}
                    placeholder="Enter page title"
                  />
                  {errors.subject && (
                    <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="slug">{t('customPages.slug')}</Label>
                  <Input
                    id="slug"
                    {...register('slug', { 
                      required: 'Slug is required',
                      validate: validateSlug
                    })}
                    placeholder="e.g., terms-of-service"
                  />
                  {errors.slug && (
                    <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    This will be the URL path: /{watch('slug')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={watch('published')}
                  onCheckedChange={(checked) => setValue('published', checked)}
                />
                <Label htmlFor="published">{t('customPages.published')}</Label>
              </div>
              
              <div>
                <Label>{t('customPages.content')}</Label>
                <RichTextEditor
                  value={watchedContent}
                  onChange={(content) => setValue('content', content)}
                  placeholder="Enter your page content using Markdown formatting..."
                />
                {errors.content && (
                  <p className="text-sm text-destructive mt-1">{errors.content.message}</p>
                )}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? t('common.creating') : t('common.create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Existing Pages List */}
      <div className="grid gap-4">
        {customPages?.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <p className="text-muted-foreground">{t('customPages.noPages')}</p>
                <Button
                  className="mt-4"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('customPages.createFirst')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          customPages?.map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{page.subject}</CardTitle>
                    <CardDescription>
                      <span className="font-mono">/{page.slug}</span>
                      {page.published && (
                        <Badge variant="secondary" className="ml-2">
                          {t('customPages.published')}
                        </Badge>
                      )}
                      {!page.published && (
                        <Badge variant="outline" className="ml-2">
                          {t('customPages.draft')}
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                  
                  <div className="flex gap-2">
                    {page.published && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(page)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('customPages.deleteConfirm')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('customPages.deleteDescription', { title: page.subject })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(page.id)}
                            disabled={isDeleting}
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
                <p className="text-sm text-muted-foreground">
                  {t('customPages.created')}: {new Date(page.created_at).toLocaleDateString()}
                </p>
                {page.updated_at !== page.created_at && (
                  <p className="text-sm text-muted-foreground">
                    {t('customPages.updated')}: {new Date(page.updated_at).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      {editingPage && (
        <Dialog open={!!editingPage} onOpenChange={() => handleCancelEdit()}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('customPages.edit')}</DialogTitle>
              <DialogDescription>
                {t('customPages.editDescription')}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-subject">{t('customPages.subject')}</Label>
                  <Input
                    id="edit-subject"
                    {...register('subject', { required: 'Subject is required' })}
                    placeholder="Enter page title"
                  />
                  {errors.subject && (
                    <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="edit-slug">{t('customPages.slug')}</Label>
                  <Input
                    id="edit-slug"
                    {...register('slug', { 
                      required: 'Slug is required',
                      validate: validateSlug
                    })}
                    placeholder="e.g., terms-of-service"
                  />
                  {errors.slug && (
                    <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-published"
                  checked={watch('published')}
                  onCheckedChange={(checked) => setValue('published', checked)}
                />
                <Label htmlFor="edit-published">{t('customPages.published')}</Label>
              </div>
              
              <div>
                <Label>{t('customPages.content')}</Label>
                <RichTextEditor
                  value={watchedContent}
                  onChange={(content) => setValue('content', content)}
                  placeholder="Enter your page content using Markdown formatting..."
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? t('common.updating') : t('common.update')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
