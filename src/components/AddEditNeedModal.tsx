
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from './ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface Need {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  quantity: number;
  status: string;
  image_url: string | null;
  created_at: string;
  fulfilled_at: string | null;
  fulfilled_by: string | null;
  school_id: string | null;
  submitted_by: string | null;
  updated_at: string | null;
}

interface AddEditNeedModalProps {
  need?: Need | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (needData: any) => Promise<boolean>;
}

const CATEGORIES = [
  'furniture',
  'equipment',
  'outdoor',
  'supplies',
  'maintenance',
  'technology',
  'other'
];

const PRIORITIES = ['low', 'medium', 'high'];
const STATUSES = ['pending', 'in_progress', 'fulfilled'];

export const AddEditNeedModal = ({ need, isOpen, onClose, onSubmit }: AddEditNeedModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    quantity: 1,
    status: 'pending',
    image_url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const isEditMode = !!need;

  // Update form data when need changes or modal opens
  useEffect(() => {
    if (need) {
      setFormData({
        title: need.title,
        description: need.description || '',
        category: need.category,
        priority: need.priority,
        quantity: need.quantity,
        status: need.status,
        image_url: need.image_url || ''
      });
    } else {
      // Reset form for new need
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        quantity: 1,
        status: 'pending',
        image_url: ''
      });
    }
  }, [need, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await onSubmit(formData);
    
    if (success) {
      toast({
        title: isEditMode ? t('toast.needUpdated') : t('toast.needCreated'),
        description: isEditMode 
          ? t('toast.needUpdatedDescription') 
          : t('toast.needCreatedDescription'),
      });
      onClose();
    } else {
      toast({
        title: t('common.error'),
        description: isEditMode 
          ? t('toast.failedToUpdateNeed')
          : t('toast.failedToCreateNeed'),
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? t('needs.editNeedTitle') : t('needs.submitNewNeedTitle')}</DialogTitle>
          <DialogDescription>
            {isEditMode ? t('needs.updateNeedDescription') : t('needs.submitNeedDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">{t('form.titleLabel')}</Label>
            <Input
              id="title"
              name="title"
              placeholder={t('form.titlePlaceholder')}
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('form.descriptionLabel')}</Label>
            <Textarea
              id="description"
              name="description"
              placeholder={t('form.descriptionPlaceholder')}
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">{t('form.categoryLabel')}</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('form.selectCategoryPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {t(`categories.${category}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">{t('form.quantityLabel')}</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">{t('form.priorityLabel')}</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('form.selectPriorityPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {t(`priority.${priority}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isEditMode && (
              <div className="space-y-2">
                <Label htmlFor="status">{t('status.status')}</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('status.selectStatusPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {t(`status.${status}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <ImageUpload
            currentImageUrl={formData.image_url}
            onImageUploaded={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
            bucket="need-images"
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('form.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading 
                ? (isEditMode ? t('common.updating') : t('common.submitting')) 
                : (isEditMode ? t('needs.editNeed') : t('needs.submitNeed'))
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
