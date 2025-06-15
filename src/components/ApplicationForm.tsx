
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Send } from 'lucide-react';
import { ApplicationStorageService } from '@/utils/applicationStorage';
import { toast } from '@/hooks/use-toast';
import FileUploadPreview from './admin/FileUploadPreview';

interface ApplicationFormProps {
  opening: {
    id: string;
    title: string;
  };
  onClose: () => void;
}

const ApplicationForm = ({ opening, onClose }: ApplicationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    qualifications: '',
    portfolioUrl: ''
  });
  const [resumeFile, setResumeFile] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const applicationService = ApplicationStorageService.getInstance();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.email || !formData.qualifications) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert data URL back to file if needed for the service
      let fileToSubmit: File | undefined;
      if (resumeFile && resumeFile.startsWith('data:')) {
        // Create a mock file object for the service
        const response = await fetch(resumeFile);
        const blob = await response.blob();
        fileToSubmit = new File([blob], 'resume.pdf', { type: blob.type });
      }

      await applicationService.saveApplication(
        {
          openingId: opening.id,
          openingTitle: opening.title,
          ...formData,
          resumeUrl: resumeFile // Store the data URL or URL
        },
        fileToSubmit
      );

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully. We will review it and get back to you soon.",
      });

      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-light">Apply for Position</CardTitle>
            <p className="text-gray-600 font-light mt-1">{opening.title}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Full Name *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Phone Number *
                </label>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Email Address *
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Qualifications *
              </label>
              <Textarea
                name="qualifications"
                value={formData.qualifications}
                onChange={handleInputChange}
                placeholder="Describe your relevant qualifications, education, and experience"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Portfolio URL
              </label>
              <Input
                name="portfolioUrl"
                type="url"
                value={formData.portfolioUrl}
                onChange={handleInputChange}
                placeholder="https://yourportfolio.com"
              />
            </div>

            <FileUploadPreview
              label="Resume Upload"
              value={resumeFile}
              onChange={setResumeFile}
              accept=".pdf,.doc,.docx"
              maxSize={5}
              previewClassName="w-full h-20"
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationForm;
