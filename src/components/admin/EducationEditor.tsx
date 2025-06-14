import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePortalData } from '@/hooks/usePortalData';
import { EducationItem } from '@/types/portalData';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

const EducationEditor = () => {
  const { data, createItem, updateItem, deleteItem } = usePortalData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<EducationItem>>({});

  // Sync form data when editing an existing item
  useEffect(() => {
    if (editingId && data?.education) {
      const item = data.education.find(edu => edu.id === editingId);
      if (item) {
        setFormData(item);
      }
    }
  }, [editingId, data?.education]);

  const handleSave = () => {
    try {
      if (editingId) {
        updateItem('education', editingId, formData);
        toast({
          title: "Education Updated",
          description: "Education item has been updated successfully.",
        });
      } else {
        createItem('education', formData as Omit<EducationItem, 'id'>);
        toast({
          title: "Education Added",
          description: "New education item has been added successfully.",
        });
      }
      resetForm();
    } catch (err) {
      toast({
        title: "Save Failed",
        description: "Failed to save education item.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string) => {
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

  const startEdit = (item: EducationItem) => {
    setFormData(item);
    setEditingId(item.id);
    setShowAddForm(false);
  };

  const startAdd = () => {
    setFormData({
      degree: '',
      institution: '',
      year: '',
      location: '',
      description: '',
      advisor: '',
      achievements: []
    });
    setEditingId(null);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setShowAddForm(false);
  };

  const addAchievement = (achievement: string) => {
    if (achievement.trim()) {
      setFormData({
        ...formData,
        achievements: [...(formData.achievements || []), achievement.trim()]
      });
    }
  };

  const removeAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Education Management</h3>
        <Button onClick={startAdd} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </Button>
      </div>

      {(showAddForm || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Education' : 'Add New Education'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Degree</label>
                <Input
                  value={formData.degree || ''}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="Ph.D. in Computer Science"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Institution</label>
                <Input
                  value={formData.institution || ''}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="Stanford University"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Year</label>
                <Input
                  value={formData.year || ''}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2008"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Stanford, CA"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Dissertation or additional details"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Advisor (Optional)</label>
              <Input
                value={formData.advisor || ''}
                onChange={(e) => setFormData({ ...formData, advisor: e.target.value })}
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
                {formData.achievements?.map((achievement, index) => (
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
              <Button onClick={handleSave} className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save</span>
              </Button>
              <Button variant="outline" onClick={resetForm}>
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
                  <Button variant="outline" size="sm" onClick={() => startEdit(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EducationEditor;
