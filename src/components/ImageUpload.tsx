
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
  bucket: 'need-images' | 'school-images';
  maxSizeMB?: number;
  className?: string;
}

export const ImageUpload = ({ 
  onImageUploaded, 
  currentImageUrl, 
  bucket, 
  maxSizeMB = 5,
  className = "" 
}: ImageUploadProps) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: t("imageUpload.invalidFileTypeTitle"),
        description: t("imageUpload.invalidFileTypeDescription"),
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: t("imageUpload.fileTooLargeTitle"),
        description: t("imageUpload.fileTooLargeDescription", { maxSizeMB }),
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        toast({
          title: t("imageUpload.uploadFailedTitle"),
          description: t("imageUpload.uploadFailedDescription"),
          variant: "destructive",
        });
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      onImageUploaded(publicUrl);
      
      toast({
        title: t("imageUpload.imageUploadedTitle"),
        description: t("imageUpload.imageUploadedDescription"),
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: t("imageUpload.uploadFailedTitle"),
        description: t("imageUpload.unexpectedErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeImage = () => {
    onImageUploaded('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{t("imageUpload.imageLabel")}</Label>
      
      {currentImageUrl ? (
        <div className="relative">
          <img
            src={currentImageUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <Image className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">
            {t("imageUpload.dragAndDropText")}
          </p>
          <p className="text-xs text-gray-500">
            {t("imageUpload.fileTypeAndSizeInfo", { maxSizeMB })}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? t("imageUpload.uploadingButton") : t("imageUpload.chooseFileButton")}
          </Button>
        </div>
      )}
      
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
