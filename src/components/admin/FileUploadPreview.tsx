
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, ExternalLink, Image, File } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FileUploadPreviewProps {
  label: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  accept?: string;
  maxSize?: number; // in MB
  showUrlInput?: boolean;
  previewClassName?: string;
}

const FileUploadPreview = ({
  label,
  value,
  onChange,
  accept = "image/*",
  maxSize = 10,
  showUrlInput = true,
  previewClassName = "w-32 h-32"
}: FileUploadPreviewProps) => {
  const [urlInput, setUrlInput] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `File size must be less than ${maxSize}MB.`,
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        onChange(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
    }
  };

  const isImage = value && (
    value.startsWith('data:image/') || 
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value)
  );

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">{label}</label>
      
      {/* Current file preview */}
      {value && (
        <Card className="p-4">
          <CardContent className="p-0 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                {isImage ? (
                  <div className={`${previewClassName} rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center`}>
                    <img 
                      src={value} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={() => {
                        toast({
                          title: "Image Load Error",
                          description: "Failed to load image preview.",
                          variant: "destructive",
                        });
                      }}
                    />
                  </div>
                ) : (
                  <div className={`${previewClassName} rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center`}>
                    <File className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              
              <Button 
                onClick={() => onChange(undefined)} 
                variant="outline" 
                size="sm"
                className="ml-2 text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {value.startsWith('http') && (
              <Button 
                onClick={() => window.open(value, '_blank')} 
                variant="outline" 
                size="sm"
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upload section */}
      {!value && (
        <div className="space-y-3">
          {/* File upload */}
          <div>
            <input
              type="file"
              accept={accept}
              onChange={handleFileUpload}
              className="hidden"
              id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            />
            <Button 
              onClick={() => document.getElementById(`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`)?.click()} 
              variant="outline"
              className="w-full flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload File</span>
            </Button>
          </div>

          {/* URL input */}
          {showUrlInput && (
            <div className="flex space-x-2">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Or paste URL here"
                onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
              />
              <Button onClick={handleUrlSubmit} variant="outline" size="sm">
                Add URL
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadPreview;
