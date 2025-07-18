import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { LuUploadCloud, LuUser, LuX, LuEdit2 } from 'react-icons/lu';

interface AvatarUploadProps {
  initialAvatar?: string;
  onAvatarChange: (file: File | null, previewUrl: string | null) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function AvatarUpload({ 
  initialAvatar, 
  onAvatarChange, 
  className = '', 
  size = 'lg' 
}: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialAvatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Size mappings for the Avatar component
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
    xl: 'h-40 w-40'
  };
  
  // Handle file input changes
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    validateAndProcessFile(file);
  };
  
  // Validate and process the uploaded file
  const validateAndProcessFile = (file: File) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (JPEG, PNG, GIF)',
        variant: 'destructive'
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive'
      });
      return;
    }
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Call the parent's callback
    onAvatarChange(file, url);
    
    toast({
      title: 'Avatar uploaded',
      description: 'Your custom avatar has been set',
    });
  };
  
  // Handle file drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    
    validateAndProcessFile(file);
  };
  
  // Handle drag events
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  // Clear the selected image
  const clearAvatar = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onAvatarChange(null, null);
  };
  
  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div
        className={`relative ${sizeClasses[size]} cursor-pointer rounded-full overflow-hidden transition-all duration-200 group`}
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Avatar className={`${sizeClasses[size]} border-2 ${isDragging ? 'border-primary' : 'border-border'}`}>
          {previewUrl ? (
            <AvatarImage src={previewUrl} alt="Uploaded avatar" />
          ) : (
            <AvatarFallback className="bg-muted flex items-center justify-center text-muted-foreground">
              <LuUser className={size === 'sm' ? 'h-6 w-6' : 'h-10 w-10'} />
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <LuEdit2 className="text-white h-6 w-6" />
        </div>
        
        {previewUrl && (
          <button
            type="button"
            className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              clearAvatar();
            }}
          >
            <LuX className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="flex flex-col items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload avatar"
        />
        
        <div className="flex items-center space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={triggerFileInput}
            className="flex items-center"
          >
            <LuUploadCloud className="mr-1 h-4 w-4" />
            {previewUrl ? 'Change' : 'Upload'}
          </Button>
          
          {previewUrl && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={clearAvatar}
              className="flex items-center"
            >
              <LuX className="mr-1 h-4 w-4" />
              Remove
            </Button>
          )}
        </div>
        
        <Label className="mt-2 text-xs text-muted-foreground text-center">
          Upload a photo for your avatar (max 5MB)
        </Label>
      </div>
    </div>
  );
}