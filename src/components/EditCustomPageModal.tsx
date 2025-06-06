
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import RichTextEditor from './RichTextEditor';

interface CustomPage {
  id: string;
  subject: string;
  slug: string;
  content: string;
  published: boolean;
}

interface EditCustomPageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: CustomPage | null;
}

const EditCustomPageModal = ({ open, onOpenChange, page }: EditCustomPageModalProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    subject: '',
    slug: '',
    content: '',
    published: true
  });

  useEffect(() => {
    if (page) {
      setFormData({
        subject: page.subject,
        slug: page.slug,
        content: page.content,
        published: page.published
      });
    }
  }, [page]);

  const updatePageMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!page) throw new Error('No page selected');

      // Validate slug format
      const slugRegex = /^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/;
      if (!slugRegex.test(data.slug)) {
        throw new Error('Slug must be URL-safe (letters, numbers, hyphens, underscores only)');
      }

      const { data: result, error } = await supabase
        .from('custom_pages')
        .update({
          subject: data.subject,
          slug: data.slug,
          content: data.content,
          published: data.published,
          updated_at: new Date().toISOString()
        })
        .eq('id', page.id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      toast({
        title: t('customPages.success'),
        description: t('customPages.pageUpdated'),
      });
      queryClient.invalidateQueries({ queryKey: ['custom-pages'] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('customPages.updateError'),
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.slug.trim() || !formData.content.trim()) {
      toast({
        title: t('common.error'),
        description: t('customPages.fillAllFields'),
        variant: 'destructive',
      });
      return;
    }
    updatePageMutation.mutate(formData);
  };

  if (!page) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${isRTL ? 'text-right' : 'text-left'}`}>
        <DialogHeader>
          <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
            {t('customPages.editPage')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">{t('customPages.subject')}</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder={t('customPages.subjectPlaceholder')}
                className={isRTL ? 'text-right' : 'text-left'}
                dir={isRTL ? 'rtl' : 'ltr'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">{t('customPages.slug')}</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder={t('customPages.slugPlaceholder')}
                pattern="^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$"
                required
              />
              <p className="text-sm text-muted-foreground">
                {t('customPages.slugHelp')}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('customPages.content')}</Label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              placeholder={t('customPages.contentPlaceholder')}
            />
          </div>

          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="published">{t('customPages.published')}</Label>
          </div>

          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={updatePageMutation.isPending}
            >
              {updatePageMutation.isPending ? t('common.updating') : t('customPages.update')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomPageModal;
