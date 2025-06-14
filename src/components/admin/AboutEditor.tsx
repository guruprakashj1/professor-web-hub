
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePortalData } from '@/hooks/usePortalData';
import { AboutInfo } from '@/types/portalData';
import { toast } from '@/hooks/use-toast';
import { Save, Plus, X, Upload, User } from 'lucide-react';

const AboutEditor = () => {
  const { data, updateAbout } = usePortalData();
  const [formData, setFormData] = useState<AboutInfo>({
    name: '',
    title: '',
    bio: '',
    expertise: [],
    contact: {
      email: '',
      phone: '',
      office: '',
      officeHours: ''
    },
    socialLinks: {}
  });
  const [expertiseInput, setExpertiseInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync form data with loaded portal data
  useEffect(() => {
    if (data?.about) {
      setFormData(data.about);
    }
  }, [data?.about]);

  const handleSave = () => {
    try {
      updateAbout(formData);
      toast({
        title: "About Updated",
        description: "About section has been updated successfully.",
      });
    } catch (err) {
      toast({
        title: "Update Failed",
        description: "Failed to update about section.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setFormData({
            ...formData,
            profilePicture: imageUrl
          });
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid File",
          description: "Please select an image file.",
          variant: "destructive",
        });
      }
    }
  };

  const removeProfilePicture = () => {
    setFormData({
      ...formData,
      profilePicture: undefined
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addExpertise = () => {
    if (expertiseInput.trim()) {
      setFormData({
        ...formData,
        expertise: [...(formData.expertise || []), expertiseInput.trim()]
      });
      setExpertiseInput('');
    }
  };

  const removeExpertise = (index: number) => {
    setFormData({
      ...formData,
      expertise: formData.expertise?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {formData.profilePicture ? (
                <img 
                  src={formData.profilePicture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Picture</span>
              </Button>
              {formData.profilePicture && (
                <Button 
                  onClick={removeProfilePicture} 
                  variant="outline"
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                  <span>Remove</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Academic title"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Professional biography"
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Areas of Expertise</label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={expertiseInput}
                onChange={(e) => setExpertiseInput(e.target.value)}
                placeholder="Add expertise area"
                onKeyPress={(e) => e.key === 'Enter' && addExpertise()}
              />
              <Button onClick={addExpertise} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.expertise?.map((item, index) => (
                <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  <span>{item}</span>
                  <button
                    onClick={() => removeExpertise(index)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                value={formData.contact?.email || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contact: { ...formData.contact, email: e.target.value }
                })}
                placeholder="email@university.edu"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={formData.contact?.phone || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contact: { ...formData.contact, phone: e.target.value }
                })}
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Office</label>
              <Input
                value={formData.contact?.office || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contact: { ...formData.contact, office: e.target.value }
                })}
                placeholder="Office location"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Office Hours</label>
              <Input
                value={formData.contact?.officeHours || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contact: { ...formData.contact, officeHours: e.target.value }
                })}
                placeholder="Office hours"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </Button>
      </div>
    </div>
  );
};

export default AboutEditor;
