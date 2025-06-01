
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from './ImageUpload';
import { useToast } from '@/hooks/use-toast';

interface School {
  id: string;
  name: string;
  address: string;
  governorate: string | null;
  number_of_students: number;
  contact_phone: string | null;
  contact_email: string | null;
  description: string | null;
  image_url: string | null;
  education_level: string | null;
}

interface EditSchoolProfileProps {
  school: School;
  onUpdate: (updates: Partial<School>) => Promise<boolean>;
  onCancel: () => void;
}

const GOVERNORATES = [
  'Damascus', 'Rif Dimashq', 'Aleppo', 'Homs', 'Hama', 'Latakia',
  'Tartus', 'Deir ez-Zor', 'Raqqa', 'Hasakah', 'Daraa', 'Suwayda',
  'Quneitra', 'Idlib'
];

const EDUCATION_LEVELS = [
  { value: "primary", label: "Primary School" },
  { value: "middle", label: "Middle School" },
  { value: "highSchool", label: "High School" },
  { value: "mixed", label: "Mixed Levels" }
];

export const EditSchoolProfile = ({ school, onUpdate, onCancel }: EditSchoolProfileProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: school.name,
    address: school.address,
    governorate: school.governorate || '',
    number_of_students: school.number_of_students,
    contact_phone: school.contact_phone || '',
    contact_email: school.contact_email || '',
    description: school.description || '',
    image_url: school.image_url || '',
    education_level: school.education_level || '' // This will store the 'value' string
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToUpdate = {
      ...formData,
      education_level: formData.education_level === '' ? null : formData.education_level,
    };

    const success = await onUpdate(dataToUpdate);
    
    if (success) {
      toast({
        title: t('toast.school_profile_updated_title'),
        description: t('toast.school_profile_updated_description'),
      });
      onCancel();
    } else {
      toast({
        title: t('toast.failed_to_update_school_profile_title'),
        description: t('toast.failed_to_update_school_profile_description'),
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "contact_phone") {
      if (value && !value.startsWith("+963")) {
        processedValue = "+963" + value;
      } else if (!value) {
        processedValue = ""; // Allow clearing the input
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === 'number_of_students' ? parseInt(processedValue) || 0 : processedValue
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('school_profile.edit_title')}</CardTitle>
        <CardDescription>{t('school_profile.edit_description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ImageUpload
            currentImageUrl={formData.image_url}
            onImageUploaded={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
            bucket="school-images"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('school_profile.school_name_label')}</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="governorate">{t('school_profile.governorate_label')}</Label>
              <Select 
                value={formData.governorate} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, governorate: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('school_profile.select_governorate_placeholder')} />
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
            <Label htmlFor="address">{t('school_profile.address_label')}</Label>
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
              <Label htmlFor="number_of_students">{t('school_profile.number_of_students_label')}</Label>
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
              <Label htmlFor="contact_phone">{t('school_profile.contact_phone_label')}</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact_email">{t('school_profile.contact_email_label')}</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education_level">{t('school_profile.education_level_label')}</Label>
              <Select 
                value={formData.education_level} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, education_level: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('school_profile.select_education_level_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {t(`educationLevels.${level.value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('school_profile.description_label')}</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('common.saving') : t('school_profile.save_changes_button')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('school_profile.cancel_button')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
