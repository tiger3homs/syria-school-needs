
import { useState } from 'react';
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

export const EditSchoolProfile = ({ school, onUpdate, onCancel }: EditSchoolProfileProps) => {
  const [formData, setFormData] = useState({
    name: school.name,
    address: school.address,
    governorate: school.governorate || '',
    number_of_students: school.number_of_students,
    contact_phone: school.contact_phone || '',
    contact_email: school.contact_email || '',
    description: school.description || '',
    image_url: school.image_url || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await onUpdate(formData);
    
    if (success) {
      toast({
        title: "School profile updated",
        description: "Your school information has been successfully updated.",
      });
      onCancel();
    } else {
      toast({
        title: "Error",
        description: "Failed to update school profile. Please try again.",
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
        <CardTitle>Edit School Profile</CardTitle>
        <CardDescription>Update your school information</CardDescription>
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
              <Label htmlFor="name">School Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="governorate">Governorate *</Label>
              <Select 
                value={formData.governorate} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, governorate: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select governorate" />
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
            <Label htmlFor="address">Address *</Label>
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
              <Label htmlFor="number_of_students">Number of Students *</Label>
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
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
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
            <Label htmlFor="description">Description</Label>
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
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
