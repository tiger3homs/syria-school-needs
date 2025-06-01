
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabaseAdmin } from '@/lib/supabase-admin';

interface School {
  id: string;
  name: string;
  address: string;
  governorate: string;
  education_level?: string;
  number_of_students: number;
  contact_phone?: string;
  contact_email?: string;
  description?: string;
  status: string;
}

interface EditSchoolModalProps {
  school: School | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (schoolId: string, updates: Partial<School>) => void;
}

const GOVERNORATES = [
  'Damascus', 'Rif Dimashq', 'Aleppo', 'Homs', 'Hama', 'Latakia',
  'Tartus', 'Deir ez-Zor', 'Raqqa', 'Hasakah', 'Daraa', 'Suwayda',
  'Quneitra', 'Idlib'
];

const EDUCATION_LEVELS = [
  { value: 'primary', label: 'Primary School' },
  { value: 'middle', label: 'Middle School' },
  { value: 'high_school', label: 'High School' }
];

export const EditSchoolModal = ({ school, isOpen, onClose, onUpdate }: EditSchoolModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: school?.name || '',
    address: school?.address || '',
    governorate: school?.governorate || '',
    education_level: school?.education_level || '',
    number_of_students: school?.number_of_students || 0,
    contact_phone: school?.contact_phone || '',
    contact_email: school?.contact_email || '',
    description: school?.description || '',
    status: school?.status || 'pending'
  });

  // Update form data when school prop changes
  useState(() => {
    if (school) {
      setFormData({
        name: school.name,
        address: school.address,
        governorate: school.governorate,
        education_level: school.education_level || '',
        number_of_students: school.number_of_students,
        contact_phone: school.contact_phone || '',
        contact_email: school.contact_email || '',
        description: school.description || '',
        status: school.status
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school) return;

    setIsLoading(true);
    try {
      const { error } = await supabaseAdmin
        .from('schools')
        .update({
          name: formData.name,
          address: formData.address,
          governorate: formData.governorate,
          education_level: formData.education_level || null,
          number_of_students: formData.number_of_students,
          contact_phone: formData.contact_phone || null,
          contact_email: formData.contact_email || null,
          description: formData.description || null,
          status: formData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', school.id);

      if (error) throw error;

      onUpdate(school.id, formData);
      toast({
        title: t('toast.success'),
        description: t('toast.schoolUpdated'),
      });
      onClose();
    } catch (error: any) {
      console.error('Error updating school:', error);
      toast({
        title: t('toast.error'),
        description: error.message || t('toast.unexpectedError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'number_of_students' ? parseInt(value) || 0 : value
    }));
  };

  if (!school) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('admin.schoolsDirectory.editModal.title')}</DialogTitle>
          <DialogDescription>
            {t('admin.schoolsDirectory.editModal.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('school.name')}</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="governorate">{t('school.governorate')}</Label>
              <Select 
                value={formData.governorate} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, governorate: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('form.selectGovernorate')} />
                </SelectTrigger>
                <SelectContent>
                  {GOVERNORATES.map((gov) => (
                    <SelectItem key={gov} value={gov}>
                      {gov}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t('school.address')}</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="education_level">{t('school.educationLevel')}</Label>
              <Select 
                value={formData.education_level} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, education_level: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('form.selectEducationLevel')} />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="number_of_students">{t('form.numberOfStudents')}</Label>
              <Input
                id="number_of_students"
                name="number_of_students"
                type="number"
                value={formData.number_of_students}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t('school.status')}</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{t('status.pending')}</SelectItem>
                  <SelectItem value="approved">{t('status.approved')}</SelectItem>
                  <SelectItem value="rejected">{t('status.rejected')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_phone">{t('school.contactPhone')}</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">{t('school.contactEmail')}</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('school.description')}</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('common.saving') : t('common.save')}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
