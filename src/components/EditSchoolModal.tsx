
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Loader2 } from "lucide-react";

interface School {
  id?: string;
  name: string;
  address: string;
  governorate: string;
  education_level?: string;
  number_of_students: number;
  contact_phone?: string;
  contact_email?: string;
  description?: string;
  status: string;
  principal_id?: string;
}

interface EditSchoolModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  school?: School | null;
  onSuccess: () => void;
}

const EditSchoolModal = ({ open, onOpenChange, school, onSuccess }: EditSchoolModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<School>({
    name: "",
    address: "",
    governorate: "",
    education_level: "",
    number_of_students: 0,
    contact_phone: "",
    contact_email: "",
    description: "",
    status: "pending"
  });

  const governorates = [
    'tunis', 'ariana', 'ben_arous', 'manouba', 'nabeul', 'zaghouan', 'bizerte',
    'beja', 'jendouba', 'kef', 'siliana', 'kairouan', 'kasserine', 'sidi_bouzid',
    'sousse', 'monastir', 'mahdia', 'sfax', 'gabes', 'medenine', 'tataouine',
    'gafsa', 'tozeur', 'kebili'
  ];

  useEffect(() => {
    if (school) {
      setFormData({
        id: school.id,
        name: school.name || "",
        address: school.address || "",
        governorate: school.governorate || "",
        education_level: school.education_level || "",
        number_of_students: school.number_of_students || 0,
        contact_phone: school.contact_phone || "",
        contact_email: school.contact_email || "",
        description: school.description || "",
        status: school.status || "pending",
        principal_id: school.principal_id
      });
    } else {
      setFormData({
        name: "",
        address: "",
        governorate: "",
        education_level: "",
        number_of_students: 0,
        contact_phone: "",
        contact_email: "",
        description: "",
        status: "pending"
      });
    }
  }, [school]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (school?.id) {
        // Update existing school
        const { error } = await supabaseAdmin
          .from('schools')
          .update({
            name: formData.name,
            address: formData.address,
            governorate: formData.governorate,
            education_level: formData.education_level,
            number_of_students: formData.number_of_students,
            contact_phone: formData.contact_phone,
            contact_email: formData.contact_email,
            description: formData.description,
            status: formData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', school.id);

        if (error) throw error;

        toast({
          title: t('toast.schoolUpdated'),
          description: t('toast.schoolUpdatedDescription'),
        });
      } else {
        // Create new school
        const { error } = await supabaseAdmin
          .from('schools')
          .insert([{
            name: formData.name,
            address: formData.address,
            governorate: formData.governorate,
            education_level: formData.education_level,
            number_of_students: formData.number_of_students,
            contact_phone: formData.contact_phone,
            contact_email: formData.contact_email,
            description: formData.description,
            status: formData.status
          }]);

        if (error) throw error;

        toast({
          title: t('toast.schoolCreated'),
          description: t('toast.schoolCreatedDescription'),
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving school:', error);
      toast({
        title: t('toast.errorSavingSchool'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {school ? t('admin.schools.editSchool') : t('admin.schools.addSchool')}
          </DialogTitle>
          <DialogDescription>
            {school 
              ? t('admin.schools.editSchoolDescription') 
              : t('admin.schools.addSchoolDescription')
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('admin.schools.schoolName')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t('admin.schools.status')} *</Label>
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

            <div className="space-y-2">
              <Label htmlFor="governorate">{t('admin.schools.governorate')} *</Label>
              <Select 
                value={formData.governorate} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, governorate: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.schools.selectGovernorate')} />
                </SelectTrigger>
                <SelectContent>
                  {governorates.map(gov => (
                    <SelectItem key={gov} value={gov}>
                      {t(`governorates.${gov}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="education_level">{t('admin.schools.educationLevel')}</Label>
              <Select 
                value={formData.education_level} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, education_level: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.schools.selectEducationLevel')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">{t('educationLevels.primary')}</SelectItem>
                  <SelectItem value="middle">{t('educationLevels.middle')}</SelectItem>
                  <SelectItem value="high_school">{t('educationLevels.highSchool')}</SelectItem>
                  <SelectItem value="mixed">{t('educationLevels.mixed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="number_of_students">{t('admin.schools.numberOfStudents')} *</Label>
              <Input
                id="number_of_students"
                type="number"
                min="0"
                value={formData.number_of_students}
                onChange={(e) => setFormData(prev => ({ ...prev, number_of_students: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">{t('admin.schools.contactPhone')}</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">{t('admin.schools.contactEmail')}</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t('admin.schools.address')} *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('admin.schools.description')}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {school ? t('common.update') : t('common.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSchoolModal;
