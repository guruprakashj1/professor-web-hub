
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePortalData } from '@/hooks/usePortalData';
import { EducationItem, Certification } from '@/types/portalData';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

const EducationEditor = () => {
  const { data, createItem, updateItem, deleteItem } = usePortalData();
  
  // Education state
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [showAddEducationForm, setShowAddEducationForm] = useState(false);
  const [educationFormData, setEducationFormData] = useState<Partial<EducationItem>>({});

  // Certification state
  const [editingCertificationId, setEditingCertificationId] = useState<string | null>(null);
  const [showAddCertificationForm, setShowAddCertificationForm] = useState(false);
  const [certificationFormData, setCertificationFormData] = useState<Partial<Certification>>({});

  // Sync education form data when editing an existing item
  useEffect(() => {
    if (editingEducationId && data?.education) {
      const item = data.education.find(edu => edu.id === editingEducationId);
      if (item) {
        setEducationFormData(item);
      }
    }
  }, [editingEducationId, data?.education]);

  // Sync certification form data when editing an existing item
  useEffect(() => {
    if (editingCertificationId && data?.certifications) {
      const item = data.certifications.find(cert => cert.id === editingCertificationId);
      if (item) {
        setCertificationFormData(item);
      }
    }
  }, [editingCertificationId, data?.certifications]);

  // Education handlers
  const handleEducationSave = () => {
    try {
      if (editingEducationId) {
        updateItem('education', editingEducationId, educationFormData);
        toast({
          title: "Education Updated",
          description: "Education item has been updated successfully.",
        });
      } else {
        createItem('education', educationFormData as Omit<EducationItem, 'id'>);
        toast({
          title: "Education Added",
          description: "New education item has been added successfully.",
        });
      }
      resetEducationForm();
    } catch (err) {
      toast({
        title: "Save Failed",
        description: "Failed to save education item.",
        variant: "destructive",
      });
    }
  };

  const handleEducationDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this education item?')) {
      try {
        deleteItem('education', id);
        toast({
          title: "Education Deleted",
          description: "Education item has been deleted successfully.",
        });
      } catch (err) {
        toast({
          title: "Delete Failed",
          description: "Failed to delete education item.",
          variant: "destructive",
        });
      }
    }
  };

  // Certification handlers
  const handleCertificationSave = () => {
    try {
      if (editingCertificationId) {
        updateItem('certifications', editingCertificationId, certificationFormData);
        toast({
          title: "Certification Updated",
          description: "Certification has been updated successfully.",
        });
      } else {
        createItem('certifications', certificationFormData as Omit<Certification, 'id'>);
        toast({
          title: "Certification Added",
          description: "New certification has been added successfully.",
        });
      }
      resetCertificationForm();
    } catch (err) {
      toast({
        title: "Save Failed",
        description: "Failed to save certification.",
        variant: "destructive",
      });
    }
  };

  const handleCertificationDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        deleteItem('certifications', id);
        toast({
          title: "Certification Deleted",
          description: "Certification has been deleted successfully.",
        });
      } catch (err) {
        toast({
          title: "Delete Failed",
          description: "Failed to delete certification.",
          variant: "destructive",
        });
      }
    }
  };

  // Education form helpers
  const startEditEducation = (item: EducationItem) => {
    setEducationFormData(item);
    setEditingEducationId(item.id);
    setShowAddEducationForm(false);
  };

  const startAddEducation = () => {
    setEducationFormData({
      degree: '',
      institution: '',
      year: '',
      location: '',
      description: '',
      advisor: '',
      achievements: []
    });
    setEditingEducationId(null);
    setShowAddEducationForm(true);
  };

  const resetEducationForm = () => {
    setEducationFormData({});
    setEditingEducationId(null);
    setShowAddEducationForm(false);
  };

  // Certification form helpers
  const startEditCertification = (item: Certification) => {
    setCertificationFormData(item);
    setEditingCertificationId(item.id);
    setShowAddCertificationForm(false);
  };

  const startAddCertification = () => {
    setCertificationFormData({
      title: '',
      organization: '',
      year: ''
    });
    setEditingCertificationId(null);
    setShowAddCertificationForm(true);
  };

  const resetCertificationForm = () => {
    setCertificationFormData({});
    setEditingCertificationId(null);
    setShowAddCertificationForm(false);
  };

  const addAchievement = (achievement: string) => {
    if (achievement.trim()) {
      setEducationFormData({
        ...educationFormData,
        achievements: [...(educationFormData.achievements || []), achievement.trim()]
      });
    }
  };

  const removeAchievement = (index: number) => {
    setEducationFormData({
      ...educationFormData,
      achievements: educationFormData.achievements?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <Tabs defaultValue="education" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="education">Academic Education</TabsTrigger>
        <TabsTrigger value="certifications">Certifications</TabsTrigger>
      </TabsList>

      <TabsContent value="education" className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Education Management</h3>
          <Button onClick={startAddEducation} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Education</span>
          </Button>
        </div>

        {(showAddEducationForm || editingEducationId) && (
          <Card>
            <CardHeader>
              <CardTitle>{editingEducationId ? 'Edit Education' : 'Add New Education'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Degree</label>
                  <Input
                    value={educationFormData.degree || ''}
                    onChange={(e) => setEducationFormData({ ...educationFormData, degree: e.target.value })}
                    placeholder="Ph.D. in Computer Science"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Institution</label>
                  <Input
                    value={educationFormData.institution || ''}
                    onChange={(e) => setEducationFormData({ ...educationFormData, institution: e.target.value })}
                    placeholder="Stanford University"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Year</label>
                  <Input
                    value={educationFormData.year || ''}
                    onChange={(e) => setEducationFormData({ ...educationFormData, year: e.target.value })}
                    placeholder="2008"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={educationFormData.location || ''}
                    onChange={(e) => setEducationFormData({ ...educationFormData, location: e.target.value })}
                    placeholder="Stanford, CA"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={educationFormData.description || ''}
                  onChange={(e) => setEducationFormData({ ...educationFormData, description: e.target.value })}
                  placeholder="Dissertation or additional details"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Advisor (Optional)</label>
                <Input
                  value={educationFormData.advisor || ''}
                  onChange={(e) => setEducationFormData({ ...educationFormData, advisor: e.target.value })}
                  placeholder="Dr. Jane Smith"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Achievements</label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    placeholder="Add achievement"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addAchievement((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <Button 
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      addAchievement(input.value);
                      input.value = '';
                    }}
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {educationFormData.achievements?.map((achievement, index) => (
                    <div key={index} className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      <span>{achievement}</span>
                      <button
                        onClick={() => removeAchievement(index)}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleEducationSave} className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </Button>
                <Button variant="outline" onClick={resetEducationForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {data?.education?.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{item.degree}</h4>
                    <p className="text-blue-600 font-medium">{item.institution}</p>
                    <p className="text-gray-600">{item.year} • {item.location}</p>
                    <p className="text-gray-700 mt-2">{item.description}</p>
                    {item.advisor && <p className="text-gray-600 mt-1"><strong>Advisor:</strong> {item.advisor}</p>}
                    {item.achievements.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.achievements.map((achievement, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {achievement}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => startEditEducation(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEducationDelete(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="certifications" className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Certifications Management</h3>
          <Button onClick={startAddCertification} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Certification</span>
          </Button>
        </div>

        {(showAddCertificationForm || editingCertificationId) && (
          <Card>
            <CardHeader>
              <CardTitle>{editingCertificationId ? 'Edit Certification' : 'Add New Certification'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={certificationFormData.title || ''}
                    onChange={(e) => setCertificationFormData({ ...certificationFormData, title: e.target.value })}
                    placeholder="Certified Data Scientist"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Organization</label>
                  <Input
                    value={certificationFormData.organization || ''}
                    onChange={(e) => setCertificationFormData({ ...certificationFormData, organization: e.target.value })}
                    placeholder="Data Science Council of America"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Year</label>
                  <Input
                    value={certificationFormData.year || ''}
                    onChange={(e) => setCertificationFormData({ ...certificationFormData, year: e.target.value })}
                    placeholder="2020"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleCertificationSave} className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </Button>
                <Button variant="outline" onClick={resetCertificationForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.certifications?.map((cert) => (
            <Card key={cert.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{cert.title}</h4>
                    <p className="text-gray-600 text-sm mb-2">{cert.organization}</p>
                    <p className="text-gray-500 text-xs">{cert.year}</p>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <Button variant="outline" size="sm" onClick={() => startEditCertification(cert)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleCertificationDelete(cert.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default EducationEditor;
