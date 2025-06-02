
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabaseAdmin } from "@/lib/supabase-admin";

interface QuickStatusEditorProps {
  schoolId: string;
  currentStatus: string;
  schoolName: string;
  onStatusUpdate: () => void;
}

const QuickStatusEditor = ({ schoolId, currentStatus, schoolName, onStatusUpdate }: QuickStatusEditorProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">{t(`status.${status}`)}</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">{t(`status.${status}`)}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">{t(`status.${status}`)}</Badge>;
      default:
        return <Badge variant="outline">{t(`status.${status}`)}</Badge>;
    }
  };

  const handleSave = async () => {
    if (newStatus === currentStatus) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabaseAdmin
        .from('schools')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', schoolId);

      if (error) throw error;

      toast({
        title: t('toast.statusUpdated'),
        description: t('toast.statusUpdatedDescription', { schoolName }),
      });

      onStatusUpdate();
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: t('toast.errorUpdatingStatus'),
        description: error.message,
        variant: "destructive",
      });
      setNewStatus(currentStatus); // Reset to original status
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setNewStatus(currentStatus);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center space-x-2">
        {getStatusBadge(currentStatus)}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="h-6 w-6 p-0"
        >
          <Edit className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Select value={newStatus} onValueChange={setNewStatus}>
        <SelectTrigger className="w-32 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">{t('status.pending')}</SelectItem>
          <SelectItem value="approved">{t('status.approved')}</SelectItem>
          <SelectItem value="rejected">{t('status.rejected')}</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="flex space-x-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSave}
          disabled={isUpdating}
          className="h-6 w-6 p-0"
        >
          <Check className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCancel}
          disabled={isUpdating}
          className="h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default QuickStatusEditor;
