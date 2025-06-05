
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sanitizeInput } from '@/utils/security';
import RichTextEditor from '@/components/RichTextEditor';

interface EditCustomPageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: any;
  onPageUpdated: (page: any) => void;
}

const EditCustomPageModal = ({ open, onOpenChange, page, onPageUpdated }: EditCustomPageModalProps) => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    subject: '',
    slug: '',
    content: '',
    published: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (page) {
      setFormData({
        subject: page.subject,
        slug: page.slug,
        content: page.content,
        published: page.published,
      });
    }
  }, [page]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = t('admin.customPages.validation.subjectRequired');
    }

    if (!formData.slug.trim()) {
      newErrors.slug = t('admin.customPages.validation.slugRequired');
    } else if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/.test(formData.slug)) {
      newErrors.slug = t('admin.customPages.validation.slugInvalid');
    }

    if (!formData.content.trim()) {
      newErrors.content = t('admin.customPages.validation.contentRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubjectChange = (value: string) => {
    const sanitized = sanitizeInput(value);
    setFormData(prev => ({ ...prev, subject: sanitized }));
    if (errors.subject) {
      setErrors(prev => ({ ...prev, subject: '' }));
    }
  };

  const handleSlugChange = (value: string) => {
    const sanitized = sanitizeInput(value).toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '');
    setFormData(prev => ({ ...prev, slug: sanitized }));
    if (errors.slug) {
      setErrors(prev => ({ ...prev, slug: '' }));
    }
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Check if slug already exists (excluding current page)
      if (formData.slug !== page.slug) {
        const { data: existingPage } = await supabaseAdmin
          .from('custom_pages')
          .select('id')
          .eq('slug', formData.slug)
          .neq('id', page.id)
          .single();

        if (existingPage) {
          setErrors({ slug: t('admin.customPages.validation.slugExists') });
          setLoading(false);
          return;
        }
      }

      const { data, error } = await supabaseAdmin
        .from('custom_pages')
        .update({
          subject: formData.subject,
          slug: formData.slug,
          content: formData.content,
          published: formData.published,
          updated_at: new Date().toISOString(),
        })
        .eq('id', page.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: t('admin.customPages.success'),
        description: t('admin.customPages.updateSuccess'),
      });

      onPageUpdated(data);
    } catch (error) {
      console.error('Error updating page:', error);
      toast({
        title: t('admin.customPages.error'),
        description: t('admin.customPages.updateError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('admin.customPages.editPage')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">{t('admin.customPages.subject')}</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                placeholder={t('admin.customPages.subjectPlaceholder')}
                className={errors.subject ? 'border-red-500' : ''}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              {errors.subject && (
                <p className="text-sm text-red-500">{errors.subject}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">{t('admin.customPages.slug')}</Label>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-1">/</span>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="my-custom-page"
                  className={errors.slug ? 'border-red-500' : ''}
                />
              </div>
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug}</p>
              )}
              <p className="text-xs text-gray-500">
                {t('admin.customPages.slugHelp')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
            />
            <Label htmlFor="published">{t('admin.customPages.published')}</Label>
          </div>

          <div className="space-y-2">
            <Label>{t('admin.customPages.content')}</Label>
            <RichTextEditor
              content={formData.content}
              onChange={handleContentChange}
              placeholder={t('admin.customPages.contentPlaceholder')}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content}</p>
            )}
          </div>

          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button type="submit" disabled={loading}>
              {loading ? t('common.saving') : t('admin.customPages.update')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomPageModal;
