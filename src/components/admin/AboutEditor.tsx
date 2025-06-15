import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePortalData } from '@/hooks/usePortalData';
import { AboutInfo } from '@/types/portalData';
import { toast } from '@/hooks/use-toast';
import { Save, Plus, X, User, Linkedin, Globe } from 'lucide-react';
import FileUploadPreview from './FileUploadPreview';

const AboutEditor = () => {
  const { data, updateAbout } = usePortalData();
  const [formData, setFormData] = useState<AboutInfo>({
    name: '',
    title: '',
    bio: '',
    expertise: [],
    email: '',
    phone: '',
    profileImage: '',
    location: '',
    officeHours: '',
    linkedin: '',
    researchGate: '',
    contact: {
      email: '',
      phone: '',
      office: '',
      officeHours: ''
    },
    socialLinks: {}
  });
  const [expertiseInput, setExpertiseInput] = useState('');

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

  const updateSocialLink = (platform: string, url: string) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [platform]: url || undefined
      }
    });
  };

  const removeSocialLink = (platform: string) => {
    const newSocialLinks = { ...formData.socialLinks };
    delete newSocialLinks[platform as keyof typeof newSocialLinks];
    setFormData({
      ...formData,
      socialLinks: newSocialLinks
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploadPreview
            label="Profile Picture"
            value={formData.profilePicture}
            onChange={(value) => setFormData({ ...formData, profilePicture: value })}
            accept="image/*"
            maxSize={10}
            previewClassName="w-24 h-24 rounded-full"
          />
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

      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium flex items-center space-x-2">
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </label>
              <div className="flex space-x-2">
                <Input
                  value={formData.socialLinks?.linkedin || ''}
                  onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
                {formData.socialLinks?.linkedin && (
                  <Button 
                    onClick={() => removeSocialLink('linkedin')} 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>ResearchGate</span>
              </label>
              <div className="flex space-x-2">
                <Input
                  value={formData.socialLinks?.researchGate || ''}
                  onChange={(e) => updateSocialLink('researchGate', e.target.value)}
                  placeholder="https://researchgate.net/profile/yourprofile"
                />
                {formData.socialLinks?.researchGate && (
                  <Button 
                    onClick={() => removeSocialLink('researchGate')} 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Google Scholar</span>
              </label>
              <div className="flex space-x-2">
                <Input
                  value={formData.socialLinks?.googleScholar || ''}
                  onChange={(e) => updateSocialLink('googleScholar', e.target.value)}
                  placeholder="https://scholar.google.com/citations?user=yourid"
                />
                {formData.socialLinks?.googleScholar && (
                  <Button 
                    onClick={() => removeSocialLink('googleScholar')} 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>ORCID</span>
              </label>
              <div className="flex space-x-2">
                <Input
                  value={formData.socialLinks?.orcid || ''}
                  onChange={(e) => updateSocialLink('orcid', e.target.value)}
                  placeholder="https://orcid.org/0000-0000-0000-0000"
                />
                {formData.socialLinks?.orcid && (
                  <Button 
                    onClick={() => removeSocialLink('orcid')} 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
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
