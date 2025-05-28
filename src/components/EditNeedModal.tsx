import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from './ImageUpload';
import { useToast } from '@/hooks/use-toast';

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
}

interface EditNeedModalProps {
  need: Need | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (needId: string, updates: Partial<Need>) => Promise<boolean>;
}

const CATEGORIES = [
  'Books & Educational Materials',
  'Technology & Equipment',
  'Furniture & Fixtures',
  'Sports & Recreation',
  'Art & Music Supplies',
  'Laboratory Equipment',
  'Maintenance & Repairs',
  'Other'
];

const PRIORITIES = ['low', 'medium', 'high'];
const STATUSES = ['pending', 'in_progress', 'fulfilled'];

export const EditNeedModal = ({ need, isOpen, onClose, onUpdate }: EditNeedModalProps) => {
  const [formData, setFormData] = useState({
    title: need?.title || '',
    description: need?.description || '',
    category: need?.category || '',
    priority: need?.priority || 'medium',
    quantity: need?.quantity || 1,
    status: need?.status || 'pending',
    image_url: need?.image_url || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Update form data when need changes
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
    }
  }, [need]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!need) return;

    setIsLoading(true);

    const success = await onUpdate(need.id, formData);
    
    if (success) {
      toast({
        title: "Need updated",
        description: "The need has been successfully updated.",
      });
      onClose();
    } else {
      toast({
        title: "Error",
        description: "Failed to update need. Please try again.",
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

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Need</DialogTitle>
          <DialogDescription>
            Update the details of this need
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
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
              <Label htmlFor="priority">Priority *</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {formatStatus(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <ImageUpload
            currentImageUrl={formData.image_url}
            onImageUploaded={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
            bucket="need-images"
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Need"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
